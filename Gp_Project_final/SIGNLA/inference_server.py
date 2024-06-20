import asyncio
import websockets
import cv2
import numpy as np
import pickle
import mediapipe as mp

# Load model and setup MediaPipe
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Labels for predictions
labels_dict = {i: chr(65+i) for i in range(26)}  # A-Z
labels_dict.update({26+i: str(i) for i in range(10)})  # 0-9
labels_dict[36] = ' '

# Global variable to store concatenated text
concatenated_text = ""

async def recognize_gesture(websocket, path):
    global concatenated_text
    try:
        while True:
            # Receive frame data from the client
            frame_data = await websocket.recv()
            frame_array = np.frombuffer(frame_data, dtype=np.uint8)
            frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)

            # Process the frame
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(frame_rgb)

            # Draw landmarks and get data for prediction
            data_aux = []
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    mp.solutions.drawing_utils.draw_landmarks(
                        frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                    
                    for landmark in hand_landmarks.landmark:
                        data_aux.extend([landmark.x, landmark.y])

            # Make prediction if landmarks were detected
            if data_aux:
                prediction = model.predict([data_aux])
                predicted_character = labels_dict[int(prediction[0])]

                # Concatenate to the text if new character is different from last one
                if concatenated_text[-1:] != predicted_character:
                    concatenated_text += predicted_character

            # Encode the frame as JPEG
            _, frame_encoded = cv2.imencode('.jpg', frame)

            # Send the prediction and the frame back to the client
            await websocket.send(frame_encoded.tobytes())
            await websocket.send(predicted_character)

    except websockets.exceptions.ConnectionClosedError:
        print("Connection closed by the client.")
    finally:
        # Release resources
        hands.close()

# Set up and run the server
start_server = websockets.serve(recognize_gesture, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
