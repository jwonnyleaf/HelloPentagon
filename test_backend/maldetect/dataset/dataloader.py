import pickle
import pandas as pd

class DataLoader():
    
    def load_testdata(self):
        X = pickle.load(open('maldetect/dataset/testdata.pkl', 'rb'))
        return X
    
    def load_data(self):
        X = pickle.load(open('maldetect/dataset/data.pkl', 'rb'))
        return X
    
    def load_metadata(self):
        X = pd.read_csv('maldetect/dataset/bodmas_metadata.csv')
        return X