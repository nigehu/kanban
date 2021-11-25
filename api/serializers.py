from rest_framework import serializers
from .models import Board, Column, Post, User

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

class PostSerializer(serializers.ModelSerializer):
    assigned = UserSerializer(read_only=True)
    class Meta:
        model = Post
        fields = '__all__'

class PostActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class PostPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id','position','column')

class PostPositionUpdateSerializer(serializers.Serializer):
    posts = PostPositionSerializer(many=True)

class ColumnSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = '__all__'

class ColumnActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = ('id','name','position','board')

class BoardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    columns = ColumnSerializer(many=True)
    class Meta:
        model = Board
        fields = '__all__'
        #fields = ('id','name','user','columns')