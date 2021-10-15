from rest_framework import serializers
from .models import Board, Post, User

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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','session_id','username','first_name','last_name','created')

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','first_name','last_name')