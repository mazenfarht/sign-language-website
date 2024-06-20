import os
import pickle
import mediapipe as mp
import cv2
import matplotlib.pyplot as plt

# Initialize mediapipe modules for hand detection and drawing
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Initialize Hands object for static image mode with a minimum detection confidence of 0.3
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

# Directory path for the dataset
DATA_DIR = './data'

# Lists to store the extracted hand landmarks and corresponding labels
data = []
labels = []

# Iterate over directories and image files in the data directory
for dir_ in os.listdir(DATA_DIR):
    for img_path in os.listdir(os.path.join(DATA_DIR, dir_)):
        data_aux = []  # Temporary list to store the hand landmarks of an image

        x_ = []  # X-coordinates of hand landmarks
        y_ = []  # Y-coordinates of hand landmarks

        # Read the image and convert it to RGB
        img = cv2.imread(os.path.join(DATA_DIR, dir_, img_path))
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Process the image to detect hand landmarks
        results = hands.process(img_rgb)

        # If hand landmarks are detected
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Iterate over all the landmarks in a hand
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x  # X-coordinate of a landmark
                    y = hand_landmarks.landmark[i].y  # Y-coordinate of a landmark

                    x_.append(x)
                    y_.append(y)

                # Normalize the hand landmarks by subtracting the minimum values
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    data_aux.append(x - min(x_))
                    data_aux.append(y - min(y_))

            # Append the normalized hand landmarks to the data list
            data.append(data_aux)
            labels.append(dir_)  # Append the corresponding label to the labels list

# Save the data and labels in a pickle file
f = open('data.pickle', 'wb')
pickle.dump({'data': data, 'labels': labels}, f)
f.close()