import React from 'react'
import './Forms.css'
import 'bootstrap-select'
import "bootstrap-select/dist/css/bootstrap-select.css"

const Input = (props) => {
  const {id, type, className, label} = props

  if(type === "checkbox") {
    return <div className={`form-check filter-option ${className}`}>
        <input id={id} type="checkbox" className="form-check-input"/>
        <label  htmlFor={id} className="form-check-label checkBox">{label}</label>
      </div>
  }
  return <div className={className}>
    <label htmlFor={id}>{label}</label><br/>
    <input id={id} type={type} className="form-control"/>
  </div>
}


const Select = (props) => {

  const {id, label, options, multiple} = props

  return <div className="filter-option">
    <label htmlFor={id}>{label}</label><br/>
    <select id={id} multiple={multiple} className="selectpicker" onChange={props.onChange} defaultValue={props.defaultValue} style={props.style}>
      {props.children}
    </select>
  </div>
}


Select.defaultProps = {
  multiple: false
}


export {Input ,Select}
