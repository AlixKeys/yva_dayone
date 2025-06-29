# models.py - Modèles Django pour YVA

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid

class User(AbstractUser):
    """Modèle utilisateur personnalisé pour YVA"""
    
    # Champs supplémentaires
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    
    # Authentification Google
    google_id = models.CharField(max_length=100, blank=True, unique=True, null=True)
    profile_picture = models.URLField(blank=True)
    
    # Statut du compte
    is_verified = models.BooleanField(default=False)
    verification_token = models.UUIDField(default=uuid.uuid4, unique=True)
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    # Préférences YVA
    preferred_language = models.CharField(max_length=10, default='fr')
    notification_preferences = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'yva_users'
        verbose_name = 'Utilisateur YVA'
        verbose_name_plural = 'Utilisateurs YVA'
    
    def __str__(self):
        return f"{self.full_name or self.username} ({self.email})"
    
    @property
    def display_name(self):
        return self.full_name or self.username

class UserProfile(models.Model):
    """Profil étendu de l'utilisateur"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Informations personnelles
    bio = models.TextField(blank=True, max_length=500)
    interests = models.JSONField(default=list)  # Liste des centres d'intérêt
    skills = models.JSONField(default=list)     # Compétences
    goals = models.JSONField(default=list)      # Objectifs
    
    # Parcours éducatif
    education_level = models.CharField(max_length=50, blank=True)
    current_school = models.CharField(max_length=200, blank=True)
    field_of_study = models.CharField(max_length=100, blank=True)
    
    # Situation professionnelle
    employment_status = models.CharField(max_length=50, blank=True)
    current_job = models.CharField(max_length=200, blank=True)
    career_aspirations = models.TextField(blank=True)
    
    # Préférences YVA
    preferred_communication_style = models.CharField(max_length=50, default='friendly')
    topics_of_interest = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'yva_user_profiles'
        verbose_name = 'Profil utilisateur'
        verbose_name_plural = 'Profils utilisateurs'
    
    def __str__(self):
        return f"Profil de {self.user.display_name}"

class PasswordResetToken(models.Model):
    """Tokens pour la réinitialisation de mot de passe"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'yva_password_reset_tokens'
        verbose_name = 'Token de réinitialisation'
        verbose_name_plural = 'Tokens de réinitialisation'
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Token valide pendant 1 heure
            self.expires_at = timezone.now() + timezone.timedelta(hours=1)
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired

class UserSession(models.Model):
    """Sessions utilisateur pour le suivi des connexions"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    device_info = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'yva_user_sessions'
        verbose_name = 'Session utilisateur'
        verbose_name_plural = 'Sessions utilisateurs'
        ordering = ['-last_activity']
    
    def __str__(self):
        return f"Session de {self.user.display_name} - {self.ip_address}"
