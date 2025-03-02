from django.db import IntegrityError, transaction
from django.test import TestCase
from django.utils import timezone

from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory

from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status

from rest_framework.authtoken.models import Token

from tasks.models import Tag
from tasks.models import Task

from tasks.serializers import TagSerializer
from tasks.serializers import TaskSerializer

# Create your tests here.


class TagSerializerTest(TestCase):

    def setUp(self):
        """ Configura un usuario y una request simulada para los tests """
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.factory = APIRequestFactory()
        self.request = self.factory.get("/")
        self.request.user = self.user

    def test_valid_tag_creation(self):
        """Prueba que el serializer es válido con datos correctos y asigna el usuario automáticamente"""
        data = {"name": "Finance"}
        serializer = TagSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        tag = serializer.save()
        self.assertEqual(tag.name, "Finance")
        self.assertEqual(tag.user, self.user)

    def test_missing_name_field(self):
        """Prueba que el serializer detecta la falta del campo `name`"""
        data = {}
        serializer = TagSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)


class TaskSerializerTest(TestCase):

    def setUp(self):
        """Configura un usuario, tags y una request simulada para los tests"""
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.factory = APIRequestFactory()
        self.request = self.factory.get("/")
        self.request.user = self.user

        self.tag1 = Tag.objects.create(name="QA", user=self.user)
        self.tag2 = Tag.objects.create(name="Desarrollo", user=self.user)

    def test_valid_task_creation(self):
        """Prueba que el serializer es válido con datos correctos y asigna el usuario automáticamente"""
        future_date = timezone.now() + timezone.timedelta(days=1)
        data = {
            "title": "Completar reporte",
            "description": "Enviar antes del lunes",
            "priority": 2,
            "finish_at": future_date,
            "tags": [self.tag1.id, self.tag2.id]
        }
        serializer = TaskSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        task = serializer.save()
        self.assertEqual(task.title, "Completar reporte")
        self.assertEqual(task.priority, 2)
        self.assertEqual(task.user, self.user)

    def test_priority_out_of_range(self):
        """Prueba que `priority` no acepte valores fuera de 1 a 3"""
        data = {
            "title": "Tarea inválida",
            "priority": 5,
            "finish_at": timezone.now() + timezone.timedelta(days=1)
        }
        serializer = TaskSerializer(data=data, context={"request": self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("priority", serializer.errors)

    def test_finish_at_in_past(self):
        """Prueba que `finish_at` no acepte fechas pasadas"""
        creation_date = timezone.now()
        past_date = timezone.now() - timezone.timedelta(days=1)
        data = {
            "title": "Tarea con fecha incorrecta",
            "priority": 2,
            "created_at": creation_date,
            "finish_at": past_date,
            "tags": [self.tag1.id, self.tag2.id]
        }
        serializer = TaskSerializer(data=data, context={"request": self.request})

        self.assertFalse(serializer.is_valid())
        self.assertIn("finish_at", serializer.errors)

    def test_task_with_tags_read_only(self):
        """Prueba que el serializer devuelve correctamente los tags asociados en modo read-only"""
        task = Task.objects.create(
            title="Revisar código",
            description="Pendiente de revisión",
            priority=1,
            finish_at=timezone.now() + timezone.timedelta(days=3),
            user=self.user
        )
        task.tags.set([self.tag1, self.tag2])

        serializer = TaskSerializer(task)
        self.assertEqual(len(serializer.data["tags"]), 2)
        self.assertEqual(serializer.data["tags_details"][0]["name"], "QA")
        self.assertEqual(serializer.data["tags_details"][1]["name"], "Desarrollo")

    def test_task_with_parent_task(self):
        """Prueba que se pueda asignar una `parent_task` correctamente"""
        parent_task = Task.objects.create(
            title="Tarea principal",
            description="Tarea padre",
            priority=2,
            finish_at=timezone.now() + timezone.timedelta(days=5),
            user=self.user
        )
        data = {
            "title": "Subtarea",
            "description": "Esta es una subtarea",
            "priority": 1,
            "finish_at": timezone.now() + timezone.timedelta(days=2),
            "parent_task": parent_task.id,
            "tags": [self.tag1.id, self.tag2.id]
        }
        serializer = TaskSerializer(data=data, context={"request": self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        task = serializer.save()
        self.assertEqual(task.parent_task, parent_task)


class TagsViewSetTestCase(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="password")

        self.token = Token.objects.get(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        self.url = reverse("tags-list")
        self.tag_data = {"name": "QA"}
        self.tag = Tag.objects.create(name="Desarrollo", user=self.user)

    def test_create_tag(self):
        """Prueba que un usuario autenticado pueda crear un tag"""
        response = self.client.post(self.url, self.tag_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tag.objects.count(), 2)
        self.assertEqual(Tag.objects.last().name, "QA")

    def test_create_tag_unauthenticated(self):
        """Prueba que un usuario no autenticado no pueda crear un tag"""
        self.client.credentials()
        response = self.client.post(self.url, self.tag_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_tags(self):
        """Prueba que un usuario autenticado pueda ver su lista de tags"""
        response = self.client.get(self.url, format="json")
        data = response.json()["results"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 1)

    def test_update_tag(self):
        """Prueba que un usuario autenticado pueda editar su tag"""
        url = reverse("tags-detail", args=[self.tag.id])
        response = self.client.put(url, {"name": "Nuevo nombre"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tag.refresh_from_db()
        self.assertEqual(self.tag.name, "Nuevo nombre")

    def test_delete_tag(self):
        """Prueba que un usuario autenticado pueda eliminar un tag"""
        url = reverse("tags-detail", args=[self.tag.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Tag.objects.count(), 0)


class TasksViewSetTestCase(TestCase):

    def setUp(self):

        self.user = get_user_model().objects.create_user(username="testuser", password="password")

        self.token = Token.objects.get(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        self.tag = Tag.objects.create(name="QA", user=self.user)
        self.task = Task.objects.create(
            title="Tarea de prueba",
            priority=2,
            finish_at="2025-12-01T12:00:00Z",
            user=self.user
        )
        self.task.tags.add(self.tag)
        self.task_data = {
            "title": "Tarea de prueba 2",
            "priority": 2,
            "finish_at": "2025-12-02T12:00:00Z",
            "user": self.user.id,
            "tags": [self.tag.id],
        }
        self.child_task = Task.objects.create(
            title="Tarea hija",
            priority=2,
            finish_at="2025-12-02T12:00:00Z",
            user=self.user,
            parent_task=self.task
        )
        self.task.tags.add(self.tag)

        self.url = reverse('tasks-complete-task', args=[self.task.id])

    def test_mark_task_complete_success(self):

        self.assertFalse(self.task.completed)
        self.assertFalse(self.child_task.completed)

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertTrue(response.data["completed"])

        self.task.refresh_from_db()
        self.assertTrue(self.task.completed)

        self.child_task.refresh_from_db()
        self.assertTrue(self.child_task.completed)

    def test_mark_task_complete_already_completed(self):

        self.task.completed = True
        self.task.save()

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertFalse(self.task.completed)

        self.assertEqual(response.data["completed"], False)

    def test_mark_task_complete_not_found(self):
        url = reverse('tasks-complete-task', args=[999999])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mark_task_complete_transaction(self):
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.client.post(self.url)
                raise IntegrityError("Force rollback")
