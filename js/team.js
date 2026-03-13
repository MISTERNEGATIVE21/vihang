document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('https://vihang-woya.onrender.com/api/images/teampage');
        if (!response.ok) throw new Error('Failed to fetch team data');
        const teamData = await response.json();
        renderTeamData(teamData);
    } catch (error) {
        console.error('Error fetching team data:', error);
        document.getElementById('dynamicTeamContainer').innerHTML = '<p>Could not load team data at this time.</p>';
    }
});

function renderTeamData(teamData) {
    const container = document.getElementById('dynamicTeamContainer');
    if (!container) return;

    // Group members by category
    const grouped = {};
    const categoryOrder = []; // Preserve First Encounter Order
    
    // Some specific custom styling based on category
    // "PG Sports & Cultural Secretary" gets featured style
    const featuredCategories = ['PG Sports & Cultural Secretary', 'PG Academic Affairs'];

    teamData.forEach(member => {
        const cat = member.category;
        if (!grouped[cat]) {
            grouped[cat] = [];
            categoryOrder.push(cat);
        }
        grouped[cat].push(member);
    });

    let htmlContent = '';

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
                            <p class="team-member-role">${category}</p>
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
