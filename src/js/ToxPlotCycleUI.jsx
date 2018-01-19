import React, { PureComponent } from 'react'
import ToxPlotCycle from './ToxPlotCycle'
import {$} from 'jquery'

class ToxPlotCycleUI extends PureComponent {

  constructor(props){
     super(props)
     this.updateOneGraph = this.updateOneGraph.bind(this)
     this.state = {
       oneGraph: true
     }
   }

   componentDidMount() {
      $('#oneGraph').attr('checked','checked')
   }

  updateOneGraph() {
    this.setState({
      oneGraph: $('#oneGraph').is(':checked')
    })
  }

  render() {
    return <div>
      <div className="form-check filter-option">
        <div style={{height: '20px'}}/>
        <input id="oneGraph" type="checkbox" className="form-check-input" onClick={this.updateOneGraph}/>
        <label  htmlFor="oneGraph" className="form-check-label checkBox" >Single graph</label>
      </div>
      <ToxPlotCycle
      oneGraph={this.state.oneGraph}
      {...this.props}/>
  </div>
  }
}


export default ToxPlotCycleUI
