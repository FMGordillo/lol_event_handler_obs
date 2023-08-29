function showVideo() {
  const video = document.getElementById(`video_raw`);
  video.classList.remove("hidden");
}

function removeVideo() {
  const video = document.getElementById(`video_raw`);
  video.classList.add("hidden");
}
