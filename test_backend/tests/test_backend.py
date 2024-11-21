import sys
import os
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from maldetect.extractor import FeatureExtractor
from maldetect.family import MalwareFamily

from maldetect.classification import ClassifyMalware

ext = FeatureExtractor()
clf = ClassifyMalware()
fam = MalwareFamily()

myfeatures = ext.extract('/Users/soumyajyotidutta/Desktop/AV/test_backend/tests/Zloader.xlsm')
print(clf.classify(myfeatures['bodmas_features']))
print(fam.getfamily('/Users/soumyajyotidutta/Desktop/AV/test_backend/tests/Zloader.xlsm'))