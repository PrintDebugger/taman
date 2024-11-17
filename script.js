const currentFile = window.location.pathname.split('/').pop() === ''? 'index.html' : window.location.pathname.split('/').pop();

// WEBSITE TEMPLATE

function loadNavbar() {

    const navbar = document.getElementById('navbar-fixed');

    navbar.innerHTML = `
    <audio id="background-music" src="resources/music.mp3" loop></audio>
    <div class="links">
        <div class="nav-link"><a href="index.html">Home</a></div>
        <div class="nav-link"><a href="about.html">About</a></div>
        <div class="nav-link"><a href="facilities.html">Facilities</a></div>
        <div class="nav-link"><a href="interview.html">Video&FAQ</a></div>
        <div class="nav-link"><a href="gallery.html">Gallery</a></div>
    </div>
    <div class="controls">
        <button id="menu"><img src="resources/menu.png"></button>
        <button id="music"><img src="resources/music-off.png"></button>
    </div>
    `;

    initialiseMusic();

    // Adds the "current" class to the div containing an anchor element which href is the current page.
    const currentDiv = navbar.querySelector(`div a[href="${currentFile}"]`)?.closest("div");

    console.log(currentFile);

    if (currentDiv) {
        currentDiv.classList.add("current");
        console.log("Added current class");
    } else {
        console.log("Cannot find div");
    }

};



// TOOLTIP HIDE

function initialiseTooltip() {

    const element = document.getElementById('message');
    
    element.addEventListener('click', () => {
        element.classList.add('disappear'); // Start fading out
        
        // Wait for the transition to complete, then hide the element
        element.addEventListener('transitionend', () => {
            element.style.display = 'none';
        }, { once: true }); // Use { once: true } to remove the event listener after it runs
    });

}



// MENU AND MUSIC NAVIGATION

// Fade-in effect for music
function fadeInMusic(audioElement) {
    audioElement.volume = 0;
    audioElement.play();
    let volume = 0;
    const fadeIn = setInterval(() => {
        volume += 0.05;
        if (volume >= 1) {
            clearInterval(fadeIn);
        } else {
            audioElement.volume = volume;
        }
    }, 50); // Adjust timing for desired fade speed
}

function initialiseMusic() {
    
    const music = document.getElementById('background-music');
    const video = document.getElementById('video');
    const musicToggle = document.getElementById('music');

    // Load previous music state from sessionStorage
    const savedTime = sessionStorage.getItem('musicTime');
    const isPlaying = sessionStorage.getItem('musicPlaying') === 'true';
    if (savedTime) music.currentTime = savedTime;
    if (isPlaying) {
        music.play();
        musicToggle.innerHTML = "<img src=\"resources/music-on.gif\">";
    }

    let wasMusicPlaying = isPlaying; // Initialize wasMusicPlaying based on saved state

    // Save music time and state before leaving the page
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('musicTime', music.currentTime);
        sessionStorage.setItem('musicPlaying', !music.paused);
    });

    // Toggle music play/pause
    musicToggle.addEventListener('click', () => {
        // Check if the video is playing
        if (video && !video.paused) {
            // If video is playing, just toggle the button without starting music
            wasMusicPlaying = false;
            musicToggle.innerHTML = "<img src=\"resources/music-off.png\">";
        } else {
            // If video is not playing, toggle music normally
            if (music.paused) {
                fadeInMusic(music);
                wasMusicPlaying = true;  // Update the flag
                musicToggle.innerHTML = "<img src=\"resources/music-on.gif\">";
            } else {
                music.pause();
                wasMusicPlaying = false;  // Update the flag
                musicToggle.innerHTML = "<img src=\"resources/music-off.png\">";
            }
        }
    });

    if (video) {
        // Pause music on video play, fade-in on pause
        video.addEventListener('play', () => {
            wasMusicPlaying = !music.paused; // Capture current play state before pausing
            music.pause();
            musicToggle.innerHTML = "<img src=\"resources/music-off.png\">";
        });

        video.addEventListener('pause', () => {
            if (wasMusicPlaying) {
                fadeInMusic(music);
                musicToggle.innerHTML = "<img src=\"resources/music-on.gif\">";
            }
        });
    }

};



// BUTTON CONTROLS for facilities.html

function initialiseButtons() {

    const buttonGroup = document.querySelector(".sidenav"); // Select parent container

    if (buttonGroup) {
        var activeSectionIndex = 1; // Define current section, default is 1

        // Add same click command to all buttons
        buttonGroup.querySelectorAll(".sidenav-button").forEach((button, index) => {
            button.addEventListener('click', function() {
                if (activeSectionIndex !== index + 1) {

                    const oldSection = document.getElementById(`f${activeSectionIndex}`);
                    oldSection.classList.remove("active");
                    oldSection.style.display = 'none';
                    activeSectionIndex = index + 1
                
                    const newSection = document.getElementById(`f${activeSectionIndex}`);
                    newSection.style.display = 'flex';
                    setTimeout(() => {
                        newSection.classList.add("active");
                    }, 10);

                    for (let child of buttonGroup.children) {
                        child.classList.remove("button-active")
                    }
                    button.classList.add("button-active");

                } else {
                    console.log("Ignoring button click: Already at page")
                }
            })
        });
    } else {
        console.log("No class sidenav detected.")
    }

}



