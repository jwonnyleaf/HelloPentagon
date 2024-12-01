import joblib
import pickle
import warnings

warnings.filterwarnings("ignore", category=UserWarning, module="xgboost")


class MalwareClassifier:
    GOODWARE = "Goodware"
    MALWARE = "Malware"
    NEEDS_ATTENTION = "Needs Attention"

    def __init__(self):
        self.model = {}
        self.model["soft"] = pickle.load(open("app/models/xgboost_model.pkl", "rb"))
        self.model["hard"] = joblib.load(
            open("app/models/random_forest_model.joblib", "rb")
        )

    def classify(self, features):
        soft_clf, hard_clf = self.model["soft"], self.model["hard"]

        prediction_soft = soft_clf.predict([features])
        prediction_hard = hard_clf.predict([features])

        if max(soft_clf.predict_proba([features])[0]) > 0.75:
            label = prediction_soft
            confidence = float(max(soft_clf.predict_proba([features])[0]))
        else:
            label = prediction_hard
            confidence = float(max(hard_clf.predict_proba([features])[0]))

        if label == 0 and confidence > 0.85:
            return (self.GOODWARE, confidence)
        elif label == 1:
            return (self.MALWARE, confidence)
        else:
            return (self.NEEDS_ATTENTION, confidence)
