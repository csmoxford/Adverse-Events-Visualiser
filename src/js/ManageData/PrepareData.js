import {uniqBy} from 'lodash'
import {DayDifference} from '../utils/formatDate'
import {defaultToxColors} from '../utils/Constants'

// Takes the data and performs some standard merging and date formatting
function prepareData(data) {

  var i,j

  var toxData = data.toxData;
  var patientData = data.patientData;

  var initDate = data.keyDates[0].column

  for (i = 0; i < patientData.length; i++) {
    for (j = 0; j < data.keyDates.length; j++) {
      patientData[i][data.keyDates[j].column] = new Date(patientData[i][data.keyDates[j].column])
    }
  }

  // count and discard patients with no treatment assigned.
  var numberWithoutTreatment = 0
  for (i = patientData.length-1; i >= 0; i--) {
    if(patientData[i].treatment === undefined) {
      patientData.splice(i,1)
      numberWithoutTreatment++
    }
  }
  if(numberWithoutTreatment > 0) {
    console.log("Warning: There were " + numberWithoutTreatment + " patients without a treatment assigned. These were discarded.");
  }

  // count and discard patients with no keyDate[0] which will typically be registration or randomisation dateOfMeasure
  var numberWithoutKeyDate = 0
  const keyDate = data.keyDates[0]
  for (i = patientData.length-1; i >= 0; i--) {
    if(isNaN(Date.parse(patientData[i][keyDate.column]))) {
      patientData.splice(i,1)
      numberWithoutKeyDate++
    }
  }
  if(numberWithoutKeyDate > 0) {
    console.log("Warning: There were " + numberWithoutKeyDate + " patients without the " + keyDate.label + " Date. These patients were discarded.");
  }


  patientData = patientData.sort((a,b) => {
    let order = 0
    if(a.treatment > b.treatment)
      order = 1
    else if(a.treatment < b.treatment)
      order = -1
    else if(a.patid > b.patid)
      order = 1
    else if(a.patid < b.patid)
      order = -1
    return order
  })

  for (i = 0; i < toxData.length; i++) {
    const patient = patientData.find(d => d.patid === toxData[i].patid)
    if(patient !== undefined) {
      toxData[i].aestartdate = new Date(toxData[i].aestartdate)
      toxData[i].aestopdate = new Date(toxData[i].aestopdate)

      toxData[i].providedAEstopdate = toxData[i].aestopdate // used in the tables

      Object.assign(toxData[i], patient)

      if(isNaN(Date.parse(toxData[i].aestopdate))) { // if end date missing use latest end date
        for(j=0; j<data.keyDates.length; j++) {
          if(!isNaN(Date.parse(toxData[i][data.keyDates[j].column]))) {
            toxData[i].aestopdate = toxData[i][data.keyDates[j].column]
          }
        }
      }

      toxData[i].toxStart = DayDifference(patient[initDate], toxData[i].aestartdate)
      toxData[i].toxEnd = 1 + DayDifference(patient[initDate], toxData[i].aestopdate)
      if(isNaN(toxData[i].toxEnd)) {
        toxData[i].toxEnd = toxData[i].toxStart + 1
      }
    }
  }

  toxData = toxData.sort((a,b) => {
    let order = 0
    if(a.treatment > b.treatment)
      order = 1
    else if(a.treatment < b.treatment)
      order = -1
    else if(a.patid > b.patid)
      order = 1
    else if(a.patid < b.patid)
      order = -1
    else if(a.toxStart > b.toxStart)
      order = 1
    else if(a.toxStart < b.toxStart)
      order = -1
    return order
  })

  if(data.measureData !== undefined) {
    var measureData = data.measureData

    for (i = 0; i < measureData.length; i++) {
      measureData[i].dateOfMeasure = new Date(measureData[i].dateOfMeasure)

      const patient = patientData.find(d => d.patid === measureData[i].patid)
      if(patient !== undefined) {
        Object.assign(measureData[i], patient)

        measureData[i].relativeTime = DayDifference(patient[initDate], measureData[i].dateOfMeasure) // miliseconds in a day
      }
    }
  }

  if(data.treatmentSpecification !== undefined) {
    const datasets = uniqBy(data.treatmentSpecification, d => d.index)

    for(var k=0; k < datasets.length; k++) {
      var dataset = data[datasets[k].datasetName]

      for (i = 0; i < dataset.length; i++) {
        const patient = patientData.find(d => d.patid === dataset[i].patid)
        if(patient !== undefined) {
          Object.assign(dataset[i], patient)
        }
      }
    }
  }

  if(data.toxColors === undefined) {
    data.toxColors = defaultToxColors
  }

}

export default prepareData
