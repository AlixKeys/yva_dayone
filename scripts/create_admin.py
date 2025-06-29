#!/usr/bin/env python3
"""
Script pour créer les utilisateurs par défaut de YVA
"""

import os
import sys
import django
from django.contrib.auth.hashers import make_password

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yva_backend.settings')
django.setup()

from yva_auth.models import User, UserProfile

def create_default_users():
    """Créer les utilisateurs par défaut"""
    
    print("🚀 Création des utilisateurs par défaut pour YVA...")
    
    # Utilisateur admin
    admin_email = "admin@yva.com"
    admin_password = "admin"
    
    if not User.objects.filter(email=admin_email).exists():
        admin_user = User.objects.create(
            username=admin_email,
            email=admin_email,
            full_name="Administrateur YVA",
            password=make_password(admin_password),
            is_staff=True,
            is_superuser=True,
            is_verified=True
        )
        
        # Créer le profil admin
        UserProfile.objects.create(
            user=admin_user,
            bio="Administrateur principal de la plateforme YVA",
            interests=["administration", "gestion", "support"],
            skills=["gestion", "support technique", "administration"],
            goals=["maintenir la plateforme", "aider les utilisateurs"]
        )
        
        print(f"✅ Utilisateur admin créé: {admin_email} / {admin_password}")
    else:
        print(f"ℹ️  Utilisateur admin existe déjà: {admin_email}")
    
    # Utilisateur de test
    test_email = "test@yva.com"
    test_password = "test1234"
    
    if not User.objects.filter(email=test_email).exists():
        test_user = User.objects.create(
            username=test_email,
            email=test_email,
            full_name="Utilisateur Test",
            password=make_passwor
