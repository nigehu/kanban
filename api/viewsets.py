from .models import User, Board, Post, Column
from .serializers import UserSerializer, BoardSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

class UserViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path=r'session/(?P<session_id>[A-Za-z0-9]+)')
    def session(self, request,*args, **kwargs):
        session_id = self.kwargs.get('session_id')
        user = User.objects.filter(session_id=session_id)
        if len(user) > 0:
            return Response(UserSerializer(user[0]).data)
        return Response({'User Not Found': 'Invalid Session Id'}, status=status.HTTP_404_NOT_FOUND)