import React, {Component} from 'react'

import ToxPlot from './ToxPlot'
import ToxPlotKey from './ToxPlotKey'

import ShowToxicityRecord from '../ShowPatient/ShowToxicityRecord'


class ToxPlotUI extends Component {


  componentDidMount() {
    console.log('stop mounting');
  }

  constructor(props) {
    super(props)
    this.state = {
      legend: true
    }
    this.OnPatientMouseOver = this.OnPatientMouseOver.bind(this)
    this.showKey = this.showKey.bind(this)
  }

  OnPatientMouseOver(patient, event) {
    // console.log("patient" + patient.patid);
    this.props.showDetails(patient, event)
    this.setState({legend: false})
  }

  showKey() {
    // console.log("axis");
    this.setState({legend: true})
  }

  render() {


    var rightColumn
    if(this.state.legend) {
      rightColumn = <ToxPlotKey data={this.props.data} width={300}/>
    } else {
      rightColumn = <ShowToxicityRecord data={this.props.data} totalHeight={this.props.totalHeight} selectedPatient={this.props.selectedPatient} thisPatientsAeData={this.props.selectedPatientAEs}/>
    }

    return  [
      <div className="item-middle" key={0}>
      <ToxPlot  {...this.props} showDetails={this.OnPatientMouseOver} showKey={this.showKey}/>
      </div>,
      <div className="item-right" key={1}>
        {rightColumn}
      </div>
    ]
  }
}


export default ToxPlotUI
