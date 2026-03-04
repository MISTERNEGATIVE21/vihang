// Script for events.html

document.addEventListener('DOMContentLoaded', async function () {
    await fetchClubsData();
    renderLeaderboard();
    setupTabs();
    buildSportTypeDropdown();
    populateCultureDropdown();
    buildGenderDropdown();
    setupEventListeners();
});

function renderLeaderboard() {
    const leaderboard = document.getElementById('eventsLeaderboard');
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
                <th>Sports Pts</th>
                <th>Culture Pts</th>
                <th>Total Pts</th>
            </tr>
        </thead>
        <tbody>
    `;

    sortedClubs.forEach((club, index) => {
        headerHTML += `
            <tr>
                <td class="rank">${index + 1}</td>
                <td class="club-capsule-cell"><div class="club-capsule" style="background: ${getClubGradient(club.name, club.color)};"></div></td>
                <td class="club-name-cell">${club.name}</td>
                <td class="points">${club.sportsPoints}</td>
                <td class="points">${club.culturePoints}</td>
                <td class="points" style="font-weight: bold; color: black;">${club.totalPoints}</td>
            </tr>
        `;
    });

    headerHTML += '</tbody>';
    table.innerHTML = headerHTML;
    leaderboard.appendChild(table);
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// ============================================
// CUSTOM DROPDOWN BUILDER
// ============================================
function buildCustomDropdown(nativeSelect, placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-dropdown';

    const trigger = document.createElement('div');
    trigger.className = 'custom-dropdown-trigger';
    trigger.textContent = placeholder;

    const optionsList = document.createElement('div');
    optionsList.className = 'custom-dropdown-options';

    wrapper.appendChild(trigger);
    wrapper.appendChild(optionsList);

    // Insert after the native select and hide it
    nativeSelect.parentNode.insertBefore(wrapper, nativeSelect.nextSibling);
    nativeSelect.style.display = 'none';

    // Toggle open/close
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.custom-dropdown.open').forEach(d => {
            if (d !== wrapper) d.classList.remove('open');
        });
        wrapper.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', () => {
        wrapper.classList.remove('open');
    });

    wrapper._trigger = trigger;
    wrapper._optionsList = optionsList;
    wrapper._nativeSelect = nativeSelect;
    wrapper._placeholder = placeholder;

    return wrapper;
}

function addDropdownOption(dropdown, value, label) {
    const opt = document.createElement('div');
    opt.className = 'custom-dropdown-option';
    opt.textContent = label;
    opt.dataset.value = value;

    opt.addEventListener('click', (e) => {
        e.stopPropagation();
        // Mark selected
        dropdown._optionsList.querySelectorAll('.custom-dropdown-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        dropdown._trigger.textContent = label;
        dropdown.classList.remove('open');

        // Sync native select and fire change
        dropdown._nativeSelect.value = value;
        dropdown._nativeSelect.dispatchEvent(new Event('change'));
    });

    dropdown._optionsList.appendChild(opt);
}

// Store dropdown references globally for dynamic updates
let sportsDropdownRef = null;
let genderDropdownRef = null;

function buildSportTypeDropdown() {
    const select = document.getElementById('sportTypeSelect');
    if (!select) return;
    const dropdown = buildCustomDropdown(select, '-- Choose Type --');

    ['Outdoor', 'Indoor', 'E-Sports', 'Athletics'].forEach(type => {
        addDropdownOption(dropdown, type, type);
    });

    // Also build the sport dropdown (initially empty, filled on type select)
    const sportSelect = document.getElementById('sportsEventSelect');
    sportsDropdownRef = buildCustomDropdown(sportSelect, '-- Choose a Sport --');

    // Hide sport and gender selectors until type is chosen
    document.getElementById('sportSelectorGroup').style.display = 'none';
    document.getElementById('genderSelectorGroup').style.display = 'none';
}

function populateSportsForType(type) {
    const select = document.getElementById('sportsEventSelect');
    // Clear native select (keep placeholder)
    select.innerHTML = '<option value="">-- Choose a Sport --</option>';

    // Clear custom dropdown options
    sportsDropdownRef._optionsList.innerHTML = '';
    sportsDropdownRef._trigger.textContent = '-- Choose a Sport --';

    // Reset gender
    const genderSelect = document.getElementById('genderSelect');
    genderSelect.value = '';
    if (genderDropdownRef) {
        genderDropdownRef._trigger.textContent = '-- Choose Gender --';
        genderDropdownRef._optionsList.querySelectorAll('.custom-dropdown-option').forEach(o => o.classList.remove('selected'));
    }
    document.getElementById('genderSelectorGroup').style.display = 'none';
    document.getElementById('sportsTableContainer').innerHTML = '<div class="placeholder">Select a sport to view standings</div>';

    // Filter sports by type
    const filtered = sports.filter(s => s.type === type);
    filtered.forEach(sport => {
        const option = document.createElement('option');
        option.value = sport.id;
        option.textContent = sport.name;
        select.appendChild(option);
        addDropdownOption(sportsDropdownRef, sport.id, sport.name);
    });

    // Show sport selector
    document.getElementById('sportSelectorGroup').style.display = 'flex';
}

function updateGenderForSport(sport) {
    const genderSelect = document.getElementById('genderSelect');
    const genderSelectorGroup = document.getElementById('genderSelectorGroup');

    if (!sport || !sport.genders) return;

    const genders = sport.genders;

    // If only one gender (including neutral), auto-select it and hide gender dropdown
    if (genders.length === 1) {
        genderSelectorGroup.style.display = 'none';
        genderSelect.value = genders[0];
        displaySportStandings(sport.id, genders[0]);
        return;
    }

    // Multiple genders — show gender dropdown with only relevant options
    genderSelectorGroup.style.display = 'flex';

    // Reset gender
    genderSelect.value = '';
    if (genderDropdownRef) {
        genderDropdownRef._trigger.textContent = '-- Choose Gender --';
        genderDropdownRef._optionsList.innerHTML = '';

        const genderLabels = { male: 'Male', female: 'Female', mixed: 'Mixed', neutral: 'Neutral/N/A' };
        genders.forEach(g => {
            addDropdownOption(genderDropdownRef, g, genderLabels[g] || g);
        });
    }

    document.getElementById('sportsTableContainer').innerHTML = '<div class="placeholder">Please select gender to view standings</div>';
}

function populateCultureDropdown() {
    const select = document.getElementById('cultureEventSelect');
    const dropdown = buildCustomDropdown(select, '-- Choose a Culture Event --');

    cultureEvents.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = event.name;
        select.appendChild(option);

        addDropdownOption(dropdown, event.id, event.name);
    });
}

function buildGenderDropdown() {
    const select = document.getElementById('genderSelect');
    genderDropdownRef = buildCustomDropdown(select, '-- Choose Gender --');

    // Initially populate with all genders (will be dynamically updated per sport)
    const genderLabels = { male: 'Male', female: 'Female', mixed: 'Mixed', neutral: 'Neutral/N/A' };
    Array.from(select.options).forEach(opt => {
        if (opt.value) {
            addDropdownOption(genderDropdownRef, opt.value, genderLabels[opt.value] || opt.textContent);
        }
    });
}

function setupEventListeners() {
    // Type of Sport selection
    document.getElementById('sportTypeSelect').addEventListener('change', function () {
        const type = this.value;
        if (type) {
            populateSportsForType(type);
        } else {
            document.getElementById('sportSelectorGroup').style.display = 'none';
            document.getElementById('genderSelectorGroup').style.display = 'none';
            document.getElementById('sportsTableContainer').innerHTML = '<div class="placeholder">Select a type and sport to view standings</div>';
        }
    });

    // Sport selection
    document.getElementById('sportsEventSelect').addEventListener('change', function () {
        const sportId = parseInt(this.value);
        const sport = sports.find(s => s.id === sportId);
        if (!sport) return;
        updateGenderForSport(sport);
    });

    // Gender selection
    document.getElementById('genderSelect').addEventListener('change', function () {
        const sportId = parseInt(document.getElementById('sportsEventSelect').value);
        const genderValue = this.value;
        if (sportId && genderValue) {
            displaySportStandings(sportId, genderValue);
        }
    });

    document.getElementById('cultureEventSelect').addEventListener('change', function () {
        const eventId = parseInt(this.value);
        if (eventId) {
            displayCultureStandings(eventId);
        } else {
            document.getElementById('cultureTableContainer').innerHTML = '<div class="placeholder">Select a culture event to view standings</div>';
        }
    });
}

function displaySportStandings(sportId, gender) {
    const sport = sports.find(s => s.id === sportId);
    if (!sport) return;

    const container = document.getElementById('sportsTableContainer');
    container.innerHTML = '';

    // Calculate dynamic standings for specifically this gender
    const standings = [];
    clubs.forEach(club => {
        let genderPoints = 0;
        club.sportBreakdown.forEach(s => {
            if (s.sport === sport.name && s.gender === gender) genderPoints += s.points;
        });
        standings.push({
            club: club.name,
            points: genderPoints,
            color: club.color
        });
    });

    standings.sort((a, b) => b.points - a.points);

    if (standings.length === 0) {
        container.innerHTML = '<div class="placeholder">No data available for selected criteria</div>';
        return;
    }

    const genderLabel = gender.charAt(0).toUpperCase() + gender.slice(1);
    const title = document.createElement('h3');
    title.textContent = `${sport.name} - ${genderLabel} - Standings`;
    container.appendChild(title);

    const table = document.createElement('table');
    table.className = 'leaderboard-table';

    let html = `
        <thead>
            <tr>
                <th>Rank</th>
                <th colspan="2">Club</th>
                <th>Total Points</th>
            </tr>
        </thead>
        <tbody>
    `;

    standings.forEach((standing, index) => {
        html += `
            <tr>
                <td class="rank">${index + 1}</td>
                <td class="club-capsule-cell"><div class="club-capsule" style="background: ${getClubGradient(standing.club, standing.color)};"></div></td>
                <td class="club-name-cell">${standing.club}</td>
                <td class="points">${standing.points}</td>
            </tr>
        `;
    });

    html += '</tbody>';
    table.innerHTML = html;
    container.appendChild(table);
}

function displayCultureStandings(eventId) {
    const event = cultureEvents.find(e => e.id === eventId);
    if (!event) return;

    const container = document.getElementById('cultureTableContainer');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'leaderboard-table';

    let html = `
        <thead>
            <tr>
                <th>Rank</th>
                <th colspan="2">Club</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
    `;

    const standings = [];
    clubs.forEach(club => {
        let eventPoints = 0;
        club.cultureBreakdown.forEach(c => {
            if (c.event === event.name) {
                eventPoints += c.points;
            }
        });
        standings.push({
            club: club.name,
            points: eventPoints,
            color: club.color
        });
    });

    standings.sort((a, b) => b.points - a.points);

    standings.forEach((standing, index) => {
        html += `
            <tr>
                <td class="rank">${index + 1}</td>
                <td class="club-capsule-cell"><div class="club-capsule" style="background: ${getClubGradient(standing.club, standing.color)};"></div></td>
                <td class="club-name-cell">${standing.club}</td>
                <td class="points">${standing.points}</td>
            </tr>
        `;
    });

    html += '</tbody>';
    table.innerHTML = html;
    container.appendChild(table);
}
