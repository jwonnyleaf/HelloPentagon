import re
import lief
import math
import numpy as np
import ember
import pickle

class BODMASFeatureExtractor:
    def __init__(self, file_data):
        self.file_data = file_data
        self.ember_extractor = ember.PEFeatureExtractor(print_feature_warning=False, feature_version=2)

    def extract_bodmas_features(self):
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

class PEAttributeExtractor:
    def __init__(self, bytez):
        self.bytez = bytez
        self.lief_binary = lief.PE.parse(list(bytez))
        self.attributes = {}

    def extract_entropy(self):
        """
        Calculate Shannon entropy for the file data.
        """
        if not self.bytez:
            return 0
        entropy = 0
        for x in range(256):
            p_x = float(self.bytez.count(bytes([x]))) / len(self.bytez)
            if p_x > 0:
                entropy += -p_x * math.log(p_x, 2)
        return entropy

    def extract(self):
        """
        Extract additional PE attributes for further analysis.
        """
        try:
            # General attributes
            self.attributes.update({
                "entropy": self.extract_entropy(),
                "virtual_size": self.lief_binary.virtual_size,
                "number_of_sections": self.lief_binary.header.numberof_sections,
                "has_signature": int(self.lief_binary.has_signature),
                "imports": len(self.lief_binary.imports),
                "exports": len(self.lief_binary.exported_functions),
                "symbols": len(self.lief_binary.symbols),
            })
        except Exception as e:
            print(f"Error extracting attributes: {e}")
        return self.attributes


def extract_bodmas_features_from_file(file_path):

    try:
        # Read the binary data of the file
        with open(file_path, "rb") as f:
            file_data = f.read()

        # Extract BODMAS features
        bodmas_extractor = BODMASFeatureExtractor(file_data)
        bodmas_features = bodmas_extractor.extract_bodmas_features()

        # Extract additional PE attributes
        pe_extractor = PEAttributeExtractor(file_data)
        pe_attributes = pe_extractor.extract()

        return {
            "bodmas_features": bodmas_features.tolist(),
            "pe_attributes": pe_attributes
        }
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        return None

