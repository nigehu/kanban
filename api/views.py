from django.shortcuts import render
from rest_framework import generics, serializers, status
from .models import Board, Post, User
from .serializers import BoardSerializer, CreateBoardSerializer, CreatePosterializer, CreateUserSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
class BoardView(generics.ListAPIView):
    lookup_url_kwarg = "board_id"
    # GET: api/board/5
    def get(self, request, format=None):
        uid = self.kwargs.get(self.lookup_url_kwarg)
        if uid == None:
            queryset = Board.objects.all()
            return Response(BoardSerializer(queryset).data, status=status.HTTP_200_OK)


class CreateBoardView(APIView):
    serializer_class = CreateBoardSerializer

    def post(self, request, format=None):
        
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.data.get('name')
            board = Board(name=name)
            board.save()
        
            return Response(BoardSerializer(board).data, status=status.HTTP_201_CREATED)


class UserView(APIView):
    # GET: api/user
    def get(self, request, format=None):
        session_id = request.GET.get('session_id',None)
        if session_id:
            user = User.objects.filter(session_id=session_id)
            if len(user) > 0:
                return Response(UserSerializer(user[0]).data, status=status.HTTP_200_OK)
            return Response({'User Not Found': 'Invalid Session Id'}, status=status.HTTP_404_NOT_FOUND)
        
        username = request.GET.get('username',None)
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
        return Response({'Bad Request': 'No parameters found in request'}, status=status.HTTP_400_BAD_REQUEST)

    # POST: api/user
    def post(self, request, format=None):

        try:
            User.objects.get(username=request.data['username'])
            return Response({'Bad Request': 'Username already exists in database'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            serializer = CreateUserSerializer(data=request.data)

            if serializer.is_valid():
                if not self.request.session.exists(self.request.session.session_key):
                    self.request.session.create()
                session_id = self.request.session.session_key
                username = serializer.data.get('username')
                first_name = serializer.data.get('first_name')
                last_name = serializer.data.get('last_name')
                user = User(username=username,first_name=first_name,last_name=last_name,session_id=session_id)
                user.save()
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid user object'}, status=status.HTTP_400_BAD_REQUEST)
    

class CreateUserView(APIView):
    serializer_class = CreateUserSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            session_id = self.request.session.session_key
            queryset = User.objects.filter(session_id)
            if queryset.exists():
                user = queryset[0]
                name = serializer.data.get('name')
                position = serializer.data.get('position')
                description = serializer.data.get('description')
                post = Post(name=name,position=position,description=description,user=user)
                post.save()
        







# Beginnings of api view for Posts
"""
class CreatePostView(APIView):
    serializer_class = CreatePosterializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user_id = self.request.session.session_key
            queryset = User.objects.filter(user_id)
            if queryset.exists():
                user = queryset[0]
                name = serializer.data.get('name')
                position = serializer.data.get('position')
                description = serializer.data.get('description')
                post = Post(name=name,position=position,description=description,user=user)
                post.save()

"""