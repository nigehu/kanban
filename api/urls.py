from django.urls import path
from .views import BoardView, CreateBoardView

urlpatterns = [
    path('board',BoardView.as_view()),
    path('create-board',CreateBoardView.as_view())

]