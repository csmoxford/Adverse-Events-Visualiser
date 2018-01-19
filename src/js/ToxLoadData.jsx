import React, { PureComponent } from 'react'
import './ToxLoadData.css'




class ToxLoadData extends PureComponent {


    constructor(props){
       super(props)
       this.state = {
         response: ""
       }
    }

  onChange(e) {
    this.setState({response: e.target.files[0].name})
  }

  render() {

    const {onSubmit} = this.props


    return <div className="item-middle">
        <div>
          <h3>Load Data</h3>
          <p>Select the data to load. Data must be a json file.</p>
          <div>
            <input className="inputfile" type="file" id="fileinput" name="file" accept=".json" onChange={this.onChange.bind(this)} />
            <label htmlFor="fileinput" className="btn btn-primary btn-lg">Choose a file</label>
          </div>
          {this.state.response !== ""?<h4>File selected: {this.state.response}</h4>:null}
          {this.state.response !== ""?<button className={`btn ${this.state.response !== ""? " btn-primary btn-lg": " btn-warning"}`} onClick={onSubmit}>Load Data</button>:null}
          <div style={{textAlign: 'left'}}>
            <div style={{height:'30px'}}></div>
            <h4>File format requirements</h4>
            <p>The file should be of type json and contain all the information listed below.</p>
            <p><b>treatment:</b> An array of objects containing the treatment information.</p>
            <ul>
              <li>value: the numeric or string value which is found in patientData</li>
              <li>label: the label to display for this treatment group</li>
              <li>color: a color associated with this treatment group</li>
            </ul>
            <p><b>keyDates:</b> An array of objects containing date information for key time periods.</p>
            <ul>
              <li>column: the column name of the column in patientData</li>
              <li>label: A display name for this date</li>
            </ul>
            <p><b>causality:</b> An array of objects containing causality information.</p>
            <ul>
              <li>column: the column name of the column in patientData</li>
              <li>label: A display name for this causality</li>
            </ul>
            <p><b>patientData:</b> A file containing one row per patient.</p>
            <ul>
              <li>patid: A unique patient identifier such as trial number</li>
              <li>treatment: the treatment assined to this patient. Should be one of the treatment values</li>
              <li>keyDates: As defined in the keyDates object. Should include an end date such as end of treatment</li>
            </ul>
            <p><b>toxData:</b> A file containing adverse event data over time.</p>
            <ul>
              <li>patid</li>
              <li>aestartdate: the adverse event start date or the date the adverse event grade changed to this grade</li>
              <li>aestopdate: the adverse event end date or the date the adverse event grade changed from this grade</li>
              <li>aecategory: the adverse event category</li>
              <li>aeterm: the adverse event name</li>
              <li>aegrade: the adverse event grade</li>
              <li>sae: Was this an SAE?</li>
              <li>causalities: As defined in the causality object. The data store here should be numeric 1 for definitely not related through to 5 for definitely related</li>
            </ul>
            <p><b>keyGroups:</b> A column within toxData containing a logical value. A value of 1 will be included in this group. This can be used to group adverse events such as haematological toxicities, or to group patients such as those with metatstatic disease.</p>
            <ul>
              <li>column: the column name of the column in toxData</li>
              <li>label: A display name for this group</li>
            </ul>
            <p><b>keyEvents:</b> A column label and color for an event to be placed on the adverse event patient level plots.</p>
            <ul>
              <li>column: the column name of the column in patientData</li>
              <li>label: A display name for this event</li>
              <li>color: a color associated with this event type</li>
            </ul>
        </div>

        </div>
      </div>
  }

}


export default ToxLoadData
