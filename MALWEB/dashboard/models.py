import os
import json

from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage

feature_importance_storage = FileSystemStorage(
    location='media/feature_importance_graphs',
    base_url='/media/feature_importance_graphs/'
    )

class UserSubmission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge_id = models.IntegerField(default=1)

    # selected_features is a json string: {ids: [], names: []}
    selected_features = models.TextField(default='')
    # model accuracy from 0 to 100       
    accuracy = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    num_features = models.IntegerField(default=0)
    feature_importance_graph = models.FileField(storage=feature_importance_storage, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Challenge {self.challenge_id}"
    
    def save(self, *args, **kwargs):

        if self.feature_importance_graph:
            timestamp = self.created_at.strftime('%Y%m%d%H%M%S')
            extension = os.path.splitext(self.feature_importance_graph.name)[1]
            new_filename = f"{self.user.id}_{self.challenge_id}_{timestamp}{extension}"
            self.feature_importance_graph.name = new_filename

        super(UserSubmission, self).save(*args, **kwargs)
    
    @property
    def features(self):
        if self.selected_features:
            return ", ".join(json.loads(self.selected_features).get('names', []))
        return ""
    
    @property
    def challenge(self):
        return f"Challenge {self.challenge_id}"
