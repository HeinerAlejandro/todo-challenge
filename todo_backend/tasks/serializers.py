from datetime import timezone

from django.utils import timezone

from rest_framework import serializers
from rest_framework.serializers import ValidationError

from .models import Tag
from .models import Task

class TagSerializer(serializers.ModelSerializer):

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Tag
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    tags_details = TagSerializer(many=True, read_only=True, source="tags")

    class Meta:
        model = Task
        fields = '__all__'

    def validate(self, data):

        finish_at = data.get("finish_at")

        created_at = self.instance.created_at if self.instance else timezone.now()

        if finish_at and finish_at < created_at:
            raise serializers.ValidationError({"finish_at": "La fecha de finalización no puede ser menor a la de creación."})

        return data


