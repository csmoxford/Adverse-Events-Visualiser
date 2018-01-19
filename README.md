# Adverse Events

This is a data visualisation tool for adverse events. The web based application takes a json data file and provides tools to explore the data at a patient and aggregated level in the form of tables and graphs. There are a number of filters to allow further investigation of the data.

This is still a work in progress and may be updated considerably.

## Usage

Go [here](https://csmoxford.github.io/Adverse-Events-Visualiser/) to start using this application. There is an example dataset with dummy data in the **Data** folder of this repository if you want to test it out. Note: you will need to download the data and select it from your local machine.

For best results use the Google Chrome browser.

## File format requirements

The file should be of type json and contain all the information listed below.

**treatment:** An array of objects containing the treatment information.

* value: the numeric or string value which is found in patientData
* label: the label to display for this treatment group
* color: a color associated with this treatment group

**keyDates:** An array of objects containing date information for key time periods.

* column: the column name of the column in patientData
* label: A display name for this date

**causality:** An array of objects containing causality information.

* column: the column name of the column in patientData
* label: A display name for this causality

**patientData:** A file containing one row per patient.

* patid: A unique patient identifier such as trial number
* treatment: the treatment assined to this patient. Should be one of the treatment values
* keyDates: As defined in the keyDates object. Should include an end date such as end of treatment

**toxData:** A file containing adverse event data over time.

* patid
* aestartdate: the adverse event start date or the date the adverse event grade changed to this grade
* aestopdate: the adverse event end date or the date the adverse event grade changed from this grade
* aecategory: the adverse event category
* aeterm: the adverse event name
* aegrade: the adverse event grade
* sae: Was this an SAE?
* causalities: As defined in the causality object. The data store here should be numeric 1 for definitely not related through to 5 for definitely related

**keyGroups:** (optional) A column within toxData containing a logical value. A value of 1 will be included in this group. This can be used to group adverse events such as haematological toxicities, or to group patients such as those with  metatstatic disease.

* column: the column name of the column in toxData
* label: A display name for this group

**keyEvents:** (optional) A column label and color for an event to be placed on the adverse event patient level plots.

* column: the column name of the column in patientData
* label: A display name for this event
* color: a color associated with this event type

## Development version

To set-up a local development server:

1. Download this repository.
2. Download and install [Node.js](https://nodejs.org/en/download/). Node comes with a package manager which we will use to download all the dependencies and also to run the app.
3. Open the command line or terminal.
4. Navigate to the folder containing this repository (e.g. in windows cd *C:/folderpath*
5. Install dependencies using the command **npm install -s**
6. Start the app using the command **npm start**
7. Once built the app will be running on http://localhost:3000. Go to this page in a web browser. Note that testing was performed in chrome.

## Technical details

This web application is written in javascript (jsx) relying heavily on React and d3. React is a data binding package which means when the data is changed the interface updates automatically. d3 is a graphing and data visualisation library. Bootstrap is used for styling and CSS grid for layout.

## Author

Peter Dutton (Centre for Statistics in Medicine, University of Oxford)

## License

GPL-3