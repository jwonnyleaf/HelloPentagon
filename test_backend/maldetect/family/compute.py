import hashlib
import pickle

def hex_to_binary(hex_string):
    return bin(int(hex_string, 16))[2:].zfill(256)

def hamming_distance(hash1, hash2):
    binary1 = hex_to_binary(hash1)
    binary2 = hex_to_binary(hash2)
    return sum(b1 != b2 for b1, b2 in zip(binary1, binary2))

def calculate_sha256(file_path):
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def handler(filepath):
    sha256 = calculate_sha256(filepath)
    hashdb = pickle.load(open('maldetect/family/familyhashes.pkl', 'rb'))
    distances = {}
    for obj in hashdb.keys():
        distances.update({hamming_distance(sha256, hashdb[obj]): obj})
        
    min_key = min(distances.keys())
    min_key_values = [(k, v) for k, v in distances.items() if k == min_key]
    return min_key_values

def handlerHash(sha256):
    hashdb = pickle.load(open('maldetect/family/familyhashes.pkl', 'rb'))
    distances = {}
    for obj in hashdb.keys():
        distances.update({hamming_distance(sha256, hashdb[obj]): obj})
        
    min_key = min(distances.keys())
    min_key_values = [(k, v) for k, v in distances.items() if k == min_key]
    return min_key_values
