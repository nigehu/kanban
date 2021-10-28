from django.db import models

# Create your models here.

class User(models.Model):
    session_id = models.CharField(max_length=100, default="")
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100, default="")
    last_name = models.CharField(max_length=100, default="")
    created = models.DateTimeField(auto_now_add=True)

class Board(models.Model):
    name = models.CharField(max_length=100, default="Untitled Board", unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=0)

class Column(models.Model):
    name = models.CharField(max_length=100, default="", unique=True)
    position = models.IntegerField(null=False, default=1)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, default=0)

class Post(models.Model):
    title = models.CharField(max_length=100, default="", unique=True)
    position = models.IntegerField(null=False, default=1)
    description = models.CharField(max_length=1000, default="", unique=True)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=0)
    column = models.ForeignKey(Column, on_delete=models.CASCADE, default=0)