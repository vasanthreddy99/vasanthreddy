
function searchVideos() {
    const subject = document.getElementById('subjectInput').value;
    const apiKey = 'AIzaSyAKpdmZ3t28NevkJ93IvFz-SbxIaLlv0Xk'; 

    
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${subject}&part=snippet&type=video`)
        .then(response => response.json())
        .then(data => {
            displayVideos(data.items);
        })
        .catch(error => {
            console.error('Error fetching videos:', error);
        });
}


function displayVideos(videos) {
    const videosContainer = document.getElementById('videosContainer');
    videosContainer.innerHTML = '';

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;

        const videoFrame = document.createElement('iframe');
        videoFrame.classList.add('videoFrame');
        videoFrame.src = `https://www.youtube.com/embed/${videoId}`;

        const videoTitle = document.createElement('h3');
        videoTitle.textContent = title;

        videosContainer.appendChild(videoTitle);
        videosContainer.appendChild(videoFrame);
    });
}
