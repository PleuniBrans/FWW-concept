// Add this at the very top to test if the script loads
console.log("Script loaded successfully");

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded, initializing video functionality");
  
  const playButtons = document.querySelectorAll(".play-btn");
  console.log("Found play buttons:", playButtons.length);
  
  if (playButtons.length === 0) {
    console.error("No play buttons found! Check your HTML structure.");
    return;
  }
  
  playButtons.forEach(function(btn, index) {
    console.log(`Setting up button ${index + 1}`);
    
    btn.addEventListener("click", function(evt) {
      console.log(`Play button ${index + 1} clicked`);
      evt.preventDefault();
      
      // Vind de juiste .image-wrapper
      const wrapper = btn.closest(".image-wrapper");
      if (!wrapper) {
        console.error("No wrapper found for button", index + 1);
        return;
      }
      
      const thumb = wrapper.querySelector(".dj-thumb");
      const video = wrapper.querySelector(".dj-video");
      
      if (!video || !thumb) {
        console.error("Video or thumbnail not found", { 
          video: !!video, 
          thumb: !!thumb,
          buttonIndex: index + 1
        });
        return;
      }
      
      console.log("Starting video for button", index + 1);
      
      // Check if video can be played
      if (video.readyState < 2) {
        console.log("Video not ready to play, waiting...");
        video.addEventListener('canplay', function() {
          startVideo();
        }, { once: true });
        return;
      }
      
      startVideo();
      
      function startVideo() {
        console.log("Hiding thumbnail, showing video");
        // Verberg de afbeelding, toon de video en start afspelen
        thumb.style.display = "none";
        
        // Force video to show with important styles
        video.style.display = "block";
        video.style.visibility = "visible";
        video.style.opacity = "1";
        video.style.zIndex = "10";
        
        video.currentTime = 0;
        
        // Debug CSS properties
        console.log("Video element styles after setting display block:");
        console.log("- display:", window.getComputedStyle(video).display);
        console.log("- visibility:", window.getComputedStyle(video).visibility);
        console.log("- opacity:", window.getComputedStyle(video).opacity);
        console.log("- width:", window.getComputedStyle(video).width);
        console.log("- height:", window.getComputedStyle(video).height);
        console.log("- position:", window.getComputedStyle(video).position);
        console.log("- z-index:", window.getComputedStyle(video).zIndex);
        
        // Add the ended event listener BEFORE starting the video
        video.addEventListener("ended", function() {
          console.log("Video ended, returning to thumbnail");
          resetToThumbnail();
        }, { once: true });
        
        // Backup method: check if video has ended every 100ms
        const checkVideoEnd = setInterval(() => {
          if (video.ended || video.currentTime >= video.duration) {
            console.log("Video finished (detected by interval check)");
            clearInterval(checkVideoEnd);
            resetToThumbnail();
          }
        }, 100);
        
        // Play the video and handle any errors
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log("Video started playing successfully");
            console.log(`Video duration: ${video.duration}s`);
            console.log(`Video ready state: ${video.readyState}`);
          }).catch(error => {
            console.error("Error playing video:", error);
            clearInterval(checkVideoEnd);
            resetToThumbnail();
          });
        }
      }
      
      function resetToThumbnail() {
        console.log("Resetting to thumbnail");
        
        // Hide video completely
        video.style.display = "none";
        video.style.visibility = "hidden";
        video.style.opacity = "0";
        
        // Show thumbnail
        thumb.style.display = "block";
        thumb.style.visibility = "visible";
        thumb.style.opacity = "1";
        
        video.pause();
        video.currentTime = 0;
        
        // Clear any intervals that might still be running
        const highestId = window.setTimeout(() => {}, 0);
        for (let i = 0; i < highestId; i++) {
          window.clearInterval(i);
        }
      }
    });
  });
});