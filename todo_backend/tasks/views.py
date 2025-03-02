from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework import status

from django_filters import rest_framework as filters

from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import extend_schema_view

from .models import Tag
from .models import Task

from .serializers import TagSerializer
from .serializers import TaskSerializer

from .filters import TaskFilter

# Create your views here.

@extend_schema_view(
    list=extend_schema(
        summary="Listar Tags",
        description="Retorna la lista completa de Tags.",
        responses={200: TagSerializer},
    ),
    create=extend_schema(
        summary="Crear Tag",
        description="Permite la creación de un nuevo Tag.",
        responses={201: TagSerializer},
    ),
    retrieve=extend_schema(
        summary="Obtener el detalle de un Tag",
        description="Retorna los detalles de un Tag específico.",
        responses={200: TagSerializer},
    ),
    update=extend_schema(
        summary="Actualizar Tag",
        description="Actualiza los datos de un Tag existente.",
        responses={200: TagSerializer},
    ),
    destroy=extend_schema(
        summary="Eliminar Tag",
        description="Elimina un Tag de la base de datos.",
        responses={204: None},
    ),
)
class TagsViewSet(ModelViewSet):
    serializer_class = TagSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Tag.objects.none()
        return Tag.objects.filter(user=self.request.user)

@extend_schema_view(
    list=extend_schema(
        summary="Listar Tasks",
        description="Retorna la lista completa de Tarea.",
        responses={200: TaskSerializer},
    ),
    create=extend_schema(
        summary="Crear Tag",
        description="Permite la creación de una nueva Tarea.",
        responses={201: TaskSerializer},
    ),
    retrieve=extend_schema(
        summary="Obtener el detalle de una Tarea",
        description="Retorna los detalles de una Tarea específica.",
        responses={200: TaskSerializer},
    ),
    update=extend_schema(
        summary="Actualizar Tarea",
        description="Actualiza los datos de un Tarea existente.",
        responses={200: TaskSerializer},
    ),
    destroy=extend_schema(
        summary="Eliminar Tarea",
        description="Elimina una Tarea de la base de datos.",
        responses={204: None},
    ),
)
class TasksViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = TaskFilter

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Task.objects.none()

        return Task.objects.filter(user=self.request.user).order_by('priority', '-created_at')

    @action(
        detail=True,
        methods=['post'],
        description="Marcar como completada la Tarea",
        url_name="complete-task",
        url_path="mark-complete"
    )
    def mark_complete(self, request, pk=None):
        """
        Marks a task as completed if it is not already completed. This function retrieves
        the task object by its primary key and updates its `completed` status to `True`.
        Once updated, the function returns a HTTP 200 OK response with a message.

        Args:
            request (HttpRequest): The HTTP request object.
            pk (Union[int, str], optional): The primary key of the task to be marked as completed.

        Returns:
            Response: An HTTP response with status code 200 OK and a message.
        """

        task = get_object_or_404(Task, pk=pk)

        if task.completed:
            task.completed = False
            task.save()

            serializer = self.serializer_class(task)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        with transaction.atomic():
            task.completed = True
            task.save()

            Task.objects.filter(parent_task=task.pk).update(completed=True)

        serializer = self.serializer_class(task)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


@extend_schema_view(
    list=extend_schema(
        summary="Listar Tasks",
        description="Retorna la lista completa de Tarea.",
        responses={200: TaskSerializer},
    )
)
class AllViewsViewsSet(GenericViewSet, ListModelMixin):
    queryset = Task.objects.all().order_by('priority', '-created_at')
    serializer_class = TaskSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = TaskFilter


