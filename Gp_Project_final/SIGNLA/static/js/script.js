function fetchVideos(letter) {
    fetch(`/videos/${letter}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('video-container');
            container.innerHTML = '';
            data.forEach(video => {
                const videoElem = document.createElement('div');
                videoElem.className = 'video-item';
                videoElem.innerHTML = `<h3>${video.title}</h3><iframe src="${video.url}" frameborder="10" allowfullscreen></iframe>`;
                container.appendChild(videoElem);
            });
        })
        .catch(error => console.error('Error fetching videos:', error));
}
