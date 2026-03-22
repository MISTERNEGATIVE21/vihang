let fullTeamData = [];
let activeTeamTab = 'profs';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('https://vihang-woya.onrender.com/api/images/teampage');
        if (!response.ok) throw new Error('Failed to fetch team data');
        fullTeamData = await response.json();
        
        setupTeamTabs();
        renderTeamData();
    } catch (error) {
        console.error('Error fetching team data:', error);
        document.getElementById('dynamicTeamContainer').innerHTML = '<p>Could not load team data at this time.</p>';
    }
});

function setupTeamTabs() {
    const tabBtns = document.querySelectorAll('.team-page-section .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTeamTab = btn.getAttribute('data-tab');
            renderTeamData();
        });
    });
}

function renderTeamData() {
    const container = document.getElementById('dynamicTeamContainer');
    if (!container) return;

    // Define the categories that belong in the Faculty/Profs tab
    const profCategories = [
        'Director VNIT', 'Director Vnit',
        'Dean', 'Professors In-Charge', 'Associate Dean',
        'Sports Officer'
    ];

    // Filter data based on active tab
    const filteredData = fullTeamData.filter(member => {
        const isProfTabItem = profCategories.includes(member.category);
        if (activeTeamTab === 'profs') {
            return isProfTabItem;
        } else {
            return !isProfTabItem;
        }
    });

    // Group members by category
    const grouped = {};
    const categoryOrder = []; // Preserve First Encounter Order
    
    // Some specific custom styling based on category
    // "PG Sports & Cultural Secretary" gets featured style
    const featuredCategories = ['PG Sports & Cultural Secretary', 'PG Academic Affairs', ...profCategories];

    filteredData.forEach(member => {
        const cat = member.category;
        if (!grouped[cat]) {
            grouped[cat] = [];
            categoryOrder.push(cat);
        }
        grouped[cat].push(member);
    });

    // Ensure logical rank order in the Faculty tab
    categoryOrder.sort((a, b) => {
        let indexA = profCategories.indexOf(a);
        let indexB = profCategories.indexOf(b);
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        
        // If both are found in rank list, sort by rank. Otherwise maintain original order
        if (indexA !== 999 || indexB !== 999) return indexA - indexB;
        return 0;
    });

    let htmlContent = '';

    if (filteredData.length === 0) {
        htmlContent = '<p style="text-align:center; color:#666; width: 100%;">No team members found for this section.</p>';
    }

    categoryOrder.forEach(category => {
        const members = grouped[category];
        
        let rowClass = 'team-row-3';
        if (members.length === 1 || featuredCategories.includes(category)) rowClass = 'team-row-1';
        else if (members.length === 2) rowClass = 'team-row-2';
        else if (members.length >= 4) rowClass = 'team-row-4';

        htmlContent += `
            <div class="team-category">
                <h2 class="team-category-title">${category}</h2>
                <div class="team-row ${rowClass}">
        `;

        members.forEach(member => {
            const isFeatured = featuredCategories.includes(category);
            const cardClass = isFeatured ? 'team-member-card team-member-featured' : 'team-member-card';
            const imgWrapClass = isFeatured ? 'team-member-img-wrap featured-img' : 'team-member-img-wrap';

            htmlContent += `
                    <div class="${cardClass}">
                        <div class="${imgWrapClass}">
                            <img src="${member.image_url}" alt="${member.Name}" class="team-member-img">
                        </div>
                        <div class="team-member-details">
                            <h3 class="team-member-name">${member.Name}</h3>
                            <p class="team-member-role">${category === 'Professors In-Charge' ? '' : category}</p>
                            ${member.sub_cat ? `<p class="team-member-subrole" style="font-size: 0.9em; color: #ff6b6b; opacity: 0.8; margin-top: 5px;">${member.sub_cat}</p>` : ''}
                        </div>
                    </div>
            `;
        });

        htmlContent += `
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlContent;
}
