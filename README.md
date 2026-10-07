My Organization Portal
Project Overview

My Organization Portal is a read-only web application that displays organization information from one Google Sheet.

The application loads data from four CSV links and uses JavaScript to display:

People and their roles
Organization groups and cohorts
Group memberships
Group posts and history

The project is built using HTML, CSS, and JavaScript and is hosted using GitHub Pages.

Live site:

[https://github.com/sangita877/My-Organization]

Main Features
1. Group Roster

Users can select a group and view the people who belong to that group.

The application uses membership records to connect people with their groups.

2. Group Board

Users can select a group to view posts and information related to that group.

Posts are filtered using the group ID.

3. Leader Channels

Users can select a leader and view all posts published on that leader's channel.

The Leader Channel is matched using the leader's person_id and the post's board_id. The author_id identifies the person who actually wrote each post. Therefore, the channel can contain posts written by different people, not only posts written by the leader.

Leader access is based on the historical membership records stored in the data.

4. Person History

Users can select a person and view their historical group membership and related posts.

The history view uses membership records to determine which groups a person has belonged to.

5. Dynamic Menu

The menus are created from the data loaded from the Google Sheet.

Group names, periods, leaders, and people are not hardcoded into the HTML or JavaScript.

For example, group buttons are created using:

btn.textContent = `${g.group_name} (${g.period})`;

This means that if new groups are added to the spreadsheet, they can appear automatically without changing the JavaScript code.

Technologies Used
HTML5
CSS3
JavaScript
Google Sheets
CSV
GitHub
GitHub Pages
Project Files

The project contains four main files:

capstone-1-Project-work/
│
├── index.html
├── styles.css
├── app.js
└── README.md
index.html

Contains the structure and content of the web page.

It includes:

Header
Control panels
Group picker
Leader picker
Person picker
Main content area
Footer
styles.css

Contains the styling for the website.

It controls:

Layout
Colors
Typography
Buttons
Cards
Navigation
Responsive design
Active buttons
Header and footer
app.js

Contains the main application logic.

It:

Loads CSV data
Parses CSV data
Stores data in JavaScript arrays
Builds the menu buttons
Finds people and groups
Filters records
Renders the different views
Handles user interaction
README.md

Contains the project documentation, setup information, design decisions, and instructions for using another Google Sheet.

Data Source

The application uses one Google Sheet with four tabs:

People
Groups
Memberships
Posts

The four tabs are exported as CSV files and loaded into the application.

The four CSV links are stored as constants at the top of app.js.

The data is stored in JavaScript arrays:

let people = [];
let groups = [];
let memberships = [];
let posts = [];
Expected Records
People
person_id
full_name
role
Groups
group_id
group_name
period
leader_id
Memberships
person_id
group_id
Posts
post_id
board_type
board_id
author_id
date
text
attachment_label
Loading the Data

The application uses four constants at the top of app.js for the four CSV links.

The data is loaded using the loadTab() function.

async function loadTab(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status}`);
    }

    const text = await response.text();
    return parseCSV(text);
}

The response.ok check helps detect HTTP errors before the application tries to process the returned data.

CSV Parsing

The parseCSV() function converts CSV text into JavaScript objects.

The process is:

Google Sheet
     ↓
CSV link
     ↓
fetch()
     ↓
loadTab()
     ↓
parseCSV()
     ↓
JavaScript objects
     ↓
Arrays
     ↓
Filter / Match / Sort
     ↓
Render to HTML

Each CSV row becomes an object with property names taken from the CSV headers.

For example:

{
    person_id: "P001",
    full_name: "David",
    role: "leader"
}
JavaScript Data Arrays

After the CSV files are loaded, the records are stored in four arrays:

people = [];
groups = [];
memberships = [];
posts = [];

These arrays are stored in JavaScript memory while the application is running.

They are then used to find relationships between people, groups, memberships, and posts.

For example:

function findPerson(id) {
    return people.find(p => p.person_id === id);
}

and:

function findGroup(id) {
    return groups.find(g => g.group_id === id);
}
Rendering

The application uses rendering functions to put the data onto the webpage.

Examples include:

renderRosterAndBoard(groupId);
renderLeaderChannel(personId);
renderHistoryView(personId);

The data remains in JavaScript arrays, while the rendering functions create or update the HTML shown on the screen.

Dynamic Menus

The menus are created from the loaded data rather than being hardcoded.

For example, groups are generated from the groups array:

groups.forEach(g => {
    const btn = document.createElement("button");

    btn.textContent = `${g.group_name} (${g.period})`;

    btn.addEventListener("click", (e) => {
        setActiveButton(e.currentTarget);
        renderRosterAndBoard(g.group_id);
    });

    groupPicker.appendChild(btn);
});

The visible button text uses the group name and period, while the actual group_id is used internally by the application.

This follows the no-hardcoding rule.

Active Button

The setActiveButton() function controls which menu button appears selected.

function setActiveButton(targetButton) {
    document.querySelectorAll(".control-panel button")
        .forEach(btn => btn.classList.remove("active"));

    targetButton.classList.add("active");
}

This clears the active state from all control-panel buttons before adding the active class to the selected button.

This allows the interface to show the user's current selection clearly.

Using Another Google Sheet

The application can be connected to another Google Sheet without changing the main application logic.

The four CSV links are the four constants at the top of app.js.

To use another Google Sheet:

Create one Google Sheet with the same four tab names:
People
Groups
Memberships
Posts
Use the same column names required by the application.
Set the Google Sheet sharing permission to:
Anyone with the link – Viewer
Replace the sheet ID in all four CSV links.

The sheet ID is the long code that appears after /d/ in the Google Sheet URL.

For example:

https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit

Replace the existing sheet ID with the new sheet ID in all four constants at the top of app.js.

Nothing else in the application code needs to change.

This demonstrates the no-hardcoding rule because the application uses the data from the spreadsheet rather than hardcoding specific groups, people, or records into the program.

No-Hardcoding Rule

The application does not hardcode specific group IDs, people, or group names.

For example, the code does not contain something like:

renderRosterAndBoard("G2023A");

Instead, it gets the ID from the loaded data:

renderRosterAndBoard(g.group_id);

This makes the application reusable when the data changes.

Design Note
Design Goal

The main design goal of this project was to create a simple, reusable, read-only organization portal that can display information from one Google Sheet without hardcoding the organization's data into the JavaScript.

The interface is designed so that users can select a group, leader, or person and then view the relevant information.

Data Design

The application separates the information into four related data sets:

People
   ↓
Memberships
   ↓
Groups
   ↓
Posts

The People data identifies individuals.

The Groups data identifies organization groups and their leaders.

The Memberships data connects people to groups.

The Posts data contains messages connected to groups or leader channels.

Using separate data sets makes it possible to connect records using IDs rather than duplicating the same information in multiple places.

Why IDs Are Used

IDs are used to connect records between the four data sets.

For example:

person_id → identifies a person
group_id  → identifies a group
leader_id → connects a group to its leader

The application uses these IDs to find matching records.

This is more flexible than using names as the main connection between records.

User Interface Design

The interface provides three main selection areas:

Groups
Leaders
People

Each selection is created dynamically from the loaded data.

The selected button receives an active class so users can easily see which option they have selected.

The main content area then changes depending on the user's selection.

Group View

The group view combines roster and board information.

When a user selects a group:

Group selected
      ↓
Get group_id
      ↓
Find matching memberships
      ↓
Find matching people
      ↓
Find matching posts
      ↓
Display roster and board
Leader View

When a user selects a leader, the application uses the leader's person_id and matches it with the board_id of posts belonging to that leader's channel.

The Leader Channel displays all posts associated with that leader's channel, regardless of who wrote the post.

The author_id is used separately to identify the actual author of each post.

This allows the channel to contain posts written by different people while still belonging to the selected leader's channel.

History View

The history view uses membership records to determine the groups associated with a person.

This allows historical information to remain available even when the person is no longer part of a current group.

The design therefore treats membership as historical data rather than only current enrollment.

Sorting and Dates

Posts and historical records are sorted using their date information.

The data should use a consistent date format so that sorting produces reliable results.

Read-Only Architecture

This project is intentionally read-only.

The application follows this flow:

Google Sheet
     ↓
CSV
     ↓
JavaScript
     ↓
Webpage

It does not write information back to the Google Sheet.

Users can view the information through the website, but the application does not modify the original spreadsheet.

Reusability

One of the main design decisions was to keep the application independent from specific organization data.

The code uses the four CSV constants at the top of app.js.

Therefore, another organization can use the same application by providing a spreadsheet with:

The same four tab names
The same column names
The correct data structure
Appropriate sharing permissions

Only the sheet ID in the four links needs to be changed.

Accessibility and Usability

The interface uses clear labels and buttons so users can understand the available views.

The active button state provides visual feedback after a selection.

The layout separates navigation controls from the main content so users can easily understand:

What can I select?
        ↓
What did I select?
        ↓
What information is displayed?
Error Handling

The application checks whether the CSV request was successful.

For example:

const response = await fetch(url);

if (!response.ok) {
    throw new Error(`Failed to load data: ${response.status}`);
}

If there is a problem loading the data, the application can display an error message rather than continuing with incomplete data.

How to Run the Project
GitHub Pages

The project is designed to run as a static website using GitHub Pages.

Local Development

Open the project in Visual Studio Code and use Live Server to run the project.

The project should be opened through a local server rather than directly from a file:// URL because the application uses fetch() to load CSV data.

For example:

http://127.0.0.1:5500/
GitHub Pages Deployment

The project is hosted using GitHub Pages.

The main files are stored in the repository root:

index.html
styles.css
app.js
README.md

GitHub Pages uses index.html as the main webpage.

Known Development Note

When running the project with Live Server, the browser may show:

favicon.ico: Failed to load resource: the server responded with a status of 404

This means the browser requested a favicon but no favicon.ico file exists.

It does not mean that the main JavaScript application has failed.

A favicon can be added later if required.

Project Purpose

The purpose of this project is to demonstrate how a web application can:

Load external CSV data
Parse CSV data
Store data in JavaScript arrays
Connect related records using IDs
Dynamically create interface elements
Filter and display data
Provide historical information
Follow a no-hardcoding approach
Deploy a read-only application using GitHub Pages
Conclusion

My Organization Portal demonstrates a simple data-driven web application using HTML, CSS, and JavaScript.

The project separates data from application logic by keeping organization information in one Google Sheet and using JavaScript to load and display that information.

The use of dynamic menus, IDs, filtering, rendering, and reusable CSV links makes the application flexible and suitable for different sets of organization data.