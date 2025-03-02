from rest_framework.routers import DefaultRouter

from .views import TagsViewSet
from .views import AllViewsViewsSet
from .views import TasksViewSet

router = DefaultRouter()
router.register(r'tags', TagsViewSet, basename='tags')
router.register(r'tasks', TasksViewSet, basename='tasks')
router.register(r'all-tasks', AllViewsViewsSet, basename='tasks-tags')

urlpatterns = router.urls