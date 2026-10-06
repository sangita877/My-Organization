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
[https://github.com/sangita877/My-Organization/tree/main]

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


Design Note

1. Project Purpose

The purpose of this project is to create a data-driven organizational portal using HTML, CSS, and JavaScript. The application retrieves organizational information from four CSV data sources connected to Google Sheets and displays the information through different views.

The main views are:

Group Board
Leader Channel
Engagement History

The application is designed so that the menus and displayed information are generated from the data rather than being hard-coded.

2. Data Sources

The application uses four CSV data sources:

People
Groups
Memberships
Posts

Each dataset has a different purpose.

The People data contains information about people, including their ID, name, and role.

The Groups data contains group information such as group ID, group name, period, and leader ID.

The Memberships data connects people with groups using person_id and group_id.

The Posts data contains messages and uses board_id and author_id to connect posts with groups, leader channels, and authors.

3. Data Flow

The main design of the application follows this process:

Google Sheets
      ↓
CSV URLs
      ↓
loadTab()
      ↓
parseCSV()
      ↓
JavaScript Arrays
      ↓
Find / Filter / Sort
      ↓
Build Menus
      ↓
Render Views
Load

When the application starts, initDashboard() loads the four CSV files.

The loadTab() function uses fetch() to request the CSV data.

Store

After the CSV data is loaded and parsed, it is stored in four JavaScript arrays:

let people = [];
let groups = [];
let memberships = [];
let posts = [];
Filter and Match

The application uses IDs to connect information between the four datasets.

For example:

findPerson(post.author_id)

finds the person who created a post.

Similarly:

findGroup(m.group_id)

finds the group associated with a membership.

The application also uses filter() and sort() to select and organize the required information.

Display

After the data has been matched and organized, JavaScript creates the menus and displays the selected information in the main content area.

4. JavaScript Data Structure

The application uses four main arrays.

People
people = [];

This stores people and their roles.

Example fields:

person_id
full_name
role

Groups
groups = [];

This stores group information.

Example fields:

group_id
group_name
period
leader_id

Memberships
memberships = [];

This connects people to groups.

Example fields:

person_id
group_id

Posts
posts = [];

This stores messages.

Example fields:

post_id
board_type
board_id
author_id
date
text
attachment_label

5. Relationship Between the Data

The application uses IDs instead of duplicating information.

For example:

Person
  person_id
      ↓
Membership
  person_id + group_id
      ↓
Group
  group_id + leader_id
      ↓
Leader
  person_id

Posts use author_id to identify the actual person who created the post.

This allows the application to find related information dynamically.

6. Main Views
Group Board

The Group Board uses the selected group_id to find:

The group
The group leader
Group members
Group posts

The posts are filtered using the group's ID and sorted by date.

Leader Channel

The Leader Channel uses the selected leader's person_id.

Posts belonging to that leader's channel are found using the appropriate board_id.

The actual author of each post is found using:

findPerson(post.author_id)

This means the leader of the channel does not automatically appear as the author of every post.

Engagement History

The Engagement History uses membership records to determine which groups a person has been involved with.

It also identifies leaders from historical groups and provides access to their leader channels.

Leader names in the History view are clickable and open the corresponding Leader Channel.

7. Design Decisions
Decision 1: Use ID-Based Relationships

I chose to connect the datasets using IDs such as person_id, group_id, and author_id.

This makes the application more flexible because the same person or group does not need to be repeated in multiple datasets.

For example, instead of storing the full author name inside every post, the post stores:

author_id

The application then finds the person's name from the People array.

Decision 2: Build Menus from Data

I chose to generate the menus from the loaded data instead of hard-coding names.

For example:

groups.forEach(g => {
    // create group button
});

This means that if a new group is added to the data source, the application can display it without changing the JavaScript code.

8. Security

The application uses an escapeHTML() function when displaying text from the CSV data.

This is important because data from the Google Sheets should be treated as data rather than executable HTML.

For example:

escapeHTML(post.text)

is used before displaying post text.

This helps prevent HTML entered into the data source from being interpreted as actual HTML.

9. Error Handling

The application checks whether the CSV files can be loaded.

If a CSV request fails, the application displays an error message instead of silently continuing.

The application also checks whether the required datasets contain data before building the menus.

This helps users understand when the data source is unavailable or empty.

10. Why This Design Works

The application separates the data from the presentation.

The Google Sheets provide the data, while JavaScript processes the data and HTML/CSS display it.

The basic structure is:

Data Source
     ↓
JavaScript Processing
     ↓
User Interface

This makes the application easier to update because changes to the data source do not require manually changing every name or group in the HTML.

11. Conclusion

This project demonstrates how JavaScript can load external CSV data, convert it into objects, store it in arrays, connect related records using IDs, and dynamically create an organizational portal.

The main design principle is:

Load → Store → Filter/Match → Display

This approach allows the portal to remain data-driven and flexible while providing Group Board, Leader Channel, and Engagement History views.