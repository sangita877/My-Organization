
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

// Helper function to parse CSV text into objects properly handling quotes
function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    if (lines.length === 0 || !lines[0]) return [];
    
    // Process headers
    const headers = parseCSVLine(lines[0]);
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = parseCSVLine(lines[i]);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index] ? values[index].trim() : "";
        });
        result.push(obj);
    }
    return result;
}

function parseCSVLine(line) {
    const arr = [];
    let quote = false;
    let element = "";
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char === '"') {
            quote = !quote;
        } else if (char === ',' && !quote) {
            arr.push(element);
            element = "";
        } else {
            element += char;
        }
    }
    arr.push(element);
    // strip out outer quotes from values if present
    return arr.map(val => val.replace(/^"|"$/g, ''));
}

// Data fetching helper
async function loadTab(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch from url: ${url}`);
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
    const statusDiv = document.getElementById("status");
    try {
        // Load all data dynamically
        people = await loadTab(PEOPLE_CSV_URL);
        groups = await loadTab(GROUPS_CSV_URL);
        memberships = await loadTab(MEMBERSHIPS_CSV_URL);
        posts = await loadTab(POSTS_CSV_URL);

        statusDiv.classList.add("hidden");
        
        // Render control panel selectors
        buildMenuPickers();
    } catch (error) {
        console.error("Dashboard loading error: ", error);
        statusDiv.textContent = "Error loading data. Please verify network connectivity or sheet permissions.";
        statusDiv.classList.add("error");
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
            setActiveButton(e.target);
            renderRosterAndBoard(g.group_id);
        });
        groupPicker.appendChild(btn);
    });

    // Leaders Buttons (Filter out only people who are leaders)
    const leadersList = people.filter(p => p.role === "leader");
    leadersList.forEach(l => {
        const btn = document.createElement("button");
        btn.textContent = l.full_name;
        btn.addEventListener("click", (e) => {
            setActiveButton(e.target);
            renderLeaderChannel(l.person_id);
        });
        leaderPicker.appendChild(btn);
    });

    // Members/Persons Buttons for History View
    people.forEach(p => {
        const btn = document.createElement("button");
        btn.textContent = `${p.full_name} (${p.role})`;
        btn.addEventListener("click", (e) => {
            setActiveButton(e.target);
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
            <h3 class="view-title">Roster for ${group.group_name} (${group.period})</h3>
            <div class="leader-box">
                <strong> Leader:</strong> ${leaderName}
            </div>
            <h4>Members</h4>
            ${memberNames.length === 0 ? '<p>No members registered in this group.</p>' : `
                <ul class="member-list">
                    ${memberNames.map(name => `<li> ${name}</li>`).join('')}
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
                                <span class="post-author"> ${author ? author.full_name : 'System'}</span>
                                <span class="post-date"> ${post.date}</span>
                            </div>
                            <div class="post-body">${post.text}</div>
                            ${getAttachmentHTML(post.attachment_label || post.attachment_label__1)}
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
            <h3 class="view-title"> Leader Channel: ${leader.full_name}</h3>
            <p style="color: #7f8c8d; font-style: italic; margin-bottom: 1.5rem;">Showing a continuous feed of all channel posts distributed to current and past students.</p>
            ${leaderPosts.length === 0 ? '<p class="placeholder-text">No channel alerts broadcasted yet.</p>' : 
                leaderPosts.map(post => `
                    <div class="post-card">
                        <div class="post-header">
                            <span class="post-author"> ${leader.full_name}</span>
                            <span class="post-date"> ${post.date}</span>
                        </div>
                        <div class="post-body">${post.text}</div>
                        ${getAttachmentHTML(post.attachment_label || post.attachment_label__1)}
                    </div>
                `).join('')
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
    relatedGroups.sort((a, b) => a.period.localeCompare(b.period));

    // Part B: Distill historical distinct leaders
    const leaderIds = new Set(relatedGroups.map(g => g.leader_id));
    const activeLeaders = Array.from(leaderIds).map(id => findPerson(id)).filter(l => l !== undefined);

    content.innerHTML = `
        <h2 class="view-title"> Engagement History: ${person.full_name} (${person.role})</h2>
        <div class="history-grid">
            <div class="history-section">
                <h3>Enrolled Cohorts / Groups</h3>
                ${relatedGroups.length === 0 ? '<p>No historical groups recorded.</p>' : `
                    <ul class="member-list">
                        ${relatedGroups.map(g => `<li><strong>${g.period}</strong>: ${g.group_name}</li>`).join('')}
                    </ul>
                `}
            </div>
            <div class="history-section">
                <h4> Accessible Leader Channels</h4>
                <p style="font-size: 0.85rem; color: #7f8c8d; margin-bottom: 1rem;">Based on historical group membership records, permissions to these feeds persist continuously.</p>
                ${activeLeaders.length === 0 ? '<p>No permanent leader channels available.</p>' : `
                    <ul class="member-list">
                        ${activeLeaders.map(l => `<li> Channel: <strong>${l.full_name}</strong></li>`).join('')}
                    </ul>
                `}
            </div>
        </div>
    `;
}

// Initialize application on layout loading
document.addEventListener("DOMContentLoaded", initDashboard);
