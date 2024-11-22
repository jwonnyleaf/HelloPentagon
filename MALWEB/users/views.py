from django.urls import reverse_lazy

from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic.edit import FormView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
# from dashboard.models import Player


class SiteLoginView(LoginView):
    template_name = 'users/login.html'
    redirect_authenticated_user = True
    next_page = '/'

class SiteLogoutView(LogoutView):
    next_page = reverse_lazy('login')

class SignupView(FormView):
    template_name = 'users/signup.html'
    form_class = UserCreationForm
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        user = form.save()
        # player = Player.objects.create(user=user, score=0)
        login(self.request, user)
        return super().form_valid(form)
