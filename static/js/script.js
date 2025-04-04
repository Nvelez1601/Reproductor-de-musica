document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const songList = document.getElementById('song-list');
    const currentSongName = document.getElementById('current-song-name');
    const currentSongArtist = document.getElementById('current-song-artist');
    const currentSongImage = document.getElementById('current-song-image');
    
    // Variables de estado
    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;

    // Cargar canciones desde Jamendo
    fetch('/songs')
        .then(response => response.json())
        .then(data => {
            songs = data;
            renderSongList();
            if (songs.length > 0) {
                loadSong(currentSongIndex);
            }
        })
        .catch(error => console.error('Error al cargar canciones:', error));

    // Renderizar lista de canciones
    function renderSongList() {
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

    // Cargar y reproducir canción
    function playSong(index) {
        if (index < 0 || index >= songs.length) return;
        
        currentSongIndex = index;
        const song = songs[index];
        
        // Actualizar UI
        currentSongName.textContent = song.name;
        currentSongArtist.textContent = song.artist;
        currentSongImage.src = song.image;
        
        // Resaltar canción actual en la lista
        const allSongs = songList.querySelectorAll('li');
        allSongs.forEach((item, i) => {
            item.style.fontWeight = i === index ? 'bold' : 'normal';
        });

        // Cargar y reproducir
        audioPlayer.src = song.audio;
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                playBtn.textContent = 'Pausar';
            })
            .catch(error => console.error('Error al reproducir:', error));
    }

    // Siguiente canción (con comportamiento circular)
    function nextSong() {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        playSong(nextIndex);
    }

    // Canción anterior (con comportamiento circular)
    function prevSong() {
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(prevIndex);
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play()
                .then(() => {
                    isPlaying = true;
                    playBtn.textContent = 'Pausar';
                });
        } else {
            audioPlayer.pause();
            isPlaying = false;
            playBtn.textContent = 'Reproducir';
        }
    });

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    // Reproducción automática al terminar una canción
    audioPlayer.addEventListener('ended', nextSong);

    // Actualizar tiempo de reproducción (opcional)
    audioPlayer.addEventListener('timeupdate', function() {
        // Puedes implementar aquí una barra de progreso si lo deseas
    });
});