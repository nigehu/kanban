from .models import User, Board, Post, Column
from .serializers import UserSerializer, BoardSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

class UserViewSet(viewsets.ViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def list(self, request):
        username = request.GET.get('username', None)
        if username:
            try:
                user = User.objects.get(username=username)
                if not user.session_id:
                    if not self.request.session.exists(self.request.session.session_key):
                        self.request.session.create()

                    session_id = self.request.session.session_key
                    user.session_id=session_id
                    user.save()
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
            except Exception as e:
                s = str(e)
                print(s)
                return Response({'User Not Found': 'Invalid Username'}, status=status.HTTP_404_NOT_FOUND)
        else:
            queryset = User.objects.all()
            serializer = UserSerializer(queryset, many=True)
            return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data
            if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()

            session_id = self.request.session.session_key
            user['session_id']=session_id
            User.objects.create(**user)

            return Response(
            serializer.validated_data, status=status.HTTP_201_CREATED
            )

        return Response({
            'status': 'Bad request',
            'message': 'User could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path=r'session/(?P<session_id>[A-Za-z0-9]+)')
    def session(self, request,*args, **kwargs):
        session_id = self.kwargs.get('session_id')
        user = User.objects.filter(session_id=session_id)
        if len(user) > 0:
            return Response(UserSerializer(user[0]).data)
        return Response({'User Not Found': 'Invalid Session Id'}, status=status.HTTP_404_NOT_FOUND)