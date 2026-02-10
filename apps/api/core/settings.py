import os
from pathlib import Path
import dj_database_url
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-development-key')

DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# Allowed Hosts
# We explicitly allow these to avoid environment variable misconfigurations
ALLOWED_HOSTS = [
    'api.astraietm.in',
    'astraietm.in',
    'www.astraietm.in',
    'astra-backend-9dbv.onrender.com',
    'localhost',
    '127.0.0.1',
    '.onrender.com',
]

# Merge with environment variables if present
env_hosts = os.environ.get('ALLOWED_HOSTS', '')
if env_hosts:
    ALLOWED_HOSTS.extend(env_hosts.split(','))

ALLOWED_HOSTS = list(set([host.strip() for host in ALLOWED_HOSTS if host.strip()]))

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    
    # Local
    'authentication',
    'events',
    'gallery',
    'ops',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Moved to top for proper CORS handling
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'
AUTH_USER_MODEL = 'authentication.User'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', f'sqlite:///{BASE_DIR / "db.sqlite3"}'),
        conn_max_age=600,
        ssl_require=bool(os.environ.get('DATABASE_URL'))
    )
}

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator' },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS & CSRF Configuration
CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "https://astraietm.in",
    "https://www.astraietm.in",
    "https://api.astraietm.in",
    "http://localhost:3000",
    "http://localhost:5173",
]

# CSRF Trusted Origins (Required for Django 4.0+)
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # HSTS Settings
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # Content Security
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# Email Configuration
# Using SendGrid (works on Render free plan) or Zoho (requires paid Render plan)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# SendGrid Configuration (recommended for Render)
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.sendgrid.net')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_USE_SSL = os.environ.get('EMAIL_USE_SSL', 'False') == 'True'

# For SendGrid: EMAIL_HOST_USER should be 'apikey' and EMAIL_HOST_PASSWORD should be your SendGrid API key
# For Zoho: Use EMAIL_HOST_USER2 and your Zoho password
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'apikey')  # 'apikey' for SendGrid
EMAIL_HOST_PASSWORD = os.environ.get('SENDGRID_API_KEY', os.environ.get('EMAIL_HOST_PASSWORD', ''))
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL2', 'ASTRA Events <contact@astraietm.in>')

# Razorpay Configuration
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
