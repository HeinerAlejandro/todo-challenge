from django.test import TestCase
from django.contrib.auth.models import User

from authentication.serializers import UserSerializer

# Create your tests here.


class UserSerializerTest(TestCase):

    def test_valid_data(self):
        """Prueba que el serializer es válido con datos correctos"""
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "securepassword",
            "password2": "securepassword",
            "first_name": "Test",
            "last_name": "User"
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_passwords_do_not_match(self):
        """Prueba que el serializer lanza error si las contraseñas no coinciden"""
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "securepassword",
            "password2": "otherpassword",
            "first_name": "Test",
            "last_name": "User"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

    def test_username_unique_validation(self):
        """Prueba que no se pueda crear un usuario con un username repetido"""
        User.objects.create_user(username="existinguser", email="old@example.com", password="password123")

        data = {
            "username": "existinguser",
            "email": "test@example.com",
            "password": "securepassword",
            "password2": "securepassword",
            "first_name": "Test",
            "last_name": "User"
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)

    def test_user_creation(self):
        """Prueba que el serializer cree correctamente un usuario"""
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "securepassword",
            "password2": "securepassword",
            "first_name": "New",
            "last_name": "User"
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()

        self.assertEqual(user.username, "newuser")
        self.assertEqual(user.email, "new@example.com")
        self.assertTrue(user.check_password("securepassword"))
