from rest_framework import serializers
from .models import Board, Post, User

class CreateBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('id','name','user')

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

class BoardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Board
        fields = ('id','name','user')