import React, {Component}  from 'react'
import {Switch, Route} from 'react-router-dom'

import LoadData from './ManageData/LoadData'
import prepareData from './ManageData/prepareData'

import Treatment from './Treatment/Treatment'
import PatientSummary from './PatientSummary'
import Error404 from './Error404'

import AdverseEvents from './Tox/AdverseEvents'
import ToxFilters from './Tox/ToxFilters'

import {vhToPx, vwToPx} from './utils/vhTOpx'
import {DayDifference} from './utils/formatDate'



var $ = require('jquery')

// filteredData
function filterData(data, filterValues) {
    const filt = (d,i) => {
    const from = filterValues.from // get the start of time window from patientData
    const to = filterValues.to // get the end of time window from patientData
    const inTime = !((d.aestartdate < d[from] && (d.aestopdate < d[from] || isNaN(d.aestopdate))) || (d.aestartdate > d[to])) && !isNaN(d[from]) // if toxicity was present in time window
    var aeSelected = true
    if(filterValues.aeSelectType === "2"){ // category
      aeSelected = filterValues.aeCategorySelected.indexOf("All") !== -1 || filterValues.aeCategorySelected.indexOf(d.aecategory) !== -1 // if toxicity selected
    } else if(filterValues.aeSelectType === "3"){ // ae name
      aeSelected = filterValues.aeSelected.indexOf("All") !== -1 || filterValues.aeSelected.indexOf(d.aeterm) !== -1 // if toxicity selected
    } else if(filterValues.aeSelectType === "4"){
      aeSelected = d[filterValues.keyGroupSelect]
    }

    const gradeSelected = d.aegrade >= filterValues.gradeSelected // if grade high enough
    const causalityOk = filterValues.causalities.every((c) => d[c.column] >= c.value || (d[c.column] === undefined && c.value === 1)) // if causality related enough
    const isSae = filterValues.isSae? d.sae: true
    const presentAtStart = filterValues.includePresentAtStart ? true: d.aestartdate >= d[from] // if toxicities present at start permitted then is true, otherwise start of toxicity must be on or after start of toxicity window

    if(!(inTime && aeSelected && gradeSelected && causalityOk && isSae && presentAtStart)) {
      // console.log(`${i}, Intime: ${inTime}, aeSelected: ${aeSelected}, gradeSelected: ${gradeSelected}, causalityOk: ${causalityOk}, isSae: ${isSae}, presentAtStart: ${presentAtStart}`);
      // console.log(d);
    }
    return  inTime && aeSelected && gradeSelected && causalityOk && isSae && presentAtStart
  }
  // console.log(data.toxData.filter((d,i) => !filt(d,i)));
  return data.toxData.filter(filt)
}

function locationOf(element, array, comparer, start, end) {
    if (array.length === 0)
        return -1;

    start = start || 0
    end = end || array.length
    var pivot = (start + end) >> 1  // should be faster than dividing by 2
    var c = comparer(element, array[pivot])
    if (end - start <= 1) return c === -1 ? pivot - 1 : pivot

    switch (c) {
        case -1: return locationOf(element, array, comparer, start, pivot)
        case 0: return pivot
        case 1: return locationOf(element, array, comparer, pivot, end)
    }
}


class TrialData extends Component {

  constructor(props){
     super(props)
     this.updateFilterStateValues = this.updateFilterStateValues.bind(this)
     this.updateDimensions = this.updateDimensions.bind(this)
     this.showDetails = this.showDetails.bind(this)
     this.handleFileSelect = this.handleFileSelect.bind(this)
     this.onReaderLoad = this.onReaderLoad.bind(this)
     this.addAdverseEvent = this.addAdverseEvent.bind(this)

     this.state = {
       data: null,
       selectedPatientAEs: null,
       selectedPatient: null,
       filterValues: null,
       size: this.getDimensions()
     }
  }

  updateDimensions() {
    this.setState({size: this.getDimensions()})
  }

  getDimensions() {
    return {width: vwToPx(46.5), height: vhToPx(95)}
  }

  componentWillMount() {
        window.addEventListener("resize", this.updateDimensions);
    }

