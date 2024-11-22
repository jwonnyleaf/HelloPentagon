import os
import gzip
from time import time
from collections import defaultdict

import matplotlib
import matplotlib.pyplot as plt
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

import _pickle as cPickle

matplotlib.use('Agg')

def load_dataset(name):
    content = None
    with gzip.open(name, 'rb') as fp:
        content = cPickle.load(fp)
    return content

def feature_selection_game_with_importance(selected_indices):
    num_features = 33
     # Load datasets
    br_mw_17 = load_dataset("./ml_model/datasets/br.17.cpkl")          # Training data part 1
    cnet = load_dataset("./ml_model/datasets/cnet.cpkl")               # Training data part 2
    us_data = load_dataset("./ml_model/datasets/us.cpkl")              # Testing data part 1
    br_12_data = load_dataset("./ml_model/datasets/br.12.cpkl")        # Testing data part 2
    
    df_train = pd.DataFrame(br_mw_17 + cnet)
    df_test = pd.DataFrame(us_data + br_12_data)
    
    features = list(df_train.columns)
    features.remove('label')

    # Ensure that the number of selected features is not greater than the maximum allowed
    if len(selected_indices) > len(features):
        print(f"Too many features selected! Please select at most {num_features} features.")
        return None

    # Select the features chosen by the user
    selected_features = [features[i - 1] for i in selected_indices]
    # Prepare data
    X_train = df_train[selected_features]
    y_train = df_train['label']
    X_test = df_test[selected_features]
    y_test = df_test['label']
    
    X_train = pd.get_dummies(X_train)
    X_test = pd.get_dummies(X_test)
    X_test = X_test.reindex(columns=X_train.columns, fill_value=0)
    trained_features = list(X_train.columns)
    
    # Initialize and train model
    clf = RandomForestClassifier(n_estimators=100, random_state=0)
    clf.fit(X_train, y_train)
    
    # Predictions
    y_pred = clf.predict(X_test)
    
    # Evaluation
    accuracy = accuracy_score(y_test, y_pred)
    # report = classification_report(y_test, y_pred, digits=4)
    
    # Feature Importances
    importances = clf.feature_importances_
    
    # Aggregate feature importances back to original features
    aggregated_importances = defaultdict(float)
    for feature, importance in zip(trained_features, importances):
        # Get the base feature name before one-hot encoding (e.g., 'machine' from 'machine_MACHINE_TYPES.AMD64')
        name_parts = feature.split('_')
        base_feature = '_'.join(name_parts)
        while len(name_parts) > 0 and base_feature not in selected_features:
            name_parts.pop()
            base_feature = '_'.join(name_parts)
        aggregated_importances[base_feature] += importance

    # Sort aggregated importances
    sorted_features = sorted(aggregated_importances, key=aggregated_importances.get, reverse=True)
    sorted_importances = [aggregated_importances[feature] for feature in sorted_features]

    # Plot Feature Importances
    plt.figure(figsize=(12, 8))
    plt.title("Feature Importances")
    plt.bar(range(len(sorted_importances)), sorted_importances, align='center')
    plt.xticks(range(len(sorted_importances)), sorted_features, rotation=45)
    plt.xlabel('Features')
    plt.ylabel('Importance Score')
    plt.tight_layout()
    
    # Save the plot
    try:
        output_dir = "media/temp"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        random_filename = f"media/temp/{hash(time())}.png"
        plt.savefig(random_filename)
    except Exception as ex:
        print(f"caught exception while saving plot. exception caught:\n{ex}")
        raise ex
    finally:
        plt.close()

    return accuracy*100, selected_features, random_filename, len(selected_features)


if __name__ == '__main__':
    # Collect user input outside the function
    print("\nSelect features by entering their numbers separated by commas (e.g., 1,3,5,7,9):")
    user_input = input("Your selection: ")
    selected_indices = [int(i.strip()) for i in user_input.split(',')]
    feature_selection_game_with_importance(selected_indices)