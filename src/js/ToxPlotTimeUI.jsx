import React, { PureComponent } from 'react'
import ToxPlotTime from './ToxPlotTime'
import {max } from 'd3-array'
import './ToxPlotTime.css'
import {$} from 'jquery'

class ToxPlotTimeUI extends PureComponent {

  constructor(props){
     super(props)
     this.updateOneGraph = this.updateOneGraph.bind(this)
     this.updateXMax = this.updateXMax.bind(this)
     this.state = {
       oneGraph: true
     }
   }

   componentDidMount() {
    $('#oneGraph').attr('checked','checked')
   }

  updateOneGraph() {
    console.log('hi');
    // console.log($('#oneGraph').is(':checked'));
    this.setState({
      oneGraph: $('#oneGraph').is(':checked')
    })
  }


  updateXMax() {
    this.setState({
      xMax: $('#graphXMax').val()
    })
  }

  render() {

    const xMax = max(this.props.filteredData.map((d) => d.toxEnd)) + 1

    return <div>
      <div className="row">
        <div className="col-xs-3 col-xs-offset-3">
          <div className="form-group filter-option">
            <div style={{height: '10px'}}/>
            <input id="oneGraph" type="checkbox" className="form-check-input" onClick={this.updateOneGraph}/>
            <label  htmlFor="oneGraph" className="form-check-label checkBox" >Single graph</label>
          </div>
        </div>
        <div className="col-xs-3">
          <div className="form-group">
            <div style={{height: '10px'}}/>
            <label  htmlFor="graphXMax">X axis limit (days)</label>
            <input id="graphXMax" type="number" className="form-control" style={{width: '100px', margin: '0 auto'}} min={0} max={xMax} step={1} defaultValue={xMax} onChange={this.updateXMax} />
          </div>
        </div>
      </div>
      <ToxPlotTime
      oneGraph={this.state.oneGraph}
      xMax={isNaN(this.state.xMax) ? xMax: this.state.xMax}
      {...this.props}/>
  </div>
  }

}


export default ToxPlotTimeUI
