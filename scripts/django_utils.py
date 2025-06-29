# utils.py - Utilitaires Django pour YVA

import re
import secrets
import string
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import logging
import resend
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

class EmailService:
    """Service d'envoi d'emails pour YVA"""
    
    @staticmethod
    def send_welcome_email(user):
        """Envoyer un email de bienvenue"""
        subject = f"Bienvenue sur YVA, {user.full_name or user.username} !"
        
        message = f"""
        Bonjour {user.full_name or user.username},

        Bienvenue sur YVA - Votre Assistant Virtuel !

        Nous sommes ravis de vous compter parmi nous. YVA est là pour vous accompagner 
        dans votre parcours personnel et professionnel.

        Voici ce que vous pouvez faire avec YVA :
        🎯 Orientation scolaire et professionnelle
        📚 Mini-formations adaptées à vos besoins
        💪 Soutien moral et motivation

        Commencez dès maintenant en vous connectant à votre compte :
        http://localhost:3000/login

        Si vous avez des questions, n'hésitez pas à nous contacter.

        Bonne découverte !
        L'équipe YVA
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            logger.info(f"Email de bienvenue envoyé à {user.email}")
            return True
        except Exception as e:
            logger.error(f"Erreur envoi email bienvenue à {user.email}: {str(e)}")
            return False
    
    @staticmethod
    def send_password_reset_email(user, reset_token):
        """Envoyer un email de réinitialisation de mot de passe"""
        subject = "Réinitialisation de votre mot de passe YVA"
        
        reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
        
        message = f"""
        Bonjour {user.full_name or user.username},

        Vous avez demandé la réinitialisation de votre mot de passe YVA.

        Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
        {reset_url}

        Ce lien est valide pendant 1 heure.

        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

        Cordialement,
        L'équipe YVA
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            logger.info(f"Email de réinitialisation envoyé à {user.email}")
            return True
        except Exception as e:
            logger.error(f"Erreur envoi email réinitialisation à {user.email}: {str(e)}")
            return False

class ValidationService:
    """Service de validation des données"""
    
    @staticmethod
    def validate_email(email):
        """Valider le format d'un email"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password(password):
        """Valider la force d'un mot de passe"""
        errors = []
        
        if len(password) < 8:
            errors.append("Le mot de passe doit contenir au moins 8 caractères")
        
        if not re.search(r'[A-Z]', password):
            errors.append("Le mot de passe doit contenir au moins une majuscule")
        
        if not re.search(r'[a-z]', password):
            errors.append("Le mot de passe doit contenir au moins une minuscule")
        
        if not re.search(r'\d', password):
            errors.append("Le mot de passe doit contenir au moins un chiffre")
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }
    
    @staticmethod
    def validate_phone(phone):
        """Valider un numéro de téléphone togolais"""
        # Format togolais : +228 XX XX XX XX ou 228XXXXXXXX ou XXXXXXXX
        patterns = [
            r'^\+228\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$',  # +228 XX XX XX XX
            r'^228\d{8}$',  # 228XXXXXXXX
            r'^\d{8}$'      # XXXXXXXX
        ]
        
        for pattern in patterns:
            if re.match(pattern, phone.replace(' ', '')):
                return True
        return False

class SecurityService:
    """Service de sécurité"""
    
    @staticmethod
    def generate_secure_token(length=32):
        """Générer un token sécurisé"""
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    @staticmethod
    def generate_verification_code(length=6):
        """Générer un code de vérification numérique"""
        return ''.join(secrets.choice(string.digits) for _ in range(length))
    
    @staticmethod
    def is_safe_redirect_url(url):
        """Vérifier si une URL de redirection est sûre"""
        if not url:
            return False
        
        # Autoriser seulement les URLs relatives ou du même domaine
        allowed_hosts = ['localhost:3000', '127.0.0.1:3000']
        
        if url.startswith('/'):
            return True
        
        for host in allowed_hosts:
            if url.startswith(f'http://{host}') or url.startswith(f'https://{host}'):
                return True
        
        return False

