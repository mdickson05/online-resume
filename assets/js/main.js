// Mixitup Filter
let mixerProjects = mixitup('.project__container', {
    selectors: {
        target: '.project__item'
    },
    animation: {
        duration: 300
    }
});

// Background Header
function scrollHeader() {
    const header = document.getElementById('header');
    // When the scroll > 50 viewport height, 
    // add the scroll header class
    if(this.scrollY >= 50) header.classList.add('scroll-header');
    else header.classList.remove('scroll-header');
}
    
window.addEventListener('scroll', scrollHeader);

// Active link
const link = document.querySelectorAll('.nav__link');

function activeLink() {
    link.forEach((a) => a.classList.remove('active-link'));
    this.classList.add('active-link');
}

link.forEach((a) => a.addEventListener('click', activeLink));

// Active Work
const work = document.querySelectorAll('.category__btn');

function activeWork() {
    work.forEach((a) => a.classList.remove('active-work'));
    this.classList.add('active-work');
}

work.forEach((a) => a.addEventListener('click', activeWork));

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

// Contact Form
const contactForm = document.getElementById('contact-form'),
contactName = document.getElementById('contact-name'),
contactEmail = document.getElementById('contact-email'),
Message = document.getElementById('message'),
contactMessage = document.getElementById('contact-message');

const sendEmail = (e) => {
    e.preventDefault();
    // check if the field is not empty first
    if (
        contactName.value === '' || 
        contactEmail.value === '' ||
        Message.value === ''
    ) {
        // make the Message text above the button change colour
        contactMessage.classList.remove('color-light');
        contactMessage.classList.add('color-dark');

        // Show a new message
        contactMessage.textContent = 'Write all the input fields';
    } else {
        // serviceID - templateID - #form - publickey
        emailjs.sendForm(
            'service_csloze7',
            'template_s08bmol',
            '#contact-form', 
            'N5D1wHPHY2jFXNXdT'
        )
        .then( 
            () => {
                // show message and add colour
                contactMessage.classList.add('color-light');
                contactMessage.textContent = 'Message sent ✔️';

                // remove message after 5 seconds
                setTimeout(() => {
                    contactMessage.textContent = '';
                }, 5000);
            },
            (error) => {
                alert('Sorry, an unknown error has occurred with the contact form. Please try again!',  error);
            }
        );

        // clear input fields
        contactName.value = '';
        contactEmail.value = '';
        Message.value = '';
    }
}

contactForm.addEventListener('submit', sendEmail);