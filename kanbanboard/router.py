from api.viewsets import UserViewSet, BoardViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('user', UserViewSet, basename='user')
router.register('board', BoardViewSet, basename='board')