import sys
import os
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from maldetect.family import MalwareFamily
from maldetect.dataset import DataLoader
fam = MalwareFamily()
loader = DataLoader()
metadata = loader.load_metadata()


print(fam.getfamily('maldetect/sample/mal.exe'))
print(fam.getfamily_fromHash(metadata.iloc[134432][0]))