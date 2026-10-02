Organization Portal – Capstone 1
Project Description

This project is an organization portal built using HTML, CSS, and JavaScript.

The website reads organization data from Google Sheets through CSV URLs and displays the information in different views.

The main purpose of this project is to provide an easy way to view:

People and their roles
Groups and group leaders
Group members
Group posts and history
Individual people's history

project-folder/

index.html
styles.css
app.js
README.md

index.html

Contains the structure of the website, including:

Header
Navigation/menu
Control panel
Main content area
Different views/panels
Footer


styles.css
Contains the styling of the website, including:

Layout
Colors
Buttons
Navigation
Control panel
Cards
Tables
Responsive design


app.js
Contains the main JavaScript functionality.

It:
Stores the data in arrays.
Downloads CSV data from Google Sheets.
Parses the CSV data.
Loads all four datasets.
Builds the group and people menus.
Handles button clicks.
Renders different views.
Displays people, groups, memberships, and posts.

Data Sources
The project uses four Google Sheets.


How the JavaScript Works
The application follows this general process:

Google Sheets
      ↓
CSV URLs
      ↓
loadTab()
      ↓
parseCSV()
      ↓
people[]
groups[]
memberships[]
posts[]
      ↓
Render Functions
      ↓
Website Views

Global Data Arrays

The application uses four arrays:

let people = [];
let groups = [];
let memberships = [];
let posts = [];
These arrays hold the data after it is downloaded and parsed.



Running the Project
Option 1: VS Code Live Server
Open the project folder in Visual Studio Code.
Install the Live Server extension.
Open index.html.
Right-click the file.
Select Open with Live Server.
The website will open in the browser.
Option 2: GitHub Pages
The project can also be published using GitHub Pages.


The main files should be uploaded to a GitHub repository:
index.html
styles.css
app.js
README.md

Then GitHub Pages can be enabled from the repository settings.


Important Note
The website uses fetch() to download data from Google Sheets.
Therefore, the project should be run through a web server such as Live Server or GitHub Pages, rather than opening index.html directly with a file:// URL.



