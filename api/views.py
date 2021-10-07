from django.shortcuts import render
from rest_framework import generics, serializers, status
from .models import Board, Post
from .serializers import BoardSerializer, CreateBoardSerializer, CreatePosterializer
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
class BoardView(generics.ListAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer

class CreateBoardView(APIView):
    serializer_class = CreateBoardSerializer

    def post(self, request, format=None):
        
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.data.get('name')
            board = Board(name=name)
            board.save()
        
            return Response(BoardSerializer(board).data, status=status.HTTP_201_CREATED)

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