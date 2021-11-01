from .models import User, Board, Post, Column
from .serializers import UserSerializer, BoardSerializer,ColumnSerializer,PostSerializer,PostActionSerializer,PostPositionSerializer,PostPositionUpdateSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny

class UserViewSet(viewsets.ViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]

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

class BoardViewSet(viewsets.ViewSet):
    """
    A viewset for viewing and editing board instances.
    """
    serializer_class = BoardSerializer
    queryset = Board.objects.all()

    def list(self, request):
        queryset = Board.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Board.objects.all()
        board = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(board)
        return Response(serializer.data)

class ColumnViewSet(viewsets.ViewSet):
    """
    A viewset for viewing and editing column instances.
    """
    serializer_class = ColumnSerializer
    queryset = Column.objects.all()

    def list(self, request):
        queryset = Column.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Column.objects.all()
        column = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(column)
        return Response(serializer.data)

class PostViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing post instances.
    """
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [AllowAny]

    def list(self, request):
        queryset = Post.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Post.objects.all()
        post = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(post)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        post = self.get_object()
        serializer = PostActionSerializer(self, data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data
            post.title = data['title']
            post.position = data['position']
            post.description = data['description']
            post.due_date = data['due_date']
            post.assigned = data['assigned']
            post.column = data['column']
            post.save()

            serializer = self.serializer_class(post)
            return Response(serializer.data)    
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        post = self.get_object()
        serializer = self.serializer_class(post, data=request.data, partial=True)

        if serializer.is_valid():
            data = serializer.validated_data
            post.title = data['title']
            post.position = data['position']

            post.save()

            serializer = self.serializer_class(post)
            return Response(serializer.data)    
        return Response(serializer.data)

    @action(detail=False, methods=['patch'], url_path='positions', serializer_class=PostPositionUpdateSerializer)
    def update_positions(self, request):
        for data in request.data['posts']:
            self.queryset.filter(id=data['id']).update(position=data['position'], column=data['column'])
        return Response(status=status.HTTP_204_NO_CONTENT)