class UserService:
    """Service de gestion des utilisateurs"""
    
    @staticmethod
    def create_user_profile_data(user_data):
        """Créer les données de profil par défaut"""
        return {
            'interests': [],
            'skills': [],
            'goals': [],
            'preferred_communication_style': 'friendly',
            'topics_of_interest': ['orientation', 'formation', 'emploi']
        }
    
    @staticmethod
    def get_user_display_name(user):
        """Obtenir le nom d'affichage de l'utilisateur"""
        if user.full_name:
            return user.full_name
        elif user.first_name and user.last_name:
            return f"{user.first_name} {user.last_name}"
        else:
            return user.username
    
    @staticmethod
    def update_last_activity(user, request):
        """Mettre à jour la dernière activité de l'utilisateur"""
        try:
            # Mettre à jour l'IP de dernière connexion
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            
            user.last_login_ip = ip
            user.save(update_fields=['last_login_ip'])
            
        except Exception as e:
            logger.error(f"Erreur mise à jour activité utilisateur {user.id}: {str(e)}")

class DateTimeService:
    """Service de gestion des dates et heures"""
    
    @staticmethod
    def get_togo_time():
        """Obtenir l'heure actuelle au Togo"""
        return timezone.now()
    
    @staticmethod
    def format_date_french(date):
        """Formater une date en français"""
        months = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ]
        
        return f"{date.day} {months[date.month - 1]} {date.year}"
    
    @staticmethod
    def is_business_hours():
        """Vérifier si nous sommes en heures ouvrables (8h-18h, lun-ven)"""
        now = DateTimeService.get_togo_time()
        
        # Vérifier le jour de la semaine (0=lundi, 6=dimanche)
        if now.weekday() >= 5:  # Samedi ou dimanche
            return False
        
        # Vérifier l'heure (8h-18h)
        return 8 <= now.hour < 18

class LoggingService:
    """Service de logging personnalisé"""
    
    @staticmethod
    def log_user_action(user, action, details=None):
        """Logger une action utilisateur"""
        message = f"Utilisateur {user.id} ({user.email}): {action}"
        if details:
            message += f" - {details}"
        
        logger.info(message)
    
    @staticmethod
    def log_security_event(event_type, details, user=None):
        """Logger un événement de sécurité"""
        message = f"SÉCURITÉ - {event_type}: {details}"
        if user:
            message += f" (Utilisateur: {user.id})"
        
        logger.warning(message)
    
    @staticmethod
    def log_api_error(endpoint, error, user=None):
        """Logger une erreur API"""
        message = f"ERREUR API - {endpoint}: {str(error)}"
        if user:
            message += f" (Utilisateur: {user.id})"
        
        logger.error(message)

# Décorateurs utiles
def log_user_activity(action_name):
    """Décorateur pour logger automatiquement les actions utilisateur"""
    def decorator(func):
        def wrapper(request, *args, **kwargs):
            if hasattr(request, 'user') and request.user.is_authenticated:
                LoggingService.log_user_action(request.user, action_name)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def require_verified_user(func):
    """Décorateur pour exiger un utilisateur vérifié"""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentification requise'}, status=401)
        
        if not request.user.is_verified:
            return JsonResponse({'error': 'Compte non vérifié'}, status=403)
        
        return func(request, *args, **kwargs)
    return wrapper

# Configuration Resend
resend.api_key = settings.RESEND_API_KEY

