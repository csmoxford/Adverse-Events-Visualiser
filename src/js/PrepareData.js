import {DayDifference} from './utils/formatDate'




function prepareData(data) {



  var toxData = data.toxData;
  var patientData = data.patientData;

  var initDate = data.keyDates[0].column

  for (var i = 0; i < patientData.length; i++) {
    for (var j = 0; j < data.keyDates.length; j++) {
      patientData[i][data.keyDates[j].column] = new Date(patientData[i][data.keyDates[j].column])
    }
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
    else if(a.toxStart < b.toxStart)
        order = 1
    else if(a.toxStart > b.toxStart)
        order = -1
    return order
  })

  for (var i = 0; i < toxData.length; i++) {
    const patient = patientData.find(d => d.patid === toxData[i].patid)
    toxData[i].aestartdate = new Date(toxData[i].aestartdate)
    toxData[i].aestopdate = new Date(toxData[i].aestopdate)

    Object.assign(toxData[i], patient)

    toxData[i].toxStart = DayDifference(patient[initDate], toxData[i].aestartdate) // miliseconds in a day
    toxData[i].toxEnd = 1+DayDifference(patient[initDate], toxData[i].aestopdate) // miliseconds in a day
    if(isNaN(toxData[i].toxEnd)) {
      toxData[i].toxEnd = toxData[i].toxStart + 1
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

}

export default prepareData
