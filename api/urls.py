from django.urls import path
from .views import BoardView, CreateBoardView, UserView

urlpatterns = [
    path('board',BoardView.as_view()),
    path('create-board',CreateBoardView.as_view()),
    path('user',UserView.as_view()),

]