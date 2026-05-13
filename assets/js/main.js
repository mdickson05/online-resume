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

function formatDate(dateValue) {
    if(!dateValue) return null;

    return new Intl.DateTimeFormat('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date(dateValue));
}

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if(className) {
        element.className = className;
    }

    if(text) {
        element.textContent = text;
    }

    return element;
}

function setProjectStatus(message) {
    githubProjectsContainer.replaceChildren(createElement('p', 'project__status text-lg', message));
}

function getSafeHttpUrl(url) {
    if(!url) return null;

    try {
        const parsedUrl = new URL(url, window.location.href);

        if(!['https:', 'http:'].includes(parsedUrl.protocol)) {
            return null;
        }

        return parsedUrl.href;
    } catch(error) {
        return null;
    }
}

function getLanguageClassName(languageName) {
    if(!languageName) return '';

    const slug = languageName
        .toLowerCase()
        .replace('#', 'sharp')
        .replace(/[^a-z0-9]+/g, '');

    return ` project__language-dot--${slug}`;
}

function normalisePinnedRepo(repo) {
    return {
        name: repo.name,
        nameWithOwner: repo.nameWithOwner,
        description: repo.description,
        primaryLanguage: repo.primaryLanguage || (repo.language ? { name: repo.language, color: null } : null),
        languages: repo.languages || [],
        topics: repo.topics || [],
        stats: {
            stars: repo.stats?.stars ?? repo.stars ?? 0,
            forks: repo.stats?.forks ?? 0,
            openIssues: repo.stats?.openIssues ?? 0,
            openPullRequests: repo.stats?.openPullRequests ?? 0
        },
        dates: repo.dates || {
            createdAt: null,
            updatedAt: null,
            pushedAt: null
        },
        flags: repo.flags || {
            isArchived: false,
            isFork: false
        },
        url: repo.url,
        homepageUrl: repo.homepageUrl
    };
}

function createProjectStat(label, value) {
    const item = createElement('li', 'project__stat');
    const valueElement = createElement('span', 'project__stat-value', String(value));
    const labelElement = createElement('span', 'project__stat-label', label);

    item.appendChild(valueElement);
    item.appendChild(labelElement);

    return item;
}

function createProjectLink(href, text) {
    const link = document.createElement('a');
    link.className = 'project__link text-sm';
    link.href = href;
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    link.textContent = text;

    return link;
}

function createRepoCard(repo) {
    const pinnedRepo = normalisePinnedRepo(repo);
    const card = document.createElement('div');
    card.className = 'project__item grid';

    const data = document.createElement('div');
    data.className = 'project__data';

    const header = createElement('div', 'project__header');
    const titleGroup = createElement('div', 'project__title-group');
    const title = createElement('h3', 'project__title text-lg');
    title.textContent = formatRepoName(pinnedRepo.name);

    const repoName = createElement('p', 'project__repo-name text-xs', pinnedRepo.nameWithOwner);
    titleGroup.appendChild(title);

    if(pinnedRepo.nameWithOwner) {
        titleGroup.appendChild(repoName);
    }

    header.appendChild(titleGroup);

    if(pinnedRepo.primaryLanguage?.name) {
        const language = createElement('span', 'project__language text-xs');
        const languageDot = createElement(
            'span',
            `project__language-dot${getLanguageClassName(pinnedRepo.primaryLanguage.name)}`
        );
        language.appendChild(languageDot);
        language.appendChild(document.createTextNode(pinnedRepo.primaryLanguage.name));
        header.appendChild(language);
    }

    const description = createElement('p', 'project__description');
    description.textContent = pinnedRepo.description || 'Pinned GitHub repository.';

    const topics = createElement('ul', 'project__topics text-xs');
    pinnedRepo.topics.slice(0, 4).forEach((topic) => {
        topics.appendChild(createRepoTag(topic));
    });

    const stats = createElement('ul', 'project__stats text-xs');
    stats.appendChild(createProjectStat('Stars', pinnedRepo.stats.stars));
    stats.appendChild(createProjectStat('Forks', pinnedRepo.stats.forks));
    stats.appendChild(createProjectStat('Issues', pinnedRepo.stats.openIssues));
    stats.appendChild(createProjectStat('PRs', pinnedRepo.stats.openPullRequests));

    const meta = createElement('p', 'project__meta text-xs');
    const pushedDate = formatDate(pinnedRepo.dates.pushedAt);
    const badges = [];

    if(pushedDate) {
        badges.push(`Last pushed ${pushedDate}`);
    }

    if(pinnedRepo.flags.isFork) {
        badges.push('Fork');
    }

    if(pinnedRepo.flags.isArchived) {
        badges.push('Archived');
    }

    meta.textContent = badges.join(' · ');

    const actions = createElement('div', 'project__actions');
    const repoUrl = getSafeHttpUrl(pinnedRepo.url);
    const homepageUrl = getSafeHttpUrl(pinnedRepo.homepageUrl);

    if(repoUrl) {
        actions.appendChild(createProjectLink(repoUrl, 'GitHub'));
    }

    if(homepageUrl) {
        actions.appendChild(createProjectLink(homepageUrl, 'Live project'));
    }

    data.appendChild(header);
    data.appendChild(description);

    if(topics.children.length > 0) {
        data.appendChild(topics);
    }

    data.appendChild(stats);

    if(meta.textContent) {
        data.appendChild(meta);
    }

    data.appendChild(actions);
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
        githubProjectsContainer.replaceChildren();

        repos.forEach((repo) => {
            githubProjectsContainer.appendChild(createRepoCard(repo));
        });

        if(githubProjectsContainer.children.length === 0) {
            setProjectStatus('No pinned GitHub projects found.');
        }
    } catch(error) {
        setProjectStatus('Pinned GitHub projects are unavailable right now.');
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
        publicKey: emailPublicKey,
        blockHeadless: true,
        limitRate: {
            id: 'contact-form',
            throttle: 30000
        }
    });
}

const contactForm = document.getElementById('contact-form'),
contactName = document.getElementById('contact-name'),
contactEmail = document.getElementById('contact-email'),
Message = document.getElementById('message'),
contactWebsite = document.getElementById('contact-website'),
contactMessage = document.getElementById('contact-message');

function showContactMessage(message, className) {
    contactMessage.classList.remove('color-light', 'color-dark');
    contactMessage.classList.add(className);
    contactMessage.textContent = message;
}

function resetRecaptcha() {
    if(window.grecaptcha) {
        grecaptcha.reset();
    }
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

    if(!window.grecaptcha) {
        showContactMessage('reCAPTCHA is unavailable right now. Please try again later.', 'color-dark');
        return;
    }

    if(grecaptcha.getResponse().trim() === '') {
        showContactMessage('Please complete the reCAPTCHA before sending.', 'color-dark');
        return;
    }

    if(contactWebsite.value.trim() !== '') {
        contactForm.reset();
        resetRecaptcha();
        showContactMessage('Message sent', 'color-light');
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'SENDING...';

    emailjs.sendForm(emailServiceId, emailTemplateId, contactForm)
        .then(() => {
            showContactMessage('Message sent', 'color-light');
            contactForm.reset();
            resetRecaptcha();

            setTimeout(() => {
                contactMessage.textContent = '';
            }, 5000);
        })
        .catch((error) => {
            console.error('EmailJS send failed:', error);
            resetRecaptcha();
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
