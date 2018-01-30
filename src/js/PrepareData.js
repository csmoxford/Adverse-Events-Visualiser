import {DayDifference} from './utils/formatDate'
import {defaultToxColors} from './utils/Constants'



function prepareData(data) {



  var toxData = data.toxData;
  var patientData = data.patientData;

  var initDate = data.keyDates[0].column

  for (var i = 0; i < patientData.length; i++) {
    for (var j = 0; j < data.keyDates.length; j++) {
      patientData[i][data.keyDates[j].column] = new Date(patientData[i][data.keyDates[j].column])
    }
  }

  // count and discard patients with no treatment assigned.
  var numberWithoutTreatment = 0
  for (var i = patientData.length-1; i >= 0; i--) {
    if(patientData[i].treatment == undefined) {
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
  for (var i = patientData.length-1; i >= 0; i--) {
    if(patientData[i][keyDate.column] == "Invalid Date") {
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

  for (var i = 0; i < toxData.length; i++) {
    const patient = patientData.find(d => d.patid === toxData[i].patid)
    if(patient != undefined) {
      toxData[i].aestartdate = new Date(toxData[i].aestartdate)
      toxData[i].aestopdate = new Date(toxData[i].aestopdate)

      Object.assign(toxData[i], patient)

      toxData[i].toxStart = DayDifference(patient[initDate], toxData[i].aestartdate) // miliseconds in a day
      toxData[i].toxEnd = 1+DayDifference(patient[initDate], toxData[i].aestopdate) // miliseconds in a day
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

    for (var i = 0; i < measureData.length; i++) {
      measureData[i].dateOfMeasure = new Date(measureData[i].dateOfMeasure)

      const patient = patientData.find(d => d.patid === measureData[i].patid)
      if(patient != undefined) {
        Object.assign(measureData[i], patient)

        measureData[i].relativeTime = DayDifference(patient[initDate], measureData[i].dateOfMeasure) // miliseconds in a day
      }
    }
  }

  if(data.toxColors == undefined) {
    data.toxColors = defaultToxColors
  }

}

export default prepareData
