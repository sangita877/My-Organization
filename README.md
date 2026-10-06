Organizational Portal
Project Overview

This project is a data-driven organizational portal built with HTML, CSS, and JavaScript.

The application loads organizational information from four CSV data sources connected to Google Sheets. The data is loaded into JavaScript, stored in arrays, filtered and matched using IDs, and then displayed through different views.

The main purpose of the portal is to allow users to view:

Group rosters and group message boards
Leader channels
Individual engagement history
Historical leader channels based on group membership
Main Features
1. Group Board

The Group Board displays information about a selected group.

It shows:

Group name
Group period
Group leader
Group members
Group posts
Post author
Post date
Attachment information

Groups are created dynamically from the loaded data rather than being hard-coded.

2. Leader Channel

The Leader Channel displays posts belonging to a selected leader.

Each post shows:

Actual post author
Post date
Post text
Attachment information

The channel uses the author_id from the post data to identify the person who actually created the post.

3. Engagement History

The Engagement History view shows a person's historical involvement in groups.

It displays:

Enrolled cohorts/groups
Group periods
Historical leaders
Accessible leader channels

Leader names shown in the history view can be selected to open the corresponding Leader Channel.

Data Sources

The application uses four CSV data sources from Google Sheets:

People
Groups
Memberships
Posts

The JavaScript defines these four CSV links at the beginning of app.js.

const PEOPLE_CSV_URL = "...";
const GROUPS_CSV_URL = "...";
const MEMBERSHIPS_CSV_URL = "...";
const POSTS_CSV_URL = "...";

The CSV data is loaded when the application starts.

Data Structure

The application stores the loaded information in four global arrays:

let people = [];
let groups = [];
let memberships = [];
let posts = [];

The arrays represent:

People

Contains information about people, such as:

person_id
full_name
role
Groups

Contains information about groups, such as:

group_id
group_name
period
leader_id
Memberships

Connects people with groups:

person_id
group_id
Posts

Contains messages for group and leader boards:

post_id
board_type
board_id
author_id
date
text
attachment_label
How the Application Works

The application follows a simple:

Load → Store → Filter/Match → Display

process.

Google Sheets
     ↓
CSV URLs
     ↓
loadTab()
     ↓
parseCSV()
     ↓
JavaScript arrays
     ↓
find/filter/sort data
     ↓
Build menus
     ↓
Render views
Step 1: Load

The loadTab() function uses fetch() to request each CSV file.

async function loadTab(url) {
    const response = await fetch(url);
    const text = await response.text();
    return parseCSV(text);
}
Step 2: Parse

The parseCSV() function converts CSV text into JavaScript objects.

It also handles quoted CSV values, commas inside quoted values, quotation marks, and line breaks inside quoted cells.

Step 3: Store

The resulting objects are stored in:

people
groups
memberships
posts
Step 4: Match Data

The application uses IDs to connect related records.

For example:

findPerson(post.author_id)

finds the person who created a particular post.

Similarly:

findGroup(m.group_id)

finds the group connected to a membership record.

Step 5: Display

The application builds the menus dynamically from the loaded data.

Users can select:

A group
A leader
A person

The selected information is then rendered into the main content area.

Security

The application includes an escapeHTML() function to make text loaded from the Google Sheets safe before inserting it into innerHTML.

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

This prevents text from the data source from being interpreted as HTML.

Error Handling

The application displays a loading message while the data is being retrieved.

If a CSV cannot be loaded, the application displays an error message asking the user to check the CSV links.

It also checks whether any of the four data sheets are empty.

Design Decisions
Data-driven menus

The menus are generated from the loaded data instead of hard-coding group names, leader names, or person names.

For example, the Group menu uses:

groups.forEach(g => {
    // create group button
});

This means that when the data changes, the menu can update automatically.

ID-based relationships

The application uses IDs to connect the four datasets.

For example:

person_id
     ↓
memberships
     ↓
group_id
     ↓
groups
     ↓
leader_id
     ↓
person_id

This allows the application to find the correct person, group, leader, and post without duplicating the same information in multiple places.

How to Run the Project
Option 1: VS Code Live Server
Open the project folder in VS Code.
Make sure these files are in the project:
index.html
styles.css
app.js
README.md
Open index.html.
Use Live Server to run the website.
Open the local website in the browser.
Option 2: GitHub Pages

The project can also be published using GitHub Pages.


Live Website:
[https://github.com/sangita877/My-Organization]

Project Files
project-folder/
│
├── index.html
├── styles.css
├── app.js
└── README.md

index.html
Contains the structure and layout of the website.

styles.css
Contains the visual design and responsive styling.


app.js

Contains:

CSV loading
CSV parsing
Data storage
Data matching
Dynamic menus
Group Board
Leader Channel
Engagement History
Error handling
HTML escaping

READ.md
Contains project information, data structure, setup instructions, and documentation.


Technologies Used
HTML5
CSS3
JavaScript
Google Sheets
CSV
GitHub Pages
VS Code
Live Server


Project Purpose

The project demonstrates how a JavaScript application can retrieve structured data from CSV sources, store that data in memory, connect related records using IDs, and dynamically display information through an organizational portal.