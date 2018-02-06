import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {MenuItem} from 'react-bootstrap'
import './Menu.css'

const NavLink = (props) => {
  return <li className={(props.active ? "active" : "")}><Link to={props.to} onClick={e => props.updateActive(props.id,e)}>{props.label}</Link></li>
}

class Menu extends Component {

  constructor(props){
     super(props)
     this.state = {
       links:
       [
         {to: '/trialData/load', label: 'Load', id: 'load', dropDown: false, active: false},
         {to: '/trialData/patientSummary', label: 'Patient Summary', id: 'patient', dropDown: false, active: false},
         {label: "Adverse Events", id: 'event', dropDown: true, active: false, subLinks: [
           {to: '/trialData/ae/', label: 'Adverse Events', id: 'event', dropDown: false},
           {to: '/trialData/ae/pt', label: 'Patient Worst Grade', id: 'event', dropDown: false},
           {dropDown: false, separator: true},
           {to: '/trialData/ae/table', label: 'Summary', id: 'event', dropDown: false, active: false},
           {to: '/trialData/ae/summary_table', label: 'Cycle Summary', id: 'event', dropDown: false, active: false},
           {dropDown: false, separator: true},
           {to: '/trialData/ae/summary', label: 'Time Plot', id: 'event', dropDown: false, active: false},
           {to: '/trialData/ae/cycle_plot', label: 'Cycle Plot', id: 'event', dropDown: false, active: false},
           {to: '/trialData/ae/survival', label: 'Time to First Event', id: 'event', dropDown: false, active: false},
           {dropDown: false, separator: true},
           {to: '/trialData/ae/addae', label: 'Add Adverse Event', id: 'event', dropDown: false, active: false}
         ]},
         {label: "Treatment", id: 'treatment', dropDown: true, active: false, subLinks: [
           {to: '/trialData/treatment/patient', label: 'Patient Level', id: 'treatment', dropDown: false, active: false},
           {to: '/trialData/treatment/table', label: 'Summary', id: 'treatment', dropDown: false, active: false}
         ]}
       ]
     }
     this.updateActive = this.updateActive.bind(this)
   }

   updateActive(id, event) {
     console.log(id);
     var links = this.state.links
     links.forEach(l => l.active = false)
     links.find(l => l.id === id).active = true
     this.setState({links: links})
   }

   removeActive() {
     var links = this.state.links
     links.forEach(l => l.active = false)
     this.setState({links: links})
   }


  render() {

    const links = this.state.links.map((l,i) => {
      if(l.dropDown){
        const subLinks = l.subLinks.map((s,j) => {
          if(s.separator) {
            return <li key={j} role="separator" class="divider"></li>
          } else {
            return <NavLink key={j} {...s} updateActive={this.updateActive}/>
          }
        })

        return <li key={i} className={`nav-item dropdown show${l.active ? " active":""}`}><a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#">{l.label}<span className="caret"></span></a>
          <ul className="dropdown-menu">
            {subLinks}
          </ul>
        </li>
      } else {
        return <NavLink key={i} {...l} updateActive={this.updateActive}/>
      }
    })

    return <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/" onClick={this.removeActive}>Toxicity</Link>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                {links}
              </ul>
              <ul className="nav navbar-nav navbar-right">
              </ul>
            </div>
          </div>
        </nav>


  }
}




export default Menu
