import ember
import numpy as np

class BODMASFeatureExtractor:
    def __init__(self, file_data):
        self.file_data = file_data
        self.ember_extractor = ember.PEFeatureExtractor(
            print_feature_warning=False, feature_version=2
        )

    def extract_features(self):
        """
        Extracts exactly 2381 features for the BODMAS dataset using Ember and static analysis.
        """
        # Extract raw Ember features
        raw_features = self.ember_extractor.raw_features(self.file_data)

        # Fix potential issues in section entries
        raw_features["section"]["entry"] = [raw_features["section"]["entry"]]

        # Process raw features into the BODMAS-compatible 2381 feature vector
        feature_vector = self.ember_extractor.process_raw_features(raw_features)
        return np.array(feature_vector, dtype=np.float32)
