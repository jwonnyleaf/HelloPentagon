import sys
import os
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from maldetect.classification import ClassifyMalware
from maldetect.dataset import DataLoader
from maldetect.family import MalwareFamily


def generate(classificationReport, familyReport):
    prompt = ""
    if classificationReport[0] == 'malware':
        prompt += f"I have a {familyReport[0][1]} malware in my system classified by a two staged ML pipeline antivirus with a confidence of {classificationReport[1]}. What is the best course of action I can take right now?"
    return prompt

def main():
    clf = ClassifyMalware()
    fam = MalwareFamily()
    loader = DataLoader()

    data = loader.load_data()
    metadata = loader.load_metadata()
    sample = data.iloc[134432]
    sample_sha256 = metadata.iloc[134432][0]

    classificationReport = clf.classify(sample)
    familyReport = fam.getfamily_fromHash(sample_sha256)
    print(generate(classificationReport, familyReport))
if __name__ == '__main__':
    main()
