from rest_framework import serializers
from .models import Board, Post

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('id','name')

class CreateBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('id','name')

class CreatePosterializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('title','description','position')