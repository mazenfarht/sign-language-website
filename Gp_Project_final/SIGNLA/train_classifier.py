import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np
import os

# Load the preprocessed data and labels from the data.pickle file
data_path = './data.pickle'  # Change this to the actual path of your data.pickle file
if not os.path.exists(data_path):
    raise FileNotFoundError(f"Data file not found at {data_path}")

with open(data_path, 'rb') as f:
    data_dict = pickle.load(f)

data = np.asarray(data_dict['data'])
labels = np.asarray(data_dict['labels'])

# Split the data into training and testing sets
x_train, x_test, y_train, y_test = train_test_split(data, labels, test_size=0.2, shuffle=True, stratify=labels)

# Initialize a RandomForestClassifier model
model = RandomForestClassifier()

# Fit the model to the training data
model.fit(x_train, y_train)

# Predict labels for the testing data
y_predict = model.predict(x_test)

# Calculate the accuracy score
score = accuracy_score(y_predict, y_test)

# Print the accuracy score
print('{}% of samples were classified correctly!'.format(score * 100))

# Save the trained model in a pickle file
model_path = 'model.p'
with open(model_path, 'wb') as f:
    pickle.dump({'model': model}, f)