// TEXT CAROUSEL for index.html

function initialiseTextCarousel() {

    const textCarouselContainer = document.querySelector(".carousel-texts");
    const textItems = Array.from(textCarouselContainer.querySelectorAll(".carousel-text"));
    const currentText = document.getElementById("current-text");
    const prevButton = document.getElementById("info-prev");
    const nextButton = document.getElementById("info-next");

    let currentIndex = 0;

    function updateTextCarousel() {
        const itemWidth = textItems[0].clientWidth;
        textCarouselContainer.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        currentText.innerText = `${currentIndex + 1} of 3`
    }

    prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + textItems.length) % textItems.length;
        updateTextCarousel();
    });

    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % textItems.length;
        updateTextCarousel();
    });

    // Update carousel position on window resize
    window.addEventListener("resize", updateTextCarousel);

}



// IMAGE CAROUSEL for facilities.html

function initialiseImageCarousel() {

    const carousels = document.querySelectorAll(".carousel");

    carousels.forEach(carousel => {
        const imagesContainer = carousel.querySelector(".carousel-images");
        const images = Array.from(imagesContainer.querySelectorAll("img"));
        const prevButton = carousel.querySelector(".prev");
        const nextButton = carousel.querySelector(".next");
        
        let currentIndex = 0;
        
        function updateCarousel() {
            const imageWidth = images[0].clientWidth;
            imagesContainer.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
        }

        prevButton.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
            //console.log(`Current index for carousel ${carousel.id} is ${currentIndex}`);
        });

        nextButton.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
            //console.log(`Current index for carousel ${carousel.id} is ${currentIndex}`);
        });
        
        // Update carousel position on window resize
        window.addEventListener("resize", updateCarousel);
    });

}



// IMAGE OVERLAY (facilities.html)


function initialiseOverlay() {

    const thumbnails = document.querySelectorAll('.thumbnail');
    const imageOverlay = document.getElementById('fac-overlay');
    const zoomedImage = document.getElementById('overlay-image');

    // Add click event listener to each thumbnail
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            // Set the overlay image source to the clicked thumbnail's source
            zoomedImage.src = thumbnail.src;
            imageOverlay.style.display = 'flex';
        });
    });

    // Hide overlay when clicked
    if (imageOverlay) {
        imageOverlay.addEventListener('click', () => {
            imageOverlay.style.display = 'none';
        });
    }

}



// IMAGE OVERLAY V2 (gallery.html)

function initialiseGallery() {

    const images = document.querySelectorAll('.gallery-image');
    const overlay = document.getElementById('gal-overlay');
    const overlayImage = document.getElementById('image-zoomed');
    const imageTitle = document.getElementById('image-title');
    const imageText = document.getElementById('image-desc');
    const prevButton = document.querySelectorAll('.gal-prev');
    const nextButton = document.querySelectorAll('.gal-next');
    const closeButton = document.getElementById('overlay-close');

    let currentIndex = 0;

    // Open overlay on image click
    images.forEach((image, index) => {
        image.addEventListener('click', () => {
            currentIndex = index;
            overlayImage.src = image.src;
            imageTitle.innerText = image.alt;
            imageText.innerText = image.getAttribute('data-description');
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    });

    // Navigate to previous image
    prevButton.forEach((button) => {
        button.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            overlayImage.src = images[currentIndex].src;
            imageTitle.innerText = images[currentIndex].alt;
            imageText.innerText = images[currentIndex].getAttribute('data-description');
        });
    });

    // Navigate to next image
    nextButton.forEach((button) => {
        button.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            overlayImage.src = images[currentIndex].src;
            imageTitle.innerText = images[currentIndex].alt;
            imageText.innerText = images[currentIndex].getAttribute('data-description');
        });
    });
    

    // Close overlay
    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable background scroll
    });

    // Close overlay on clicking outside the image
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable background scroll
        }
    });

}



window.onload = function() {

    loadNavbar();

    switch (currentFile) {

        case "index.html":
            initialiseTooltip();
            initialiseTextCarousel();
            break;

        case "about.html":
            initialiseOverlay();
            break;

        case "facilities.html":
            initialiseButtons();
            initialiseImageCarousel();
            initialiseOverlay();
            break;

        case "gallery.html":
            initialiseGallery();
            break;

    }

};