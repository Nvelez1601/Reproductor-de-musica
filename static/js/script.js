document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const songList = document.getElementById('song-list');
    const currentSongName = document.getElementById('current-song-name');
    const currentSongArtist = document.getElementById('current-song-artist');
    const currentSongImage = document.getElementById('current-song-image');
    
    let songs = [];
    let currentSongIndex = 0;
    
    // Cargar canciones desde el backend
    fetch('/songs')
        .then(response => response.json())
        .then(data => {
            songs = data;
            renderSongs();
        });
    
    // Mostrar canciones en la lista
    function renderSongs() {
        songList.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${song.image}" alt="${song.name}">
                <div>
                    <strong>${song.name}</strong>
                    <p>${song.artist}</p>
                </div>
            `;
            li.addEventListener('click', () => playSong(index));
            songList.appendChild(li);
        });
    }
    
    // Reproducir canción seleccionada
    function playSong(index) {
        currentSongIndex = index;
        const song = songs[index];
        
        currentSongName.textContent = song.name;
        currentSongArtist.textContent = song.artist;
        currentSongImage.src = song.image;
        
        audio.src = song.audio;
        audio.play();
        playBtn.textContent = 'Pausar';
    }
    
    // Controles del reproductor
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = 'Pausar';
        } else {
            audio.pause();
            playBtn.textContent = 'Reproducir';
        }
    });
    
    // Otras funciones (siguiente/anterior)...
});