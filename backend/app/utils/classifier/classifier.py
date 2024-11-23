import joblib
import pickle
import warnings

warnings.filterwarnings("ignore", category=UserWarning, module="xgboost")


class MalwareClassifier:
    def __init__(self):
        self.model = {}
        self.model["soft"] = pickle.load(open("app/models/xgboost_model.pkl", "rb"))
        self.model["hard"] = joblib.load(
            open("app/models/random_forest_model.joblib", "rb")
        )

    def classify(self, features):
        label, cnf = None, None
        soft_clf, hard_clf = self.model["soft"], self.model["hard"]

        prediction_soft = soft_clf.predict([features])
        prediction_hard = hard_clf.predict([features])

        if max(soft_clf.predict_proba([features])[0]) > 0.75:
            label = prediction_soft
            cnf = max(soft_clf.predict_proba([features])[0])
        else:
            label = prediction_hard
            cnf = max(hard_clf.predict_proba([features])[0])

        if label == 0 and cnf > 0.85:
            return ("goodware", cnf)
        elif label == 1:
            return ("malware", cnf)
        else:
            return ("needs human inspection", cnf)
