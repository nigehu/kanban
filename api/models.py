from django.db import models

# Create your models here.
class Board(models.Model):
    name = models.CharField(max_length=100, default="Untitled Board", unique=True)
    user = models.CharField(max_length=50, default="", unique=True)

class Column(models.Model):
    name = models.CharField(max_length=100, default="", unique=True)
    position = models.IntegerField(null=False, default=1)

class Post(models.Model):
    title = models.CharField(max_length=100, default="", unique=True)
    position = models.IntegerField(null=False, default=1)
    description = models.CharField(max_length=1000, default="", unique=True)
    created = models.DateTimeField(auto_now_add=True)
    user = models.CharField(max_length=50, default="", unique=True)