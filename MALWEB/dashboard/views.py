import json
import os
import traceback

from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.core.files import File
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from django.urls import reverse_lazy

from dashboard.models import UserSubmission

from ml_model import train_model


class DashboardView(LoginRequiredMixin, RedirectView):
    url = reverse_lazy('challenges')
    
    login_url = '/users/login/'
    redirect_field_name = 'next'

class ChallengesView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/challenges.html'
    
    login_url = '/users/login/'
    redirect_field_name = 'next'

class FeaturesView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/features.html'
    
    login_url = '/users/login/'
    redirect_field_name = 'next'

class ResultsView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/results.html'
    
    login_url = '/users/login/'
    redirect_field_name = 'next'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        results = UserSubmission.objects.filter(user=self.request.user).order_by('-created_at')
        context['results'] = results
        return context

class LeaderboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/leaderboard.html'

    login_url = '/users/login'
    redirect_field_name = 'next'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        submissions = UserSubmission.objects.order_by('-accuracy', 'num_features')
        context['submissions'] = submissions
        return context

def api_train(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        features = data.get('features', [])
        challenge_id = data.get('challenge_id', '0')
        
        try:
            challenge_id = int(challenge_id)
        except ValueError:
            return JsonResponse({'status': 'error', 'message': 'Non-integer challenge ID'}, status=400)
        
        if len(features) == 0:
            return JsonResponse({'status': 'error', 'message': 'No features provided'}, status=400)
        
        if challenge_id not in (1, 2, 3, ):
            return JsonResponse({'status': 'error', 'message': 'Invalid challenge ID'}, status=400)

        try:
            acc, feature_names, temp_file, num_feats = train_model(features)
            print(f"Accuracy: {acc}, Features: {feature_names}, Num Features: {num_feats}")
        except Exception as e:
            print(f"Caught exception: {e}")
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
        
        submission = UserSubmission.objects.create(
            user=request.user,
            selected_features=json.dumps({"ids": features, "names": feature_names}),
            accuracy=acc,
            num_features=num_feats,
            challenge_id=challenge_id
        )
        
        if temp_file and os.path.exists(temp_file):
            timestamp = submission.created_at.strftime('%Y%m%d%H%M%S')
            filename = f"{request.user.id}_{submission.challenge_id}_{timestamp}.png"
            with open(temp_file, 'rb') as file:
                django_file = File(file)
                submission.feature_importance_graph.save(filename, django_file)
            os.remove(temp_file)
        submission.save()
        
        return JsonResponse({
            'status': 'ok',
            'accuracy': acc,
            'features': feature_names,
            'graph_url': submission.feature_importance_graph.url if submission.feature_importance_graph else None
        })

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