def send_verification_email(user, verification_token):
    """Envoie un email de vérification à l'utilisateur"""
    
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{verification_token}"
    
    # Template HTML pour l'email
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Vérifiez votre compte YVA</title>
        <style>
            body {{
                font-family: 'Inter', Arial, sans-serif;
                background-color: #0f172a;
                color: #e2e8f0;
                margin: 0;
                padding: 20px;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #1e293b;
                border-radius: 12px;
                padding: 40px;
                border: 1px solid #334155;
            }}
            .logo {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo h1 {{
                color: #60a5fa;
                font-size: 32px;
                font-weight: bold;
                margin: 0;
            }}
            .content {{
                text-align: center;
            }}
            .title {{
                color: #dbeafe;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }}
            .message {{
                color: #cbd5e1;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 30px;
            }}
            .button {{
                display: inline-block;
                background-color: #2563eb;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 30px;
            }}
            .button:hover {{
                background-color: #1d4ed8;
            }}
            .footer {{
                text-align: center;
                color: #64748b;
                font-size: 14px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #334155;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>YVA</h1>
            </div>
            <div class="content">
                <h2 class="title">Bienvenue chez YVA, {user.name} !</h2>
                <p class="message">
                    Merci de vous être inscrit à YVA, votre compagnon virtuel pour un avenir prometteur.
                    <br><br>
                    Pour activer votre compte et commencer votre parcours, veuillez cliquer sur le bouton ci-dessous :
                </p>
                <a href="{verification_url}" class="button">Vérifier mon compte</a>
                <p class="message">
                    Ce lien expirera dans 24 heures pour des raisons de sécurité.
                    <br><br>
                    Si vous n'avez pas créé de compte YVA, vous pouvez ignorer cet email.
                </p>
            </div>
            <div class="footer">
                <p>© 2025 YVA - Votre compagnon pour un avenir meilleur.</p>
                <p>Cet email a été envoyé à {user.email}</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Version texte de l'email
    text_content = f"""
    Bienvenue chez YVA, {user.name} !
    
    Merci de vous être inscrit à YVA, votre compagnon virtuel pour un avenir prometteur.
    
    Pour activer votre compte, veuillez cliquer sur ce lien :
    {verification_url}
    
    Ce lien expirera dans 24 heures pour des raisons de sécurité.
    
    Si vous n'avez pas créé de compte YVA, vous pouvez ignorer cet email.
    
    © 2025 YVA - Votre compagnon pour un avenir meilleur.
    """
    
    try:
        params = {
            "from": "YVA <noreply@yva-togo.com>",
            "to": [user.email],
            "subject": "Vérifiez votre compte YVA",
            "html": html_content,
            "text": text_content,
        }
        
        email = resend.Emails.send(params)
        print(f"Email de vérification envoyé à {user.email}: {email}")
        return True
        
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email de vérification: {e}")
        return False

def send_password_reset_email(user, reset_token):
    """Envoie un email de réinitialisation de mot de passe"""
    
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"
    
    # Template HTML pour l'email
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Réinitialisation de votre mot de passe YVA</title>
        <style>
            body {{
                font-family: 'Inter', Arial, sans-serif;
                background-color: #0f172a;
                color: #e2e8f0;
                margin: 0;
                padding: 20px;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #1e293b;
                border-radius: 12px;
                padding: 40px;
                border: 1px solid #334155;
            }}
            .logo {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo h1 {{
                color: #60a5fa;
                font-size: 32px;
                font-weight: bold;
                margin: 0;
            }}
            .content {{
                text-align: center;
            }}
            .title {{
                color: #dbeafe;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }}
            .message {{
                color: #cbd5e1;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 30px;
            }}
            .button {{
                display: inline-block;
                background-color: #2563eb;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 30px;
            }}
            .button:hover {{
                background-color: #1d4ed8;
            }}
            .footer {{
                text-align: center;
                color: #64748b;
                font-size: 14px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #334155;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>YVA</h1>
            </div>
            <div class="content">
                <h2 class="title">Réinitialisation de mot de passe</h2>
                <p class="message">
                    Bonjour {user.name},
                    <br><br>
                    Vous avez demandé la réinitialisation de votre mot de passe YVA.
                    <br><br>
                    Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                </p>
                <a href="{reset_url}" class="button">Réinitialiser mon mot de passe</a>
                <p class="message">
                    Ce lien expirera dans 1 heure pour des raisons de sécurité.
                    <br><br>
                    Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
                </p>
            </div>
            <div class="footer">
                <p>© 2025 YVA - Votre compagnon pour un avenir meilleur.</p>
                <p>Cet email a été envoyé à {user.email}</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Version texte de l'email
    text_content = f"""
    Réinitialisation de mot de passe - YVA
    
    Bonjour {user.name},
    
    Vous avez demandé la réinitialisation de votre mot de passe YVA.
    
    Cliquez sur ce lien pour créer un nouveau mot de passe :
    {reset_url}
    
    Ce lien expirera dans 1 heure pour des raisons de sécurité.
    
    Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
    
    © 2025 YVA - Votre compagnon pour un avenir meilleur.
    """
    
    try:
        params = {
            "from": "YVA <noreply@yva-togo.com>",
            "to": [user.email],
            "subject": "Réinitialisation de votre mot de passe YVA",
            "html": html_content,
            "text": text_content,
        }
        
        email = resend.Emails.send(params)
        print(f"Email de réinitialisation envoyé à {user.email}: {email}")
        return True
        
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email de réinitialisation: {e}")
        return False
