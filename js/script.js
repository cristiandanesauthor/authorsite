const contentPane = document.getElementById('content-pane');
const banner = document.querySelector('.banner');
const mainNav = document.getElementById('main-nav');
const navLinks = document.querySelectorAll('#main-nav a[data-section]');
const booksMenu = document.getElementById('books-menu');
const booksToggle = document.getElementById('books-toggle');
const storiesMenu = document.getElementById('stories-menu');
const storiesToggle = document.getElementById('stories-toggle');
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');
const drawerLinks = document.querySelectorAll('#main-nav a, #main-nav .nav-item');
const bannerImages = {
    about: 'banners/Banner1.jpg',
    'physical-realm': 'banners/Banner2.jpg',
    obsolescence: 'banners/Banner4.jpg',
    subscribe: 'banners/Banner3.jpg'
};

function renderSection(section) {
    const item = contentData[section] || contentData.about;
    contentPane.innerHTML = item.body || '';
    const image = bannerImages[section] || bannerImages.about;
    banner.style.backgroundImage = `url('${image}')`;
}

function closeSubmenus() {
    booksMenu.classList.remove('open');
    storiesMenu.classList.remove('open');
}

function toggleSubmenu(menu) {
    const shouldOpen = !menu.classList.contains('open');
    closeSubmenus();
    if (shouldOpen) {
        menu.classList.add('open');
    }
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

function handleMenuToggleClick(menu, toggle) {
    return function(event) {
        event.preventDefault();
        event.stopPropagation();
        toggleSubmenu(menu);
    };
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
        toggleSubmenu(booksMenu);
    } else if (safeSection === 'stories') {
        toggleSubmenu(storiesMenu);
    } else {
        closeSubmenus();
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

booksToggle.addEventListener('click', handleMenuToggleClick(booksMenu, booksToggle));
storiesToggle.addEventListener('click', handleMenuToggleClick(storiesMenu, storiesToggle));

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
        if (this === booksToggle || this === storiesToggle) {
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
    if (!booksMenu.contains(event.target) && !storiesMenu.contains(event.target) && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeSubmenus();
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