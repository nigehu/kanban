from django.shortcuts import render
from django.http import HttpResponse
from .models import ToDoList, Item

# Create your views here.
def say_hello(request):
    x=1
    y=2
    return render(request, 'hello.html')

def index(request, id):
    ls = ToDoList.objects.get(id=id)
    return HttpResponse("<h1>Id: %s" % ls.name)