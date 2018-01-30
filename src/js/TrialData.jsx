import React, {Component}  from 'react'
import {Switch, Route} from 'react-router-dom'

import ToxPlot from './ToxPlot/ToxPlot'
import ToxPlotKey from './ToxPlot/ToxPlotKey'
import ToxPlotTimeUI from './ToxPlot/ToxPlotTimeUI'


import ShowToxicityRecord from './ShowPatient/ShowToxicityRecord'
import ToxFilters from './ToxFilters'
import prepareData from './prepareData'

import ToxTableUI from './ToxTable/ToxTableUI'
import ToxTableSummary from './ToxTable/ToxTableSummary'

import ToxPlotCycleUI from './ToxPlot/ToxPlotCycleUI'
import ToxPlotKaplan from './ToxPlot/ToxPlotKaplan'

import LoadData from './LoadData'
import ToxAddData from './ToxAddData'

import PatientView from './PatientView'

import Treatment from './Treatment'

import {vhToPx, vwToPx} from './utils/vhTOpx'
import {DayDifference} from './utils/formatDate'

var $ = require('jquery')

// filteredData
function filterData(data, filterValues) {
    const filt = (d,i) => {
    const from = filterValues.from // get the start of time window from patientData
    const to = filterValues.to // get the end of time window from patientData
    const inTime = !((d.aestartdate < d[from] && (d.aestopdate < d[from]) || isNaN(d.aestopdate)) || (d.aestartdate > d[to])) && !isNaN(d[from]) // if toxicity was present in time window
    var aeSelected = true
    if(filterValues.aeSelectType == 2){ // category
      aeSelected = filterValues.aeCategorySelected.indexOf("All") !== -1 || filterValues.aeCategorySelected.indexOf(d.aecategory) !== -1 // if toxicity selected
    } else if(filterValues.aeSelectType == 3){ // ae name
      aeSelected = filterValues.aeSelected.indexOf("All") !== -1 || filterValues.aeSelected.indexOf(d.aeterm) !== -1 // if toxicity selected
    } else if(filterValues.aeSelectType == 4){
      aeSelected = d[filterValues.keyGroupSelect]
    }
    const gradeSelected = d.aegrade >= filterValues.gradeSelected // if grade high enough
    const causalityOk = filterValues.causalities.every((c) => d[c.column] >= c.value || (d[c.column] === undefined && c.value == 1) ) // if causality related enough
    const isSae = filterValues.isSae? d.sae: true
    const presentAtStart = filterValues.includePresentAtStart ? true: d.aestartdate >= d[from] // if toxicities present at start permitted then is true, otherwise start of toxicity must be on or after start of toxicity window


    return  inTime && aeSelected && gradeSelected && causalityOk && isSae && presentAtStart
  }
  return data.toxData.filter(filt)
}

function locationOf(element, array, comparer, start, end) {
    if (array.length === 0)
        return -1;

    start = start || 0;
    end = end || array.length;
    var pivot = (start + end) >> 1;  // should be faster than dividing by 2
    var c = comparer(element, array[pivot]);
    if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;

    switch (c) {
        case -1: return locationOf(element, array, comparer, start, pivot);
        case 0: return pivot;
        case 1: return locationOf(element, array, comparer, pivot, end);
    };
};


class TrialData extends Component {

  constructor(props){
     super(props)
     this.updateFilterStateValues = this.updateFilterStateValues.bind(this)
     this.updateDimentions = this.updateDimentions.bind(this)
     this.showDetails = this.showDetails.bind(this)
     this.handleFileSelect = this.handleFileSelect.bind(this)
     this.onReaderLoad = this.onReaderLoad.bind(this)
     this.addAdverseEvent = this.addAdverseEvent.bind(this)
     this.state = {
       data: null,
       entry: null,
       selectedPatient: null,
       filterValues: null
     }
  }

  updateDimentions() {
    const height = vhToPx(80)
    const width = vwToPx(50);
    this.setState({size: {width: width, height: height}})
  }

  componentWillMount() {
        window.addEventListener("resize", this.updateDimentions);
    }

  updateFilterStateValues() {
    const from = $("#adverseEventTimeFrom").val() // get the start of time window from patientData
    const to = $("#adverseEventTimeTo").val() // get the end of time window from patientData
    const aeSelectedType = $('#adverseEventType').val()
    const aeSelected = $("#adverseEventSelect").val() // if toxicity selected
    const aeCategorySelected = $('#adverseEventCategory').val() //
    const keyGroupSelect = $('#keyGroupSelect').val()
    const gradeSelected = $('#adverseEventGrade').val() // if grade high enough
    const causalities = this.state.data.causality.map(c =>  {return {column: c.column, value: isNaN($(`#${c.column}`).val())? 1 : $(`#${c.column}`).val()}})
    const isSae = $('#saeCheck').is(':checked')
    const includePresentAtStart = $('#presentCheck').is(':checked')

    console.log("updating filter");

    const filterValues = {
        from: from,
        to: to,
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
      filteredData[i].toxEnd = DayDifference(filteredData[i][from], filteredData[i].aestopdate)
      if(isNaN(filteredData[i].toxEnd)) {
        filteredData[i].toxEnd = filteredData[i].toxStart + 1
      }
    }



    this.setState({
      filterValues: filterValues,
      filteredData: filteredData,
      selectedPatient: null}
    )
  }

