const contentPane = document.getElementById('content-pane');
const banner = document.querySelector('.banner');
const mainNav = document.getElementById('main-nav');
const navLinks = document.querySelectorAll('#main-nav a[data-section]');
const booksMenu = document.getElementById('books-menu');
const booksToggle = document.getElementById('books-toggle');
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');
const drawerLinks = document.querySelectorAll('#main-nav a, #main-nav .nav-item');
const bannerImages = {
    about: 'banners/Banner1.jpg',
    'physical-realm': 'banners/Banner2.jpg',
    subscribe: 'banners/Banner3.jpg'
};

function renderSection(section) {
    const item = contentData[section] || contentData.about;
    contentPane.innerHTML = `<p>${item.body}</p>`;
    const image = bannerImages[section] || bannerImages.about;
    banner.style.backgroundImage = `url('${image}')`;
}

function closeSubmenu() {
    booksMenu.classList.remove('open');
}

function setMenuOpen(open) {
    mainNav.classList.toggle('open', open);
    menuOverlay.classList.toggle('show', open);
    document.body.classList.toggle('menu-open', open);
    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', String(open));
    }
    if (!open && document.activeElement && mainNav.contains(document.activeElement)) {
        document.activeElement.blur();
    }
}

function setActiveLink(section) {
    navLinks.forEach(function(item) {
        item.classList.remove('active');
    });

    const activeLink = document.querySelector(`#main-nav a[data-section="${section}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function navigateToSection(section, options) {
    const opts = options || {};
    const safeSection = contentData[section] ? section : 'about';
    renderSection(safeSection);
    setActiveLink(safeSection);
    if (safeSection === 'books') {
        booksMenu.classList.add('open');
    } else {
        closeSubmenu();
    }
    if (opts.updateHash !== false) {
        const nextHash = `#${safeSection}`;
        if (window.location.hash !== nextHash) {
            history.pushState(null, '', nextHash);
        }
    }
    if (opts.closeDrawer !== false) {
        setMenuOpen(false);
    }
}

booksToggle.addEventListener('click', function(event) {
    event.preventDefault();
    booksMenu.classList.toggle('open');
});

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        setMenuOpen(!mainNav.classList.contains('open'));
    });
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', function() {
        setMenuOpen(false);
    });
}

navLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
        if (this === booksToggle) {
            return;
        }

        event.preventDefault();
        const section = this.getAttribute('data-section');
        navigateToSection(section, { closeDrawer: true, updateHash: true });
    });
});

drawerLinks.forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

document.addEventListener('click', function(event) {
    if (!booksMenu.contains(event.target) && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeSubmenu();
        setMenuOpen(false);
    }
});

window.addEventListener('hashchange', function() {
    const hashSection = window.location.hash.replace('#', '') || 'about';
    navigateToSection(hashSection, { closeDrawer: false, updateHash: false });
});

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        setMenuOpen(false);
    }
});

const initialSection = window.location.hash.replace('#', '') || 'about';
navigateToSection(initialSection, { closeDrawer: false, updateHash: false });

function buy(asin) {
    var localeMap = {
    "en-CA": "amazon.ca",
    "fr-CA": "amazon.ca",
    "en-US": "amazon.com",
    "en-GB": "amazon.co.uk",
    "de":    "amazon.de",
    "fr":    "amazon.fr",
    "it":    "amazon.it",
    "es":    "amazon.es",
    "ja":    "amazon.co.jp",
    "en-AU": "amazon.com.au",
    "en-IN": "amazon.in",
    "nl":    "amazon.nl",
    "sv":    "amazon.se",
    "pl":    "amazon.pl",
    "pt":    "amazon.com.br",
    "tr":    "amazon.com.tr",
    "zh":    "amazon.cn",
    "es-MX": "amazon.com.mx",
    "en-SG": "amazon.sg"
    };

    var lang = navigator.language || "en-CA";
    var domain = localeMap[lang]
            || localeMap[lang.split("-")[0]]
            || "amazon.ca";

    window.open("https://www." + domain + "/dp/" + asin, "_blank");
}