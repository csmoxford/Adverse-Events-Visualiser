import React, {PureComponent } from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import Axis from './utils/Axis'
import {uniq, uniqBy} from 'lodash'

import 'bootstrap-select'
import "bootstrap-select/dist/css/bootstrap-select.css"
import './ToxFilters.css'

import BloodPlot from './BloodPlot'

import PatientSelect from './utils/PatientSelect'
import EventPolyline from './utils/EventPolyline'

import AdverseEventRect from './ToxPlot/AdverseEventRect'
import AdverseEventLabels from './ToxPlot/AdverseEventLabels'


function getIndex(data, oneRowPerPatient = false) {
  var numberUnique = -1
  for (var i = 0; i < data.length; i++) {
    var isNew = true
    var j = 0
    while(isNew && j<i) {
      if(data[i].patid === data[j].patid && (data[i].aeterm === data[j].aeterm || oneRowPerPatient))
        isNew = false
      j++
    }
    if(isNew) {
      numberUnique++
    }
    data[i].index = numberUnique
  }
}

class PatientView extends PureComponent {


  constructor(props) {
    super(props)
    this.state = {
      patid: this.props.data.patientData[0].patid,
      measureColumns: this.props.data.measureColumnss == undefined? undefined: this.props.data.measureColumnss[0]
    }
    this.updatePatient = this.updatePatient.bind(this)
    this.updateBloodValue = this.updateBloodValue.bind(this)
  }

  componentDidMount() {
    $('.selectpicker').selectpicker()
  }

  componentDidUpdate() {
    $('.selectpicker').selectpicker()
  }

  // seelct patient
  // select blood value (over time value)

  updatePatient() {
    console.log("hi");
    this.setState({patid: $('#patid').val()})
  }

  updateBloodValue() {
    const measureColumns = this.props.data.measureColumnss.find(d => d.column == $('#measureColumns').val())
    this.setState({measureColumns: measureColumns})
  }


  render() {



    const {data, filteredData} = this.props
    const size = {width: 500, height: 500}
    const offset = {left: 50, right:50, top: 10, bottom: 50}

    var bloodSelect
    if(data.measureColumnss !== undefined) {
      const bloodOptions = data.measureColumnss.map((d,i) => <option key={i} value={d.column}>{d.label}</option>)

      bloodSelect = <div className="add-patient">
        <label htmlFor="measureColumns">Blood group</label><br/>
        <select id="measureColumns" className="selectpicker" onChange={this.updateBloodValue}>
          {bloodOptions}
        </select>
      </div>
    }

    var toxPlot, bloodPlot
    if(this.state.patid !== undefined) {

      const patient = data.patientData.find(p => p.patid === this.state.patid)
      var subData = filteredData.filter(d => d.patid === this.state.patid)
      getIndex(subData)

      const xMin = 0
      const xMax = max(subData.map((d) => d.toxEnd)) + 1

      const xScale = scaleLinear()
        .domain([xMin, xMax])
        .range([offset.left, size.width - offset.right])

       const yMin = min(subData.map((d) => d.index)) - 0.5
       const yMax = max(subData.map((d) => d.index)) + 0.5

       const height = 30 * (max(subData.map(d => d.index))+1) + offset.top + offset.bottom

       const yScale = scaleLinear()
          .domain([yMin, yMax])
          .range([offset.top, height-offset.bottom])


      const rowData = uniqBy(subData.map(d => {return {patid: d.patid, index: d.index, aeterm: d.aeterm}}), 'index')



      if(this.state.measureColumns !== undefined) {
        bloodPlot = <BloodPlot
          data={data.measureData.map((d,i) => {return {x: d.relativeTime, y: d[this.state.measureColumns.column]}})}
          xScale={xScale}
          />
      }




      toxPlot = <svg ref={node => this.node = node}
    width={size.width} height={height}>
        <AdverseEventRect
          filteredData={subData}
          xScale={xScale}
          yScale={yScale}/>
        <AdverseEventLabels data={rowData} xScale={xScale} yScale={yScale}/>
          <Axis
            side="bottom"
            lab="Time (days)"
            xScale={xScale}
            yPos={yScale.range()[1]}
          />
      </svg>

    }

    return <div className='item-main'>
      <div className="row">
        <div className="col-xs-12">
          <PatientSelect data={data.patientData} didChange={this.updatePatient}/>
          {bloodSelect}
        </div>
        <div className="col-xs-6">
          {bloodPlot}
        </div>
        <div className="col-xs-6">
          {toxPlot}
          </div>
      </div>
    </div>
  }


}

export default PatientView
