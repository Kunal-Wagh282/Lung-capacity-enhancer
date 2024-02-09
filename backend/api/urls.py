from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.Login.as_view()),
    path('register/', views.Register.as_view()),
    path('display/',views.display),
    path('add-profile/', views.AddProfile.as_view()),
    path('del-profile/', views.DelProfile.as_view()),
    path('bt-connect/', views.ConnectBT.as_view()),
    path('bt-disconnect/', views.DisconnectBT.as_view())
]
