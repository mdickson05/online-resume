// Mixitup Filter
let mixerProjects = mixitup('.project__container', {
    selectors: {
        target: '.project__item'
    },
    animation: {
        duration: 300
    }
});

// Active Work
const linkWork = document.querySelectorAll('.category__btn');

function activeWork() {
    linkWork.forEach((a) => a.classList.remove('active-work'));
    this.classList.add('active-work');
}

linkWork.forEach((a) => a.addEventListener('click', activeWork));

// Swiper.js
var testiSwiper = new Swiper(".testimonial__container", {
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
});