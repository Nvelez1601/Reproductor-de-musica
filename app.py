from flask import Flask, render_template, jsonify
import requests



app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/songs')
def get_songs():
    # Obtiene canciones populares de Jamendo
    client_id="262b1442"    # Reemplaza con tu ID
    url = f"https://api.jamendo.com/v3.0/tracks/?client_id={client_id}&format=json&limit=50"
    response = requests.get(url)
    data = response.json()
    
    songs = []
    for track in data['results']:
        songs.append({
            'id': track['id'],
            'name': track['name'],
            'artist': track['artist_name'],
            'audio': track['audio'],  # URL del MP3 completo
            'image': track['image']   # URL de la imagen del álbum
        })
    
    return jsonify(songs)

if __name__ == '__main__':
    app.run(debug=True)