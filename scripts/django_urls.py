# urls.py - Configuration des URLs Django pour YVA

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Import des vues d'authentification
from yva_auth.views import (
    SignupView, 
    LoginView, 
    GoogleAuthView, 
    LogoutView, 
    user_profile
)

def api_health(request):
    """Endpoint de santé de l'API"""
    return JsonResponse({
        'status': 'healthy',
        'message': 'YVA API is running',
        'version': '1.0.0'
    })

def api_root(request):
    """Endpoint racine de l'API"""
    return JsonResponse({
        'message': 'Bienvenue sur l\'API YVA',
        'version': '1.0.0',
        'endpoints': {
            'auth': {
                'signup': '/api/auth/signup',
                'login': '/api/auth/login',
                'google-auth': '/api/auth/google-auth',
                'logout': '/api/auth/logout',
                'profile': '/api/auth/profile',
            },
            'health': '/api/health'
        }
    })

# URLs principales
urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Root
    path('api/', api_root, name='api_root'),
    path('api/health/', api_health, name='api_health'),
    
    # Authentication endpoints
    path('api/auth/signup/', SignupView.as_view(), name='signup'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/google-auth/', GoogleAuthView.as_view(), name='google_auth'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/profile/', user_profile, name='user_profile'),
    
    # Autres apps (à ajouter plus tard)
    # path('api/orientation/', include('orientation.urls')),
    # path('api/formations/', include('formations.urls')),
    # path('api/support/', include('support.urls')),
]

# Servir les fichiers media en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Configuration de l'admin
admin.site.site_header = "Administration YVA"
admin.site.site_title = "YVA Admin"
admin.site.index_title = "Tableau de bord YVA"

# Handler d'erreurs personnalisés (optionnel)
def handler404(request, exception):
    return JsonResponse({
        'error': 'Endpoint non trouvé',
        'status_code': 404
    }, status=404)

def handler500(request):
    return JsonResponse({
        'error': 'Erreur interne du serveur',
        'status_code': 500
    }, status=500)
