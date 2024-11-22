from .extractor import extract_bodmas_features_from_file

class FeatureExtractor():
    
    def extract(self, filepath):
        features = extract_bodmas_features_from_file(filepath)
        return features 