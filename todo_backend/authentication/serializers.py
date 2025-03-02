from django.contrib.auth.models import User

from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import CharField
from rest_framework.serializers import ValidationError
from rest_framework.validators import UniqueValidator


class UserSerializer(ModelSerializer):
    password2 = CharField(style={'input_type': 'password'}, write_only=True)
    username = CharField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Ya existe un usuario con ese nombre.")]
    )

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2", "first_name", "last_name")
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise ValidationError({"password": "Las contraseñas no coinciden."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user