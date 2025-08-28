export function initializeSlider() {
  const images = document.querySelectorAll(".slider-image");
  const thumbnails = document.querySelectorAll(".img-thumbnail");
  let currentIndex = 0;
  let slideInterval;

  // Show specific slide
  function showSlide(index) {
    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });

    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  // Next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
  }

  // Start auto-slide
  function startSlider() {
    slideInterval = setInterval(nextSlide, 3000);
  }

  // Stop auto-slide
  function stopSlider() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  // Thumbnail click events
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", function () {
      showSlide(index);
      stopSlider();
      startSlider();
    });
  });

  // Pause on hover
  const slider = document.getElementById("imageSlider");
  if (slider) {
    slider.addEventListener("mouseenter", stopSlider);
    slider.addEventListener("mouseleave", startSlider);
  }

  // Start the slider
  startSlider();
}
