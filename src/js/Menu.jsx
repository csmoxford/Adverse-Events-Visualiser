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
         {to: '/ae/load', label: 'Load', id: 'load', dropDown: false, active: false},
         {label: "Event Level", id: 'event', dropDown: true, active: false, subLinks: [
           {to: '/ae', label: 'Adverse Event Level', id: 'event', dropDown: false},
           {to: '/ae/pt', label: 'Patient Level', id: 'event', dropDown: false},
           {to: '/ae/key', label: 'Graph Key', id: 'event', dropDown: false},
         ]},
          {label: "Table", id: 'table', dropDown: true, active: false, subLinks: [
           {to: '/ae/table', label: 'Table', id: 'table', dropDown: false, active: false},
           {to: '/ae/summary_table', label: 'Summary: Table', id: 'table', dropDown: false, active: false}
         ]},
         {label: "Aggregated plot", id: 'plot', dropDown: true, active: false, subLinks: [
           {to: '/ae/cycle_plot', label: 'Cycle Plot', id: 'plot', dropDown: false, active: false},
           {to: '/ae/summary', label: 'Time Plot', id: 'plot', dropDown: false, active: false},
           {to: '/ae/survival', label: 'Time to First Event', id: 'plot', dropDown: false, active: false}
         ]},
         {to: '/ae/addae', label: 'Add event', id: 'addevent', dropDown: false, active: false},
         {to: '/ae/PatientView', label: 'Test', id: 'bloods', dropDown: false, active: false},
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
        const subLinks = l.subLinks.map((s,i) => <NavLink key={i} {...s} updateActive={this.updateActive}/>)

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
