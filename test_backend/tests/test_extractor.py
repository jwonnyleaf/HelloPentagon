import sys
import os
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from maldetect.extractor import FeatureExtractor

ext = FeatureExtractor()
myfeatures = ext.extract('./file.exe')

print(myfeatures)