// Script for club-details.html

document.addEventListener('DOMContentLoaded', async function () {
    await fetchClubsData();
    const clubId = sessionStorage.getItem('selectedClubId');
    if (clubId) {
        displayClubDetails(clubId); // Note: _id is a string from mongo now
    } else {
        window.location.href = 'clubs.html';
    }
});

function displayClubDetails(clubId) {
    const club = clubs.find(c => c.id === clubId);

    if (!club) {
        window.location.href = 'clubs.html';
        return;
    }

    // Update club details
    const clubDetailsDiv = document.getElementById('clubDetails');
    clubDetailsDiv.innerHTML = `
        <div class="club-detail-card" style="border-color: ${club.color}; background-color: ${club.backgroundColor}">
            <div class="detail-header">
                <div class="detail-image" style="background-color: ${club.color}">${club.element}</div>
                <div class="detail-info">
                    <h1>${club.name}</h1>
                    <h3 style="color: ${club.color}; margin-bottom: 10px;">Element: ${club.theme}</h3>
                    <p>${club.description}</p>
                </div>
            </div>
        </div>
    `;

    // Render team members
    renderTeamMembers(club);

    // Update stats
    document.getElementById('totalPoints').textContent = club.totalPoints;
    document.getElementById('sportsPoints').textContent = club.sportsPoints;
    document.getElementById('culturePoints').textContent = club.culturePoints;

    document.title = `${club.name} - Vihaang`;
}

function renderTeamMembers(club) {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';

    const members = [
        {
            name: club.captainBoy,
            role: 'Coordinator (Boy)',
            image: club.captainBoyImage,
            type: 'primary'
        },
        {
            name: club.captainGirl,
            role: 'Coordinator (Girl)',
            image: club.captainGirlImage,
            type: 'primary'
        },
        {
            name: club.viceCaptainBoy,
            role: 'Vice-Coordinator (Boy)',
            image: club.viceCaptainBoyImage,
            type: 'secondary'
        },
        {
            name: club.viceCaptainGirl,
            role: 'Vice-Coordinator (Girl)',
            image: club.viceCaptainGirlImage,
            type: 'secondary'
        }
    ];

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = `member-card ${member.type}`;

        memberCard.innerHTML = `
            <div class="member-image">${member.image}</div>
            <div class="member-name">${member.name}</div>
            <div class="member-role">${member.role}</div>
        `;

        teamGrid.appendChild(memberCard);
    });
}
