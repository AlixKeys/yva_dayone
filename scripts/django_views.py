# views.py - Vues API pour l'authentification

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from django.utils import timezone
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
import json
import logging
import secrets
import string
from datetime import timedelta
from .models import User, UserProfile, PasswordResetToken
from .serializers import UserSerializer
from .utils import send_verification_email, send_password_reset_email

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class AuthView(View):
    """Vue de base pour l'authentification"""
    
    def dispatch(self, request, *args, **kwargs):
        # Ajouter les headers CORS
        response = super().dispatch(request, *args, **kwargs)
        response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response['Access-Control-Allow-Credentials'] = 'true'
        return response
    
    def options(self, request, *args, **kwargs):
        """Gérer les requêtes OPTIONS pour CORS"""
        return JsonResponse({}, status=200)

class SignupView(AuthView):
    """Inscription d'un nouvel utilisateur"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            
            # Validation des données
            name = data.get('name', '').strip()
            email = data.get('email', '').strip().lower()
            password = data.get('password', '')
            
            if not all([name, email, password]):
                return JsonResponse({
                    'success': False,
                    'message': 'Tous les champs sont requis'
                }, status=400)
            
            if len(password) < 8:
                return JsonResponse({
                    'success': False,
                    'message': 'Le mot de passe doit contenir au moins 8 caractères'
                }, status=400)
            
            # Vérifier si l'utilisateur existe déjà
            if User.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Un compte avec cet email existe déjà'
                }, status=400)
            
            # Créer l'utilisateur
            user = User.objects.create(
                username=email,
                email=email,
                full_name=name,
                password=make_password(password),
                is_verified=True  # Pas de vérification email en mode simple
            )
            
            # Créer le profil utilisateur
            UserProfile.objects.create(user=user)
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            
            logger.info(f"Nouvel utilisateur créé: {email}")
            
            return JsonResponse({
                'success': True,
                'message': 'Compte créé avec succès',
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                },
                'user': {
                    'id': user.id,
                    'name': user.full_name,
                    'email': user.email
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Données JSON invalides'
            }, status=400)
        except Exception as e:
            logger.error(f"Erreur lors de l'inscription: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Erreur interne du serveur'
            }, status=500)

class LoginView(AuthView):
    """Connexion utilisateur"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            
            email = data.get('email', '').strip().lower()
            password = data.get('password', '')
            remember_me = data.get('remember_me', False)
            
            if not all([email, password]):
                return JsonResponse({
                    'success': False,
                    'message': 'Email et mot de passe requis'
                }, status=400)
            
            # Authentifier l'utilisateur
            user = authenticate(request, username=email, password=password)
            
            if user is None:
                # Vérifier si l'utilisateur existe
                if not User.objects.filter(email=email).exists():
                    return JsonResponse({
                        'success': False,
                        'message': 'Aucun compte trouvé avec cet email'
                    }, status=401)
                else:
                    return JsonResponse({
                        'success': False,
                        'message': 'Mot de passe incorrect'
                    }, status=401)
            
            if not user.is_active:
                return JsonResponse({
                    'success': False,
                    'message': 'Compte désactivé'
                }, status=401)
            
            # Connecter l'utilisateur
            login(request, user)
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            
            # Configurer la durée de session
            if remember_me:
                request.session.set_expiry(30 * 24 * 60 * 60)  # 30 jours
            else:
                request.session.set_expiry(0)  # Fermeture du navigateur
            
            # Mettre à jour la dernière connexion
            user.last_login_ip = self.get_client_ip(request)
            user.save(update_fields=['last_login_ip'])
            
            logger.info(f"Connexion réussie: {email}")
            
            return JsonResponse({
                'success': True,
                'message': 'Connexion réussie',
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                },
                'user': {
                    'id': user.id,
                    'name': user.full_name or user.username,
                    'email': user.email
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Données JSON invalides'
            }, status=400)
        except Exception as e:
            logger.error(f"Erreur lors de la connexion: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Erreur interne du serveur'
            }, status=500)
    
    def get_client_ip(self, request):
        """Récupérer l'IP du client"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class GoogleAuthView(AuthView):
    """Authentification Google OAuth"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            token = data.get('token')
            
            if not token:
                return JsonResponse({
                    'success': False,
                    'message': 'Token Google requis'
                }, status=400)
            
            # Vérifier le token Google
            try:
                # En mode développement, on simule la vérification
                # TODO: Décommenter pour la production
                """
                idinfo = id_token.verify_oauth2_token(
                    token, 
                    requests.Request(), 
                    settings.GOOGLE_OAUTH2_CLIENT_ID
                )
                
                if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                    raise ValueError('Wrong issuer.')
                """
                
                # Simulation pour le développement
                idinfo = {
                    'sub': '123456789',
                    'email': 'user@gmail.com',
                    'name': 'Utilisateur Google',
                    'picture': 'https://example.com/photo.jpg'
                }
                
                google_id = idinfo['sub']
                email = idinfo['email']
                name = idinfo.get('name', '')
                picture = idinfo.get('picture', '')
                
                # Chercher ou créer l'utilisateur
                user, created = User.objects.get_or_create(
                    google_id=google_id,
                    defaults={
                        'username': email,
                        'email': email,
                        'full_name': name,
                        'profile_picture': picture,
                        'is_verified': True
                    }
                )
                
                if created:
                    # Créer le profil utilisateur
                    UserProfile.objects.create(user=user)
                    logger.info(f"Nouvel utilisateur Google créé: {email}")
                else:
                    # Mettre à jour les informations
                    user.full_name = name
                    user.profile_picture = picture
                    user.save()
                
                # Générer les tokens JWT
                refresh = RefreshToken.for_user(user)
                
                return JsonResponse({
                    'success': True,
                    'message': 'Connexion Google réussie',
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    },
                    'user': {
                        'id': user.id,
                        'name': user.full_name,
                        'email': user.email,
                        'picture': user.profile_picture
                    }
                })
                
            except ValueError as e:
                logger.error(f"Token Google invalide: {str(e)}")
                return JsonResponse({
                    'success': False,
                    'message': 'Token Google invalide'
                }, status=401)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Données JSON invalides'
            }, status=400)
        except Exception as e:
            logger.error(f"Erreur Google Auth: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Erreur interne du serveur'
            }, status=500)

