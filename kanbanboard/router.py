from api.viewsets import UserViewSet, BoardViewSet, ColumnViewSet, PostViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('user', UserViewSet, basename='user')
router.register('board', BoardViewSet, basename='board')
router.register('column', ColumnViewSet, basename='column')
router.register('post', PostViewSet, basename='post')