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
        .then( () => {
            // show message and add colour
            contactMessage.classList.add('color-light');
            contactMessage.textContent = 'Message sent ✔️';

            // remove message after 5 seconds
            setTimeout(() => {
                contactMessage.textContent = '';
            }, 5000);
        });
    }
}

contactForm.addEventListener('submit', sendEmail);