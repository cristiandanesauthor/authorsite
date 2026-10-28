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
let repaginateObsolescence = null;
const bannerImages = {
    about: 'banners/Banner1.jpg',
    'physical-realm': 'banners/Banner2.jpg',
    obsolescence: 'banners/Banner4.jpg',
    subscribe: 'banners/Banner3.jpg'
};

function renderSection(section) {
    const item = contentData[section] || contentData.about;
    repaginateObsolescence = null;
    contentPane.innerHTML = item.body || '';
    if (section === 'obsolescence') {
        initializeObsolescenceReader();
    }
    const image = bannerImages[section] || bannerImages.about;
    banner.style.backgroundImage = `url('${image}')`;
}

function initializeObsolescenceReader() {
    const story = contentPane.querySelector('.obsolescence-story > div');
    if (!story) {
        return;
    }

    const storyBlocks = Array.from(story.children);
    const reader = document.createElement('div');
    reader.className = 'obsolescence-reader';

    const page = document.createElement('div');
    page.className = 'obsolescence-page';

    const pageContent = document.createElement('div');
    pageContent.className = 'obsolescence-page-content';
    page.appendChild(pageContent);

    const controls = document.createElement('div');
    controls.className = 'obsolescence-reader-controls';

    const previousButton = document.createElement('button');
    previousButton.type = 'button';
    previousButton.textContent = 'Previous';

    const pageStatus = document.createElement('span');
    pageStatus.className = 'obsolescence-page-status';
    pageStatus.setAttribute('aria-live', 'polite');

    const pageSelect = document.createElement('select');
    pageSelect.setAttribute('aria-label', 'Skip to page');

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = 'Next';

    controls.append(previousButton, pageStatus, pageSelect, nextButton);
    reader.append(page, controls);
    story.replaceWith(reader);

    let pages = [];
    let currentPage = 0;

    function renderPage() {
        pageContent.replaceChildren(...pages[currentPage].map(function(block) {
            return block.cloneNode(true);
        }));
        pageStatus.textContent = `Page ${currentPage + 1} of ${pages.length}`;
        previousButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === pages.length - 1;
        pageSelect.value = String(currentPage);
    }

    function paginate() {
        pageContent.replaceChildren();
        pages = [[]];

        storyBlocks.forEach(function(block) {
            pageContent.appendChild(block);
            if (pageContent.scrollHeight > pageContent.clientHeight && pages[pages.length - 1].length > 0) {
                pageContent.removeChild(block);
                pages.push([]);
                pageContent.replaceChildren();
                pageContent.appendChild(block);
            }
            pages[pages.length - 1].push(block);
        });

        pageSelect.replaceChildren(...pages.map(function(_, index) {
            const option = document.createElement('option');
            option.value = String(index);
            option.textContent = `Page ${index + 1}`;
            return option;
        }));
        currentPage = Math.min(currentPage, pages.length - 1);
        renderPage();
    }

    previousButton.addEventListener('click', function() {
        if (currentPage > 0) {
            currentPage -= 1;
            renderPage();
        }
    });

    nextButton.addEventListener('click', function() {
        if (currentPage < pages.length - 1) {
            currentPage += 1;
            renderPage();
        }
    });

    pageSelect.addEventListener('change', function() {
        currentPage = Number(pageSelect.value);
        renderPage();
    });

    repaginateObsolescence = paginate;
    paginate();
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
    if (repaginateObsolescence) {
        repaginateObsolescence();
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