  showDetails(patient, event) {
    if(patient !== null) {
      this.setState({
        entry: this.state.filteredData.filter(d => patient.patid == d.patid),
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
            aeSelected: "All",
            gradeSelected: 1,
            causalities: [],
            isSae: false,
            includePresentAtStart: true
          }

          const filteredData = filterData(obj, filterValues)

          this.setState({
            filterValues: filterValues,
            data: obj,
            filteredData: filteredData
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

      if(data === null) {
        return <div className="cssGrid"><LoadData onSubmit={this.handleFileSelect}/></div>
      }



     // change zero date for plots
     var from = filterValues.from // get the start of time window from patientData
     from = from == undefined ? data.keyDates[0].column : from


     /***************************************************************/

     const totalHeight = vhToPx(94.5)
     const size = {width: vwToPx(49), height: totalHeight}



     return (
         <div className="cssGrid">
           <Route path="/trialData/ae" render={() => <ToxFilters
            className="item-left"
            data={data}
            updateFilterStateValues={this.updateFilterStateValues}
            />}/>
             <Switch>
               <Route path="/trialData/load" render={() => <LoadData onSubmit={this.handleFileSelect}/>}/>
               <Route path="/trialData/ae/addae" render={() => <ToxAddData data={data} filterValues={filterValues} addAdverseEvent={this.addAdverseEvent}/>}/>
               <Route path='/trialData/ae/summary' render={() => <div id="main" className="item-main">
                 <ToxPlotTimeUI
                   data={data}
                   filteredData={filteredData}
                   />
               </div>
                 }/>
              <Route path='/trialData/ae/table' render={() => <div className="item-main">
                <div style={{height:30}}></div>
                <ToxTableUI
                   data={data}
                   filteredData={filteredData}
                />
               </div>
               }/>
             <Route path='/trialData/ae/summary_table' render={() => <div className="item-main">
                <div style={{height:30}}></div>
                   <ToxTableSummary
                      data={data}
                      filteredData={filteredData}
                   />
                </div>
                }/>
              <Route path='/trialData/ae/cycle_plot' render={() => <div className="item-main">
                      <ToxPlotCycleUI
                         data={data}
                         filteredData={filteredData}
                      />
                   </div>
                   }/>
               <Route path="/trialData/ae/survival" render={() => <ToxPlotKaplan
                   data={data}
                   filteredData={filteredData}
                   />}/>
                 <Route path="/trialData/ae/PatientView" render={() => <PatientView
                   data={data}
                   totalHeight={totalHeight}
                   filteredData={filteredData}
                   filterValues={filterValues}
                   />}/>
               <Route path='/trialData/ae/pt' render={() =>
                    [
                      <div className="item-middle" key={0}>
                        <ToxPlot
                          totalHeight={totalHeight}
                           data={data}
                           filteredData={filteredData}
                           offset={{top: 0, bottom: 0, left: 10, right: 0}}
                           size={size}
                           showDetails={this.showDetails}
                           selectedPatient={this.state.selectedPatient}
                           filter={this.state.filterValues}
                           oneRowPerPatient={true} />
                     </div>,
                     <div className="item-right" key={1}>
                       <ShowToxicityRecord
                         data={data}
                         totalHeight={totalHeight}
                         selectedPatient={this.state.selectedPatient}
                         thisData={this.state.entry}/>
                     </div>
                   ]
                 }
                />
                <Route path='/trialData/ae/key' render={() => <div className="item-middle" key={0}>
                   <ToxPlotKey
                     data={data}
                      size={size} />
                  </div>
                }/>
              <Route path="/trialData/treatment" render={() => <Treatment
                  data={data}
                  totalHeight={totalHeight}
                  showDetails={this.showDetails}
                  selectedPatient={this.state.selectedPatient}
                  />}
                />
            <Route path='/trialData/ae' render={() =>
                [<div className="item-middle" key={0}>
                   <ToxPlot
                     totalHeight={totalHeight}
                     data={data}
                     filteredData={filteredData}
                     offset={{top: 0, bottom: 0, left: 10, right: 0}}
                     size={size}
                     showDetails={this.showDetails}
                     filter={this.state.filterValues}
                     selectedPatient={this.state.selectedPatient} />
                 </div>,
                 <div className="item-right" key={1}>
                   <ShowToxicityRecord
                     data={data}
                     totalHeight={totalHeight}
                     selectedPatient={this.state.selectedPatient}
                     thisData={this.state.entry}/>
                 </div>
               ]}/>
           </Switch>
        </div>
     )
   }
}
export default TrialData
