
// Four CSV Links
const PEOPLE_CSV_URL  = "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=People&headers=1";
const GROUPS_CSV_URL= "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=Groups&headers=1";
const  MEMBERSHIPS_CSV_URL = "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=Memberships&headers=1";
const POSTS_CSV_URL = "https://docs.google.com/spreadsheets/d/1V-VSeRAvUNCDR9eh7mYE5c4q6Q9DP5L8wu3OlWr3CFs/gviz/tq?tqx=out:csv&sheet=Posts&headers=1"; 

// BUILD GROUP MENU FROM LOADED DATa

// Global State Arrays
let people = [];
let groups = [];
let memberships = [];
let posts = [];

// Make text from the Google Sheet safe before using innerHTML

function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>"']/g, function(match) {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return entities[match];
    });
}


// Helper function to parse CSV text into objects properly handling quotes

function parseCSV(text) {
    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                // Two quotes inside a quoted value means one quote
                value += '"';
                i++;
            } else {
                // Start or end quoted value
                insideQuotes = !insideQuotes;
            }
        }

        else if (char === "," && !insideQuotes) {
            row.push(value.trim());
            value = "";
        }

        else if ((char === "\n" || char === "\r") && !insideQuotes) {
            if (char === "\r" && nextChar === "\n") {
                i++;
            }

            row.push(value.trim());
            rows.push(row);

            row = [];
            value = "";
        }

        else {
            value += char;
        }
    }

    // Add the last value
    if (value !== "" || row.length > 0) {
        row.push(value.trim());
        rows.push(row);
    }

    if (rows.length === 0) {
        return [];
    }

    const headers = rows[0];

    return rows.slice(1)
        .filter(row => row.some(value => value !== ""))
        .map(row => {
            const obj = {};

            headers.forEach((header, index) => {
                obj[header] = row[index] || "";
            });

            return obj;
        });
}

// Data fetching helper
async function loadTab(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.status}`);
    }

    const text = await response.text();

    return parseCSV(text);
}


// Core Finders
function findPerson(id) {
    return people.find(person => person.person_id === id);
}

function findGroup(id) {
    return groups.find(group => group.group_id === id);
}

// 3. Main Data Orchestrator
async function initDashboard() {
    const status = document.querySelector("#status");

    try {
        status.textContent = "Loading data...";

        people = await loadTab(PEOPLE_CSV_URL);
        groups = await loadTab(GROUPS_CSV_URL);
        memberships = await loadTab(MEMBERSHIPS_CSV_URL);
        posts = await loadTab(POSTS_CSV_URL);

        if (people.length === 0 ||
            groups.length === 0 ||
            memberships.length === 0 ||
            posts.length === 0) {

            status.textContent = "One or more data sheets are empty.";
            return;
        }

        buildMenuPickers();

        status.textContent = "Data loaded successfully.";

    } catch (error) {
        console.error(error);

        status.textContent = "Error loading data.";

        const mainContent = document.querySelector("#main-content");

        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-message">
                    <h2>Unable to load data</h2>
                    <p>Please check the CSV links and try again.</p>
                </div>
            `;
        }
    }
}


// 4. Build Control Interface Elements dynamically (No Hardcoding)
function buildMenuPickers() {
    const groupPicker = document.getElementById("group-picker");
    const leaderPicker = document.getElementById("leader-picker");
    const personPicker = document.getElementById("person-picker");

    // Clear old elements just in case
    groupPicker.innerHTML = "";
    leaderPicker.innerHTML = "";
    personPicker.innerHTML = "";

    // Group Buttons
    groups.forEach(g => {
        const btn = document.createElement("button");
        btn.textContent = `${g.group_name} (${g.period})`;
        btn.addEventListener("click", (e) => {
            setActiveButton(e.currentTarget);
            renderRosterAndBoard(g.group_id);
        });
        groupPicker.appendChild(btn);
    });

    // Leaders Buttons (Filter out only people who are leaders)
    const leadersList = people.filter(p => p.role === "leader");
    leadersList.forEach(l => {
        const btn = document.createElement("button");
        btn.textContent = l.full_name;
        btn.dataset.personId = l.person_id;
        btn.addEventListener("click", (e) => {
            setActiveButton(e.currentTarget);
            renderLeaderChannel(l.person_id);
        });
        leaderPicker.appendChild(btn);
    });

    // Members/Persons Buttons for History View
    people.forEach(p => {
        const btn = document.createElement("button");
        btn.textContent = `${p.full_name} (${p.role})`;
        btn.addEventListener("click", (e) => {
            setActiveButton(e.currentTarget);
            renderHistoryView(p.person_id);
        });
        personPicker.appendChild(btn);
    });
}

function setActiveButton(targetButton) {
    document.querySelectorAll(".control-panel button").forEach(btn => btn.classList.remove("active"));
    targetButton.classList.add("active");
}

// Helper to generate dynamic attachment elements
function getAttachmentHTML(label) {
    if (!label || label.trim() === "") return "";
    return `<div class="attachment-badge"> Attachment: <strong>${label}</strong></div>`;
}

