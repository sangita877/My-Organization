My Organization Portal

Live site:

[https://github.com/sangita877/My-Organization]

Project Description

My Organization Portal is a read-only web application that displays organization information from a Google Sheet. The application allows users to view groups, group members, group message boards, leader channels, and individual membership history.

The website loads data dynamically from a single Google Sheet and uses JavaScript to organize and display the information.

Main Features
View available groups and their periods.
View the leader and members of each group.
View posts on a group's message board.
View leader channels.
View historical group membership for each person.
View accessible leader channels based on a person's historical group membership.
Sort posts so the newest posts appear first.
Dynamically build the navigation buttons from the loaded data instead of hardcoding group or person names.
Data Source

The application uses one Google Sheet with four tabs:

People – stores person IDs, names, and roles.
Groups – stores group IDs, group names, periods, and leader IDs.
Memberships – connects people with the groups they belong to.
Posts – stores posts for group boards and leader channels.

The four CSV links are stored as constants at the top of app.js. To use another Google Sheet, keep the same four tab names and column names, then update the four CSV URL constants in app.js.

Main Files

The project has four main files:

index.html – provides the structure and layout of the website.
styles.css – contains the styling and visual design.
app.js – loads the Google Sheet data, processes it, and renders the different views.
README.md – explains the project, data source, features, and how the application works.
How the Application Works

When the page loads, app.js fetches the four CSV data sources from the Google Sheet. The CSV data is parsed into JavaScript objects and stored in four arrays:

people
groups
memberships
posts

The application then builds the navigation buttons from the loaded data.

When a user selects a group, the application displays its leader, members, and group posts.

When a user selects a leader, the application displays the posts belonging to that leader's channel.

When a user selects a person, the application displays that person's historical groups and the leader channels they can access based on their previous group memberships.

Security and Data Handling

The application uses escapeHTML() before displaying Google Sheet content through innerHTML. This helps prevent HTML from the data source from being interpreted as webpage markup.

The website is read-only. It retrieves data from the Google Sheet but does not write changes back to the spreadsheet.

Using Another Sheet

To use another Google Sheet:

Create the same four tabs:
People
Groups
Memberships
Posts
Use the same column names expected by the JavaScript.
Make the required data available as CSV.
Replace the four CSV URL constants at the top of app.js.
Reload the website.
GitHub Pages

The project is deployed using GitHub Pages. The live website can be opened using the Live site address at the top of this README.

Design Note
1. Overall Design

The project is designed as a read-only organizational portal that separates the data source from the presentation of the information. The Google Sheet stores the organization data, while JavaScript loads, processes, filters, and displays that data on the webpage.

The application uses four JavaScript arrays:

people
groups
memberships
posts

This makes it possible to connect information between the four Google Sheet tabs using IDs.

2. Dynamic Navigation

The navigation buttons are created dynamically from the loaded data. The application does not hardcode group IDs or person names.

For groups, the button displays the group name and period:

Group Name (Period)

The actual group_id is still used internally when the user selects a group.

The same approach is used for leaders and people. This means that if new records are added to the Google Sheet, they can appear in the application without manually creating new buttons in the HTML.

3. Group View

When a group is selected, the application shows:

The group name and period.
The group leader.
The members registered in that group.
The group's message board.

The roster is created by matching the group's leader_id with a person and matching membership records using group_id.

The Group Message Board displays posts where the post's board_type is "group" and its board_id matches the selected group's group_id.

Posts are sorted by date so that the newest posts appear first.

4. Leader Channel

The Leader Channel is designed as a continuous channel rather than a personal list of messages written by the leader.

When a leader is selected, the application finds posts where:

board_type is "leader"
board_id matches the selected leader's person_id

Therefore, the Leader Channel shows all posts on that leader's channel, matched by board_id, not only posts that were written by the leader.

The author of each post is displayed separately by matching the post's author_id with the people data.

This allows a channel to contain posts from different authors while still belonging to the selected leader's channel.

5. History View

The History View shows a person's previous participation in groups.

First, the application finds all membership records for the selected person. It then uses the group_id from those records to find the related groups.

The groups are sorted chronologically by their period.

The application also collects the leaders of those historical groups. These leaders become the person's accessible leader channels.

This design means that access to a leader channel is based on historical group membership rather than only the person's current group.

6. Navigation and Active Buttons

The setActiveButton() function removes the active class from all buttons in the control panel before adding it to the selected button.

This keeps the navigation interface clear by showing which option is currently selected.

Leader-channel buttons inside the History View can also open the corresponding leader channel.

7. Data Flow

The main data flow is:

Google Sheet → CSV → loadTab() → parseCSV() → JavaScript arrays → filtering/matching → HTML display

The loadTab() function fetches each CSV URL and sends the returned text to parseCSV().

The parsed information is then stored in the appropriate array.

Functions such as findPerson() and findGroup() are used to connect records through their IDs.

Finally, the rendering functions create the HTML that appears on the page.

8. Safety and Data Display

The escapeHTML() function is used when Google Sheet values are inserted into HTML. This prevents characters such as <, >, ", and ' from being interpreted as HTML.

This is especially important because the application displays information that comes from an external data source.

9. Design Goal

The main design goal is to create a simple and maintainable organizational portal where the data can change without requiring changes to the webpage structure.

By keeping the data in one Google Sheet and building the interface dynamically with JavaScript, the project can support new people, groups, memberships, and posts while keeping the same application structure.