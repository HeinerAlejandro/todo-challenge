from django.db import models
from django.core.validators import MinValueValidator
from django.core.validators import MaxValueValidator

from django.conf import settings

# Create your models here.


class Tag(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)


class Task(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    priority_choices = (
        (1, "Alta"),
        (2, "Mediana"),
        (3, "Baja")
    )

    tags = models.ManyToManyField(Tag, max_length=100)

    title = models.CharField(
        max_length=100,
        verbose_name="Titulo",
        help_text="Titulo de la Tarea"
    )

    description = models.TextField(blank=True, help_text="Descripcion de la Tarea")

    priority = models.IntegerField(
        default=3,
        choices=priority_choices,
        verbose_name="Prioridad",
        help_text="Prioridad de la Tarea",
        validators=[
            MinValueValidator(1, message="Valor debe ser mayor o igual a 1"),
            MaxValueValidator(3,  message="Valor debe ser menor o igual a 3")
        ]
    )

    completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Creado en",
        help_text="Fecha de Creacion de la Tarea"
    )

    finish_at = models.DateTimeField(
        verbose_name="Creado en",
        help_text="Fecha de Creacion de la Tarea"
    )

    parent_task = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="Tarea padre o principal"
    )
