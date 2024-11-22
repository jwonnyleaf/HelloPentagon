from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.SiteLoginView.as_view(), name='login'),
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('logout/', views.SiteLogoutView.as_view(), name='logout'),
]