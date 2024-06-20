from flask import Flask, render_template, Response, jsonify, request
import cv2
import pickle
import numpy as np
import mediapipe as mp
import keyboard
import os

app = Flask(__name__)

# Load the model
model_path = './model.p'  # Path to the uploaded model.p file
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")

model_dict = pickle.load(open(model_path, 'rb'))
model = model_dict['model']

labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J',
    10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S',
    19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z', 26: 'ILoveYou', 27: 'OK',
}

cap = cv2.VideoCapture(0)
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.2)

def generate_frames():
    word = ""
    while True:
        data_aux = []
        x_ = []
        y_ = []
        ret, frame = cap.read()
        if not ret:
            break
        H, W, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style()
                )
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
            prediction = model.predict([np.asarray(data_aux)])
            predicted_character = labels_dict[int(prediction[0])]
            cv2.putText(frame, f'Prediction: {word + predicted_character}', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
        key = cv2.waitKey(1)
        if key == 27:
            break
        if keyboard.is_pressed('space'):
            word += " "
        if keyboard.is_pressed('w'):
            word += predicted_character
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/Home')
def Home():
    return render_template('index.html')

@app.route('/video_call')
def video_call():
    return render_template('video_call.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/categories')
def categories():
    return render_template('categories.html')

@app.route('/videos/<letter>')
def get_videos(letter):
    return jsonify(videos.get(letter.upper(), []))

videos = {
    'A': [
        {'url': 'https://videos.sproutvideo.com/embed/4498d3bc1215e0cecd/9a452ee5a9920103', 'title': 'A Little bit'},
        # Add other video URLs here
    ],
    'B': [
        {'url': 'https://videos.sproutvideo.com/embed/ea98d3bf191ee0c363/2de8b6008078aeff', 'title': 'Baby'},
        # Add other video URLs here
    ],
    # Add more letters here following the same format
}

videos2 = [
    {'letter': 'A', 'link': 'https://media.spreadthesign.com/video/mp4/13/alphabet-letter-591-1.mp4'},
    # Add other video links here
]

@app.route("/FingerSpelling", methods=['GET', 'POST'])
def finger():
    selected_video = None
    if request.method == 'POST':
        selected_letter = request.form.get('selected_letter')
        selected_video = next((video for video in videos2 if video['letter'] == selected_letter), None)
    return render_template('FingerSpelling.html', videos2=videos2, selected_video=selected_video)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
