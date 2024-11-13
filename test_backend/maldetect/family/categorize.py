import pandas as pd
import pickle

def gethashes(data, target_category):
    hashes = data[data['category'] == target_category]['sha256'].tolist()
    return  hashes

def getfamilydict(data):
    unique_categories = data['category'].unique()
    familydb = {}
    for cat in unique_categories:
        hashes = gethashes(data, target_category=cat)
        familydb.update({cat: hashes})   
    return familydb

def getxorHashes(data):
    unique_categories = data['category'].unique()
    representiveHash_db = {}
    for cat in unique_categories:
        hashes = gethashes(data, target_category=cat)
        combined_hash = 0
        for h in hashes:
            combined_hash ^= int(h, 16)
        representative_hash = format(combined_hash, '064x')
        representiveHash_db.update({cat:representative_hash})
    return representiveHash_db



def main():
    
    metadata = pd.read_csv('dataset/bodmas_malware_category.csv')
    with open('./familyhashes.pkl', 'wb') as f:
        pickle.dump(getxorHashes(metadata), f)
        
if __name__ == '__main__':
    main()


