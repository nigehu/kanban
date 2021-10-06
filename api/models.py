from django.db import models

# Create your models here.
class Board(models.Model):
    name = models.CharField(max_length=100, default="", unique=True)

class Column(models.Model):
    name = models.CharField(max_length=100, default="", unique=True)
    position = models.IntegerField(null=False, default=1)

class Post(models.Model):
    name = models.CharField(max_length=100, default="", unique=True)
    position = models.IntegerField(null=False, default=1)
    created = models.DateTimeField(auto_now_add=True)