from django_filters import FilterSet
from django_filters import rest_framework as filters

from .models import Task


class TaskFilter(FilterSet):
    tags = filters.CharFilter(field_name="tags", method="filter_tags")

    class Meta:
        model = Task
        fields = {
            "title": ["icontains", "iexact"],
            "description": ["icontains"],
            "completed": ["exact"],
            "priority": ["in", "exact"],
            "tags": ["exact"],
            "created_at": ["exact", "lt", "gt", "lte", "gte"],
            "finish_at": ["exact", "lt", "gt", "lte", "gte"],
            "parent_task": ["exact"]
        }

    def filter_tags(self, queryset, name, value):
        if value:
            tag_ids = [int(tag_id) for tag_id in value.split(',')]
            return queryset.filter(tags__in=tag_ids)
        return queryset