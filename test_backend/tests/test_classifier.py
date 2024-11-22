import sys
import os
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from maldetect.classification import ClassifyMalware
from maldetect.dataset import DataLoader
clf = ClassifyMalware()
loader = DataLoader()

data = loader.load_testdata()
samplefeature1 = data.iloc[200]
samplefeature2 = data.iloc[50]

print(clf.classify(samplefeature1))
print(clf.classify(samplefeature2))