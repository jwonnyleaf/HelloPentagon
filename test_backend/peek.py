import ember
import pickle
ember_path = "/Users/soumyajyotidutta/Desktop/AV/test_backend/dataset"
X_train_18, y_train_18, X_test_18, y_test_18 = ember.read_vectorized_features(ember_path, feature_version=2)

pickle.dump(X_train_18, open('./dataset/X_train.pkl', 'wb'))
pickle.dump(y_train_18, open('./dataset/y_train.pkl', 'wb'))
pickle.dump(X_test_18, open('./dataset/X_test.pkl', 'wb'))
pickle.dump(y_test_18, open('./dataset/y_test.pkl', 'wb'))