  updateFilterStateValues() {
    console.log("updating filter");


    const from = $("#adverseEventTimeFrom").val() // get the start of time window from patientData
    const to = $("#adverseEventTimeTo").val() // get the end of time window from patientData

    const fromLabel = this.state.data.keyDates.find(d => d.column === from).label
    const toLabel = this.state.data.keyDates.find(d => d.column === to).label

    const aeSelectedType = $('#adverseEventType').val()
    const aeSelected = $("#adverseEventSelect").val() // if toxicity selected
    const aeCategorySelected = $('#adverseEventCategory').val() //
    const keyGroupSelect = $('#keyGroupSelect').val()
    const gradeSelected = $('#adverseEventGrade').val() // if grade high enough
    const causalities = this.state.data.causality.map(c =>  {return {column: c.column, value: isNaN($(`#${c.column}`).val())? 1 : $(`#${c.column}`).val()}})
    const isSae = $('#saeCheck').is(':checked')
    const includePresentAtStart = $('#presentCheck').is(':checked')

    const filterValues = {
        from: from,
        fromLabel: fromLabel,
        to: to,
        toLabel: toLabel,
        aeSelectType: aeSelectedType,
        aeCategorySelected: aeCategorySelected,
        aeSelected: aeSelected,
        gradeSelected: gradeSelected,
        causalities: causalities,
        keyGroupSelect: keyGroupSelect,
        isSae: isSae,
        includePresentAtStart: includePresentAtStart
      }

      // change start date to the time period from date
    var filteredData = filterData(this.state.data, filterValues)

    for (var i = 0; i < filteredData.length; i++) {
      filteredData[i].toxStart = DayDifference(filteredData[i][from], filteredData[i].aestartdate)
      filteredData[i].toxEnd = 1+DayDifference(filteredData[i][from], filteredData[i].aestopdate)
      if(isNaN(filteredData[i].toxEnd)) {
        filteredData[i].toxEnd = filteredData[i].toxStart + 1
      }
    }

    this.setState({
      filterValues: filterValues,
      filteredData: filteredData,
      selectedPatient: null}
    )
    console.log(`Filter selected ${filteredData.length} row out of ${this.state.data.toxData.length} in the adverse event dataset`);
  }

  showDetails(patient, event) {
    if(patient !== null) {
      this.setState({
        selectedPatientAEs: this.state.filteredData.filter(d => patient.patid === d.patid),
        selectedPatient: patient
      })
    }
  }



  onReaderLoad(event){
          var obj = JSON.parse(event.target.result);
          prepareData(obj)

          const filterValues = {
            from: obj.keyDates[0].column,
            to: obj.keyDates[obj.keyDates.length - 1].column,
            fromLabel: obj.keyDates[0].label,
            toLabel: obj.keyDates[obj.keyDates.length - 1].label,
            aeSelected: "All",
            gradeSelected: 1,
            causalities: [],
            isSae: false,
            includePresentAtStart: true
          }

          const filteredData = filterData(obj, filterValues)


          const loadedMessage = <div>
              <h4>Data is loaded from: {obj.trial}</h4>
              <p>There is {obj.patientData.length} patients present in the dataset.</p>
              <p>There is {obj.toxData.length} rows in the toxData dataset.</p>
            </div>

          this.setState({
            filterValues: filterValues,
            data: obj,
            filteredData: filteredData,
            loadedMessage: loadedMessage
          })
      }

  handleFileSelect() {
      if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
      }

      var input = document.getElementById('fileinput');
      if (!input) {
        alert("Um, couldn't find the fileinput element.");
      }
      else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
      }
      else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
      }
      else {
        var reader = new FileReader();
        reader.onload = this.onReaderLoad;
        reader.readAsText(input.files[0]);

      }
    }


    addAdverseEvent(row) {
      var data = this.state.data
      const index = locationOf(row, data.toxData, (a,b) => {
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
      data.toxData.splice(index+1, 0, row);
      // data.toxData.push(row)
      this.setState({data: data})
    }

   render() {

     const {data, filteredData, filterValues} = this.state
     const {size, selectedPatient, selectedPatientAEs} = this.state

      if(data === null) {
        return <div className="cssGrid"><LoadData onSubmit={this.handleFileSelect}/></div>
      }

     /***************************************************************/
     const totalHeight = vhToPx(94.5)


     return (
         <div className="cssGrid">
           <Route path="/trialData/ae" render={() => <ToxFilters className="item-left" data={data} updateFilterStateValues={this.updateFilterStateValues}/>}/>
           <Route path="/trialData/patientSummary" render={() => <ToxFilters className="item-left" data={data} updateFilterStateValues={this.updateFilterStateValues}/>}/>
             <Switch>
               <Route path="/trialData/load" render={() => <LoadData onSubmit={this.handleFileSelect} loadedMessage={this.state.loadedMessage}/>}/>
               <Route path="/trialData/treatment" render={() => <Treatment data={data} totalHeight={totalHeight}  filter={filterValues} showDetails={this.showDetails} selectedPatient={selectedPatient} size={size}/>} />
               <Route path="/trialData/ae" render={() => <AdverseEvents data={data} filteredData={filteredData} filterValues={filterValues} showDetails={this.showDetails} selectedPatient={selectedPatient} selectedPatientAEs={selectedPatientAEs} size={size} addAdverseEvent={this.addAdverseEvent}/>}/>
               <Route path="/trialData/patientSummary" render={() => <PatientSummary data={data} totalHeight={totalHeight} filteredData={filteredData} filter={filterValues} />}/>
               <Route component={Error404}/>
           </Switch>
        </div>
     )
   }
}
export default TrialData
