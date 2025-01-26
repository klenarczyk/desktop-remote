from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import pyautogui
import subprocess
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

pyautogui.FAILSAFE = False # ENABLE WHEN DONE TESTING

# Enable CORS for all routes (adjust if necessary for security)
CORS(app, resources={r"/*": {"origins": "*"}})

netflix_url = "https://www.netflix.com/"
disney_plus_url = "https://www.disneyplus.com/"
prime_url = "https://www.primevideo.com/"
youtube_url = "https://www.youtube.com/"

# Volume Control
@app.route('/volume', methods=['POST'])
def volume():
    action = request.json.get('action')  # 'up' or 'down'
    if action == 'up':
        pyautogui.press('volumeup')
    elif action == 'down':
        pyautogui.press('volumedown')
    elif action == 'mute':
        pyautogui.press('volumemute')
    return jsonify({"status": "success"})

@socketio.on('volume')
def volume_hold(data):
    action = data.get('action')
    if action == 'up':
        pyautogui.press('volumeup')
    elif action == 'down':
        pyautogui.press('volumedown')

# Scroll Control
@app.route('/navigation', methods=['POST'])
def navigation():
    action = request.json.get('action')  # 'up' or 'down'
    if action == 'up':
        pyautogui.press('up')
    elif action == 'down':
        pyautogui.press('down')
    return jsonify({"status": "success"})

@socketio.on('navigation')
def navigation_hold(data):
    action = data.get('action')
    if action == 'up':
        pyautogui.press('up')
    elif action == 'down':
        pyautogui.press('down')


# Launch App
@app.route('/open_app', methods=['POST'])
def open_app():
    app_name = request.json.get('app')  # e.g., 'notepad', 'chrome'
    if app_name == 'disney':
        subprocess.Popen(['start', disney_plus_url], shell=True)
    return jsonify({"status": "success"})

# Fullscreen Toggle
@app.route('/fullscreen', methods=['POST'])
def fullscreen():
    action = request.json.get('action')
    if action == "on":
        pyautogui.press('f')
    else:
        pyautogui.press('esc')
    return jsonify({"status": "success"})

# Browser return
@app.route('/return', methods=['POST'])
def back():
    pyautogui.press('browserback')
    return jsonify({"status": "success"})

# Skip forwards or backwards
@app.route('/skip', methods=['POST'])
def skip():
    action = request.json.get('action')
    if action == 'forwards':
        pyautogui.press('right')
    elif action == 'backwards':
        pyautogui.press('left')
    return jsonify({"status": "success"})

# Pause Video
@app.route('/pause', methods=['POST'])
def pause():
    pyautogui.press('space')
    return jsonify({"status": "success"})

# Left Click
@app.route('/left_click', methods=['POST'])
def lect_click():
    pyautogui.click()
    return jsonify({"status": "success"})

# WebSocket Route for Mouse Control
@socketio.on('move_mouse')
def move_mouse(data):
    try:
        # Extract deltaX and deltaY from the received data
        deltaX = data.get('deltaX', 0)
        deltaY = data.get('deltaY', 0)
        
        # Get current mouse position
        x, y = pyautogui.position()
        
        # Move mouse by the delta
        pyautogui.moveTo(x + deltaX, y + deltaY)
        
        # Send a confirmation message back to the frontend
        emit('mouse_moved', {'status': 'success', 'deltaX': deltaX, 'deltaY': deltaY})
    except Exception as e:
        print(f"Error: {e}")
        emit('mouse_moved', {'status': 'error', 'message': str(e)})

# Websocket Route for typing
@socketio.on('input')
def input(data):
    try:
        # Extract the text from the received data
        text = data.get('text', '')

        if text.startswith('{') and text.endswith('}'):
            key = text[1:-1]  # Remove the braces
            pyautogui.press(key)  # Press the special key
        else:
            pyautogui.write(text)  # Type regular text

        # Send a confirmation message back to the frontend
        emit('text_typed', {'status': 'success', 'text': text})
    except Exception as e:
        print(f"Error: {e}")
        emit('text_typed', {'status': 'error', 'message': str(e)})

#Shortcuts
@app.route('/shortcut', methods=['POST'])
def shortcut():
    app_name = request.json.get('app')  # e.g., 'notepad', 'chrome'
    if app_name == 'netflix':
        subprocess.Popen(['start', netflix_url], shell=True)
    if app_name == 'disney':
        subprocess.Popen(['start', disney_plus_url], shell=True)
    if app_name == 'youtube':
        subprocess.Popen(['start', youtube_url], shell=True)
    if app_name == 'prime':
        subprocess.Popen(['start', prime_url], shell=True)
    return jsonify({"status": "success"})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
