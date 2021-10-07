from django.shortcuts import render
from rest_framework import generics
from .models import Board
from .serializers import BoardSerializer

# Create your views here.
class BoardView(generics.ListAPIView):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer