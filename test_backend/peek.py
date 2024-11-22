import sys
import os
import numpy as np
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from maldetect.classification import ClassifyMalware
from maldetect.dataset import DataLoader
clf = ClassifyMalware()
loader = DataLoader()

data = loader.load_testdata()
samplefeature1 = data.iloc[200]

print(samplefeature1.shape)