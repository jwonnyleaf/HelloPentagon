import pickle
import joblib
import warnings

class ClassifyMalware():
    
    def classify(self, features):
        
        warnings.filterwarnings("ignore")
        soft_clf = pickle.load(open('maldetect/classification/xgboost_model.pkl', 'rb'))
        hard_clf = joblib.load(open('maldetect/classification/randomForest_model.joblib', 'rb'))
        
        prediction_soft = soft_clf.predict([features])
        prediction_hard = hard_clf.predict([features])         
        
        label = None
        cnf = None
        if max(soft_clf.predict_proba([features])[0]) > 0.75:
            label =  prediction_soft
            cnf = max(soft_clf.predict_proba([features])[0])
        else:
            label = prediction_hard
            cnf = max(hard_clf.predict_proba([features])[0])
            
        if label == 0 and cnf > 0.85:
            return ('goodware', cnf)
        elif label == 1:
            return ('malware', cnf)
        else:
            return (f'Needs Attention! Initial Thoughts: Malware', cnf)
        
        
        
        