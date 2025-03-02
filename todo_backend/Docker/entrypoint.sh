#! /bin/bash

set -e  # exit on error

python manage.py migrate
python manage.py collectstatic --noinput
python manage.py shell <<EOF
from django.contrib.auth.models import User
if not User.objects.filter(username="${DJANGO_SUPERUSER_USERNAME}").exists():
    print("Creando superusuario por defecto...")
    User.objects.create_superuser(
        username="${DJANGO_SUPERUSER_USERNAME}",
        email="${DJANGO_SUPERUSER_EMAIL}",
        password="${DJANGO_SUPERUSER_PASSWORD}"
    )
else:
    print("El superusuario por defecto ya existe.")
EOF

python manage.py createcachetable

exec python manage.py runserver 0.0.0.0:8000