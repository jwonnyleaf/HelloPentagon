from django.urls import path

from . import views

urlpatterns = [
    path('', views.DashboardView.as_view(), name='dashboard'),
    path('challenges/', views.ChallengesView.as_view(), name='challenges'),
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
    path('features/', views.FeaturesView.as_view(), name='features'),
    path('results/', views.ResultsView.as_view(), name='results'),
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
    path('api/train/', views.api_train, name='api_train'),
]
