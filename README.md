# Adverse Events

This is a data visualisation tool for adverse events. The web based application takes a json data file and provides tools to explore the data at a patient and aggregated level in the form of tables and graphs. There are a number of filters to allow investigation of the dataset.

## Local installation

This web application is in javascript relying heavily on react and d3. To set-up a local server:

1. Download this repository.
2. Download and install [Node.js](https://nodejs.org/en/download/). Node comes with a package manager which we will use to download all the dependencies and also to run the app.
3. Open the command line or terminal.
4. Navigate to the folder containing this repository (e.g. in windows cd *C:/folderpath*
5. Install dependencies using the command **npm install -s**
6. Start the app using the command **npm start**
7. Once biult the app will be running on http://localhost:3000. Go to this page in a web browser. Note that testing was performed in chrome.