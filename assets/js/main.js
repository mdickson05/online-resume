// Github Projects
const githubProjectsContainer = document.getElementById('github-projects');
const pinnedProjectsUrl = 'assets/data/pinned-projects.json';

function formatRepoName(name) {
    return name
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function createRepoTag(text) {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
}

function normalisePinnedRepo(repo) {
    return {
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stars,
        url: repo.url,
        homepageUrl: repo.homepageUrl
    };
}

function createRepoCard(repo) {
    const pinnedRepo = normalisePinnedRepo(repo);
    const card = document.createElement('div');
    card.className = 'project__item grid';

    const data = document.createElement('div');
    data.className = 'project__data';

    const title = document.createElement('h3');
    title.className = 'project__title text-lg';
    title.textContent = formatRepoName(pinnedRepo.name);

    const description = document.createElement('p');
    description.className = 'project__description';
    description.textContent = pinnedRepo.description || 'Pinned GitHub repository.';

    const stackTitle = document.createElement('h4');
    stackTitle.className = 'project__stack text-xs';
    stackTitle.textContent = 'DETAILS:';

    const tags = document.createElement('ul');
    tags.className = 'tags text-sm';

    if(pinnedRepo.language) {
        tags.appendChild(createRepoTag(pinnedRepo.language));
    }

    if(pinnedRepo.stars > 0) {
        tags.appendChild(createRepoTag(`${pinnedRepo.stars} stars`));
    }

    const link = document.createElement('a');
    link.className = 'project__link text-sm';
    link.href = pinnedRepo.homepageUrl || pinnedRepo.url;
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    link.textContent = pinnedRepo.homepageUrl ? 'View Project' : 'View on GitHub';

    data.appendChild(title);
    data.appendChild(description);
    data.appendChild(stackTitle);
    data.appendChild(tags);
    data.appendChild(link);
    card.appendChild(data);

    return card;
}

async function loadGithubProjects() {
    if(!githubProjectsContainer) return;

    try {
        const response = await fetch(pinnedProjectsUrl);

        if(!response.ok) {
            throw new Error('Pinned project data could not be loaded.');
        }

        const repos = await response.json();
        githubProjectsContainer.innerHTML = '';

        repos.forEach((repo) => {
            githubProjectsContainer.appendChild(createRepoCard(repo));
        });

        if(githubProjectsContainer.children.length === 0) {
            githubProjectsContainer.innerHTML = '<p class="project__status text-lg">No pinned GitHub projects found.</p>';
        }
    } catch(error) {
        githubProjectsContainer.innerHTML = '<p class="project__status text-lg">Pinned GitHub projects are unavailable right now.</p>';
    }
}

loadGithubProjects();

// Toggle menu
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

// Show menu
if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
        navToggle.setAttribute('aria-expanded', 'true');
    })
}

// Hide menu
if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        navToggle.setAttribute('aria-expanded', 'false');
    })
}

// Logic to hide menu when navigation link is clicked
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // when
    navMenu.classList.remove('show-menu');
    navToggle.setAttribute('aria-expanded', 'false');
}
navLink.forEach((n) => n.addEventListener('click', linkAction))


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
const emailServiceId = 'service_csloze7';
const emailTemplateId = 'template_s08bmol';
const emailPublicKey = 'N5D1wHPHY2jFXNXdT';

if(window.emailjs) {
    emailjs.init({
        publicKey: emailPublicKey
    });
}

const contactForm = document.getElementById('contact-form'),
contactName = document.getElementById('contact-name'),
contactEmail = document.getElementById('contact-email'),
Message = document.getElementById('message'),
contactMessage = document.getElementById('contact-message');

function showContactMessage(message, className) {
    contactMessage.classList.remove('color-light', 'color-dark');
    contactMessage.classList.add(className);
    contactMessage.textContent = message;
}

const sendEmail = (e) => {
    e.preventDefault();
    // check if the field is not empty first
    if (
        contactName.value.trim() === '' || 
        contactEmail.value.trim() === '' ||
        Message.value.trim() === ''
    ) {
        showContactMessage('Write all the input fields', 'color-dark');
        return;
    }

    if(!window.emailjs) {
        showContactMessage('Email service is unavailable right now.', 'color-dark');
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'SENDING...';

    emailjs.sendForm(emailServiceId, emailTemplateId, contactForm)
        .then(() => {
            showContactMessage('Message sent', 'color-light');
            contactForm.reset();

            setTimeout(() => {
                contactMessage.textContent = '';
            }, 5000);
        })
        .catch((error) => {
            console.error('EmailJS send failed:', error);
            showContactMessage('Message failed to send. Please email me directly.', 'color-dark');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'SEND';
        });
}

if(contactForm) {
    contactForm.addEventListener('submit', sendEmail);
}
