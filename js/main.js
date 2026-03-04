// Main script for index.html (Home Page with Leaderboard)

document.addEventListener('DOMContentLoaded', async function () {
    // Start countdown immediately so it doesn't wait on failing fetch requests
    startCountdown();

    await fetchClubsData();
    renderLeaderboard();
    renderAboutSection();
    renderHomeSponsors();
});

function renderLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '';

    // Sort clubs by total points
    const sortedClubs = [...clubs].sort((a, b) => b.totalPoints - a.totalPoints);

    const table = document.createElement('table');
    table.className = 'leaderboard-table';

    let headerHTML = `
        <thead>
            <tr>
                <th>Rank</th>
                <th colspan="2">Club</th>
                <th>Element</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
    `;

    sortedClubs.forEach((club, index) => {
        headerHTML += `
            <tr onclick="goToClubDetails(${club.id})" style="cursor: pointer;">
                <td class="rank">${index + 1}</td>
                <td class="club-capsule-cell"><div class="club-capsule" style="background: ${getClubGradient(club.name, club.color)};"></div></td>
                <td class="club-name-cell">${club.name}</td>
                <td class="element-cell">${club.theme}</td>
                <td class="points">${club.totalPoints}</td>
            </tr>
        `;
    });

    headerHTML += '</tbody>';
    table.innerHTML = headerHTML;
    leaderboard.appendChild(table);
}

function renderAboutSection() {
    const facultyList = document.getElementById('facultyList');
    const committeeList = document.getElementById('committeeList');

    if (facultyList) {
        facultyList.innerHTML = '';
        const faculty = organizers.filter(org => org.category === 'faculty');
        faculty.forEach(person => {
            const card = document.createElement('div');
            card.className = 'organizer-item';
            card.innerHTML = `
                <div class="organizer-image">${person.image}</div>
                <div class="organizer-info">
                    <div class="organizer-name">${person.name}</div>
                    <div class="organizer-role">${person.role}</div>
                </div>
            `;
            facultyList.appendChild(card);
        });
    }

    if (committeeList) {
        committeeList.innerHTML = '';
        const committee = organizers.filter(org => org.category === 'committee');
        committee.forEach(person => {
            const card = document.createElement('div');
            card.className = 'organizer-item';
            card.innerHTML = `
                <div class="organizer-image">${person.image}</div>
                <div class="organizer-info">
                    <div class="organizer-name">${person.name}</div>
                    <div class="organizer-role">${person.role}</div>
                </div>
            `;
            committeeList.appendChild(card);
        });
    }
}

function goToClubDetails(clubId) {
    sessionStorage.setItem('selectedClubId', clubId);
    window.location.href = 'club-details.html';
}

function renderHomeSponsors() {
    const sponsorsGrid = document.getElementById('homeSponsorsGrid');
    if (!sponsorsGrid) return;
    sponsorsGrid.innerHTML = '';

    sponsors.forEach(sponsor => {
        const sponsorCard = document.createElement('div');
        sponsorCard.className = 'sponsor-card';

        sponsorCard.innerHTML = `
            <div class="sponsor-category">${sponsor.category}</div>
            <div class="sponsor-logo">${sponsor.logo}</div>
            <div class="sponsor-name">${sponsor.name}</div>
        `;

        sponsorsGrid.appendChild(sponsorCard);
    });
}

function startCountdown() {
    // Set the date we're counting down to: March 25, 2026 18:00:00
    const countDownDate = new Date("Mar 25, 2026 18:00:00").getTime();

    // Update the count down every 1 second
    const x = setInterval(function () {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the elements
        const daysStr = days < 10 ? '0' + days : days.toString();
        const hoursStr = hours < 10 ? '0' + hours : hours.toString();
        const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
        const secondsStr = seconds < 10 ? '0' + seconds : seconds.toString();

        updateFlipValue('days', daysStr);
        updateFlipValue('hours', hoursStr);
        updateFlipValue('minutes', minutesStr);
        updateFlipValue('seconds', secondsStr);

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "<div class='time-box'><span class='time-value'>IT'S</span></div><div class='time-box'><span class='time-value'>TIME!</span></div>";
        }
    }, 1000);
}

function updateFlipValue(id, newValue) {
    const card = document.getElementById('flip-card-' + id);
    if (!card) return;

    const topNode = document.getElementById(id + '-top');
    const bottomNode = document.getElementById(id + '-bottom');
    if (!bottomNode || !topNode) return;

    const bottomValue = bottomNode.getAttribute('data-value');

    if (bottomValue !== newValue) {
        // Create anim elements
        const topAnim = document.createElement('div');
        topAnim.className = 'flip-top-anim';
        topAnim.innerText = bottomValue;

        const bottomAnim = document.createElement('div');
        bottomAnim.className = 'flip-bottom-anim';
        bottomAnim.innerText = newValue;

        card.appendChild(topAnim);
        card.appendChild(bottomAnim);

        topNode.innerText = newValue;

        setTimeout(() => {
            bottomNode.innerText = newValue;
            bottomNode.setAttribute('data-value', newValue);
            if (card.contains(topAnim)) card.removeChild(topAnim);
            if (card.contains(bottomAnim)) card.removeChild(bottomAnim);
        }, 600); // Wait for the 0.6s total animation
    }
}
// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ============================================
// GALLERY CAROUSEL
// ============================================
(function () {
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    if (!slides.length) return;

    let current = 0;
    const total = slides.length;

    function updateCarousel() {
        slides.forEach(s => s.className = 'gallery-slide');

        const getIdx = (offset) => (current + offset + total) % total;

        slides[current].classList.add('active');
        slides[getIdx(-1)].classList.add('prev');
        slides[getIdx(1)].classList.add('next');
        slides[getIdx(-2)].classList.add('far-prev');
        slides[getIdx(2)].classList.add('far-next');
    }

    function goNext() {
        current = (current + 1) % total;
        updateCarousel();
    }

    function goPrev() {
        current = (current - 1 + total) % total;
        updateCarousel();
    }

    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    // Auto-advance every 2.5 seconds
    let autoPlay = setInterval(goNext, 2500);

    // Pause on hover
    const wrapper = document.querySelector('.gallery-carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
        wrapper.addEventListener('mouseleave', () => {
            autoPlay = setInterval(goNext, 2500);
        });
    }

    updateCarousel();
})();

// ============================================
// EVENTS STRIP INFINITE AUTO-SCROLL
// ============================================
(function () {
    const strip = document.getElementById('eventsStrip');
    if (!strip) return;

    // Clone all event cards to create a seamless loop
    const cards = Array.from(strip.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        strip.appendChild(clone);
    });

    // Pause animation on hover
    strip.addEventListener('mouseenter', () => {
        strip.style.animationPlayState = 'paused';
    });
    strip.addEventListener('mouseleave', () => {
        strip.style.animationPlayState = 'running';
    });
})();