// Roster & Group Board Integration
function renderRosterAndBoard(groupId) {
    const content = document.getElementById("content");
    const group = findGroup(groupId);
    if (!group) return;

    // Roster Resolution
    const leader = findPerson(group.leader_id);
    const leaderName = leader ? leader.full_name : "Unknown Leader";

    const groupMemberships = memberships.filter(m => m.group_id === groupId);
    const memberNames = groupMemberships.map(m => {
        const p = findPerson(m.person_id);
        return p ? p.full_name : "Unknown Member";
    });

    let rosterHTML = `
        <div class="roster-section">
            <h3 class="view-title">Roster for ${ escapeHTML(group.group_name)} (${escapeHTML(group.period)})</h3>
            <div class="leader-box">
                <strong> Leader:</strong> ${escapeHTML(leaderName)}
            </div>
            <h4>Members</h4>
            ${memberNames.length === 0 ? '<p>No members registered in this group.</p>' : `
                <ul class="member-list">
                    ${memberNames.map(name => `<li> ${escapeHTML(name)}</li>`).join('')}
                </ul>
            `}
        </div>
    `;

    // Group Board Filtering & Sorting
    const groupPosts = posts.filter(p => p.board_type === "group" && p.board_id === groupId);
    // Sort newest first
    groupPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    let boardHTML = `
        <div class="posts-section">
            <h3> Group Message Board</h3>
            ${groupPosts.length === 0 ? '<p class="placeholder-text">No posts yet on this board.</p>' : 
                groupPosts.map(post => {
                    const author = findPerson(post.author_id);
                    return `
                        <div class="post-card">
                            <div class="post-header">
                                <span class="post-author"> ${author ?escapeHTML (author.full_name) : 'System'}</span>
                                <span class="post-date"> ${escapeHTML(post.date)}</span>
                            </div>
                            <div class="post-body">${escapeHTML(post.text)}</div>
                            ${getAttachmentHTML(post.attachment_label)}
                        </div>
                    `;
                }).join('')
            }
        </div>
     `;

    content.innerHTML = rosterHTML + boardHTML;
}

// Leader Channel Implementation
function renderLeaderChannel(leaderId) {
    const content = document.getElementById("content");
    const leader = findPerson(leaderId);
    if (!leader) return;

    const leaderPosts = posts.filter(p => p.board_type === "leader" && p.board_id === leaderId);
    leaderPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    content.innerHTML = `
        <div class="posts-section">
            <h3 class="view-title"> Leader Channel: ${ escapeHTML(leader.full_name)}</h3>
            <p style="color: #7f8c8d; font-style: italic; margin-bottom: 1.5rem;">Showing a continuous feed of all channel posts distributed to current and past students.</p>
            ${leaderPosts.length === 0 ? '<p class="placeholder-text">No channel alerts broadcasted yet.</p>' : 
                leaderPosts.map(post => { const author = findPerson(post.author_id);

                        return `
                            <div class="post-card">
                             <div class="post-header">
                             <span class="post-author">
                               ${author ? escapeHTML(author.full_name) : "System"}
                                  </span>
                                   <span class="post-date">
                                        ${escapeHTML(post.date)}
                                    </span>

                                </div>

                                <div class="post-body">
                                    ${escapeHTML(post.text)}
                                </div>

                                ${getAttachmentHTML(post.attachment_label)}

                            </div>
                        `;

                    }).join('')
            }

        </div>
    `;
}
                    

// Comprehensive History Tracking
function renderHistoryView(personId) {
    const content = document.getElementById("content");
    const person = findPerson(personId);
    if (!person) return;

    // Part A: Every group the person has ever been in
    const personMemberships = memberships.filter(m => m.person_id === personId);
    const relatedGroups = personMemberships.map(m => findGroup(m.group_id)).filter(g => g !== undefined);
    
    // Sort chronologically by period
    relatedGroups.sort((a, b) => Number(a.period)- Number(b.period));

    // Part B: Distill historical distinct leaders
    const leaderIds = new Set(relatedGroups.map(g => g.leader_id));
    const activeLeaders = Array.from(leaderIds).map(id => findPerson(id)).filter(l => l !== undefined);

    content.innerHTML = `
    <h2 class="view-title">
        Engagement History: ${escapeHTML(person.full_name)} (${escapeHTML(person.role)})
    </h2>

    <div class="history-grid">

        <div class="history-section">
            <h3>Enrolled Cohorts / Groups</h3>

            ${
                relatedGroups.length === 0
                    ? '<p>No historical groups recorded.</p>'
                    : `
                        <ul class="member-list">
                            ${relatedGroups.map(g => `
                                <li>
                                    <strong>${escapeHTML(g.period)}</strong>:
                                    ${escapeHTML(g.group_name)}
                                </li>
                            `).join('')}
                        </ul>
                    `
            }
        </div>
         <div class="history-section">
            <h4>Accessible Leader Channels</h4>

            <p style="font-size: 0.85rem; color: #7f8c8d; margin-bottom: 1rem;">
                Based on historical group membership records, permissions to these feeds persist continuously.
            </p>

            ${
                activeLeaders.length === 0
                    ? '<p>No permanent leader channels available.</p>'
                    : `
                        <ul class="member-list">
                            ${activeLeaders.map(l => `
                                <li>
                                    Channel:
                                    <button
                                        type="button"
                                        class="leader-channel-button"
                                        data-leader-id="${escapeHTML(l.person_id)}">
                                        ${escapeHTML(l.full_name)}
                                    </button>
                                </li>
                            `).join('')}
                        </ul>
                    `
            }
        </div>

    </div>
`;
content.querySelectorAll(".leader-channel-button").forEach(button => {

    button.addEventListener("click", () => {

        const leaderId = button.dataset.leaderId;

        // Open the selected leader's channel
        renderLeaderChannel(leaderId);

        // Highlight the selected leader in the leader picker
        const leaderPicker = document.querySelector("#leader-picker");

        if (leaderPicker) {

            leaderPicker.querySelectorAll("button").forEach(btn => {
                btn.classList.remove("active");

                if (btn.dataset.personId === leaderId) {
                    btn.classList.add("active");
                }
            });

        }

    });

});
}
       
            


// Initialize application on layout loading
document.addEventListener("DOMContentLoaded", initDashboard);
