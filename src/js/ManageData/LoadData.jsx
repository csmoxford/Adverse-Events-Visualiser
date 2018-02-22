import React, { PureComponent } from 'react'
import './LoadData.css'


class LoadData extends PureComponent {
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
          <h3 style={{textAlign: 'center'}}>File format requirements. There are examples on <a href="https://github.com/csmoxford/Adverse-Events-Visualiser/tree/master/Data">github</a></h3>
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
          <p><b>toxColors:</b> (optional) An array of length 6 defining the colour to display each adverse event grade at. There are default colors if this is not provided.</p>
          <p><b>keyGroups:</b> (optional) A column within toxData containing a logical value. A value of 1 will be included in this group. This can be used to group adverse events such as haematological toxicities, or to group patients such as those with metatstatic disease.</p>
          <ul>
            <li>column: the column name of the column in toxData</li>
            <li>label: A display name for this group</li>
          </ul>
          <p><b>keyEvents:</b> (optional) A column label and color for an event to be placed on the adverse event patient level plots.</p>
          <ul>
            <li>column: the column name of the column in patientData</li>
            <li>label: A display name for this event</li>
            <li>color: a color associated with this event type</li>
            <li>dash: (optional) true / false use a dashed line. Default is false - solid</li>
          </ul>
          <p><b>measureData:</b> (optional) A dataset of measure data at various time points such as blood test results.</p>
          <ul>
            <li>patid: A unique patient identifier such as trial number</li>
            <li>dateOfMeasure: The date the measurement was taken</li>
            <li>measureColum: The column named in measureColumns</li>
          </ul>
          <p><b>measureColumns:</b> (optional) A list of measure types to plot from measure data.</p>
          <ul>
            <li>column: the column name of the column in measureData</li>
            <li>label: A display name for this measure</li>
            <li>min: (optional) A minimum value for the range of this measure. A red line will be drawn at this level in the measure plot. Counld represent normal range or a CTCAE grade.</li>
            <li>max: (optional) A maximum value for the range of this measure. A red line will be drawn at this level in the measure plot. Counld represent normal range or a CTCAE grade.</li>
          </ul>
          <p><b>treatmentSpecification:</b> (optional, experimental) A list of treatment data metadata for treatment compliance data, for plotting patient treatment data.</p>
          <ul>
            <li>index: A reference to the treatment type. In the case that there is multiple data for a single treatment type these should reference the same index and will be plotted overlaid in order.</li>
            <li>type: One of "Single" or "Double". Define if the data is a single day or a time period between two dates.</li>
            <li>label: A display name for this measure</li>
            <li>datasetName: The name of the dataset containing the information for this treatment. This dataset should be provided as part of the data object</li>
            <li>column: A column containing a numerical representation of dose</li>
            <li>startDate: The date treatment was given or the start of a time period that treatment was given on</li>
            <li>endDate: the end of a treatment period for type = "Double"</li>
            <li>doseColors: An array of dose colors. Each object should contain a value and a color. The treatment dose is assigned the color of the largest value in this array which is less than or equal to the dose. labels may be added and are used for keys in place of values. &#123;"value":"0", "color": "#000000", "label": "0-25mg"&#125;</li>
          </ul>
        </div>
      </div>
    </div>
  }

}


export default LoadData
