import pickle
import cv2
import mediapipe as mp 
import numpy as np

# Load the pre-trained model and labels
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']
labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J',
    10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S',
    19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z',  26: 'ILoveYou' , 27: 'OK' ,
    
}

# Initialize video capture
cap = cv2.VideoCapture(0)

# Initialize MediaPipe hands module
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.2)

# Global variables to store last predicted character and concatenated text
last_predicted_character = ""
concatenated_text = ""

# Function to handle key press events
def on_key_press(key):
    global concatenated_text, last_predicted_character
    if key == ord(' '):
        concatenated_text += last_predicted_character + " "

while True:
    data_aux = []
    x_ = []
    y_ = []

    # Capture frame from video
    ret, frame = cap.read()

    H, W, _ = frame.shape

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame using MediaPipe hands module
    results = hands.process(frame_rgb)
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(
                frame,  # image to draw
                hand_landmarks,  # model output
                mp_hands.HAND_CONNECTIONS,  # hand connections
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style())

        for hand_landmarks in results.multi_hand_landmarks:
            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y

                x_.append(x)
                y_.append(y)

            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y
                data_aux.append(x - min(x_))
                data_aux.append(y - min(y_))

        x1 = int(min(x_) * W) - 10
        y1 = int(min(y_) * H) - 10

        x2 = int(max(x_) * W) - 10
        y2 = int(max(y_) * H) - 10

        # Predict the gesture
        prediction = model.predict([np.asarray(data_aux)])
        predicted_character = labels_dict[int(prediction[0])]
        last_predicted_character = predicted_character  # Store the last predicted character

        # Draw the concatenated text on the frame
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 4)
        cv2.putText(frame, concatenated_text, (x1, y1 - 40), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 0), 3, cv2.LINE_AA)

        # Draw the last predicted character in red
        cv2.putText(frame, last_predicted_character, (x1 + len(concatenated_text) * 20, y1 - 40), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 255), 3, cv2.LINE_AA)

    # Resize the frame for larger display
    frame_large = cv2.resize(frame, (1280, 720))

    # Show the frame
    cv2.imshow('frame', frame_large)

    # Wait for key press
    key = cv2.waitKey(1)
    if key == ord('q'):
        break
    on_key_press(key)

# Release the video capture and close all windows
cap.release()
cv2.destroyAllWindows()