class LogoutView(AuthView):
    """Déconnexion utilisateur"""
    
    def post(self, request):
        try:
            logout(request)
            return JsonResponse({
                'success': True,
                'message': 'Déconnexion réussie'
            })
        except Exception as e:
            logger.error(f"Erreur lors de la déconnexion: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Erreur lors de la déconnexion'
            }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Récupérer le profil utilisateur"""
    try:
        user = request.user
        profile = user.profile
        
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'phone': user.phone,
                'location': user.location,
                'profile_picture': user.profile_picture,
                'is_verified': user.is_verified,
                'created_at': user.created_at,
                'profile': {
                    'bio': profile.bio,
                    'interests': profile.interests,
                    'skills': profile.skills,
                    'goals': profile.goals,
                    'education_level': profile.education_level,
                    'current_school': profile.current_school,
                    'employment_status': profile.employment_status,
                    'current_job': profile.current_job
                }
            }
        })
    except Exception as e:
        logger.error(f"Erreur récupération profil: {str(e)}")
        return Response({
            'success': False,
            'message': 'Erreur lors de la récupération du profil'
        }, status=500)

# URLs mapping
urlpatterns = [
    # Ajouter ces URLs dans votre urls.py principal
    # path('api/auth/signup', SignupView.as_view(), name='signup'),
    # path('api/auth/login', LoginView.as_view(), name='login'),
    # path('api/auth/google-auth', GoogleAuthView.as_view(), name='google_auth'),
    # path('api/auth/logout', LogoutView.as_view(), name='logout'),
    # path('api/auth/profile', user_profile, name='user_profile'),
]
