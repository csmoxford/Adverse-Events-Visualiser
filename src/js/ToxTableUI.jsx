import React, { PureComponent } from 'react'
import {uniq, uniqBy} from 'lodash'
import {sum} from 'd3-array'
import './ToxTable.css'
import ToxTableAE from './ToxTableAE'
import ToxTableCategory from './ToxTableCategory'
import ToxTableKeyGroups from './ToxTableKeyGroups'
var $ = require('jquery')

const sortFunctions = [
  {
    id: "category",
    fun: (a,b) => {
      var val = 0
      if(a.category < b.category) {
        val = -1
      } else if(a.category > b.category) {
        val = 1
      }
      return val
    }
  },{
    id: "ae",
    fun: (a,b) => {
      var val = 0
      if(a.name < b.name) {
        val = -1
      } else if(a.name > b.name) {
        val = 1
      }
      return val
    }
  },{
    id: 'grade3',
    fun: (a,b) => {
      var val = 0
      if(a.total.count3 < b.total.count3) {
        val = 1
      } else if(a.total.count3 > b.total.count3) {
        val = -1
      } else if(a.total.count1 < b.total.count1) {
        val = 1
      } else if(a.total.count1 > b.total.count1) {
        val = -1
      }
      return val
    }
  },{
    id: 'grade1',
    fun: (a,b) => {
      var val = 0
      if(a.total.count1 < b.total.count1) {
        val = 1
      } else if(a.total.count1 > b.total.count1) {
        val = -1
      } else if(a.total.count3 < b.total.count3) {
        val = 1
      } else if(a.total.count3 > b.total.count3) {
        val = -1
      }
      return val
    }
  }
]

class ToxTableUI extends PureComponent {

  constructor(props){
     super(props)
     this.state = {
       sortFun: sortFunctions[0].fun,
       groupBy: "ae"
     }
   }

   updateSort() {
     var sortType = $('#tableSortType').val()
     this.setState({sortFun: sortFunctions.find(f => f.id == sortType).fun})
   }

   updateGroup() {
     this.setState({groupBy: $('#tableGroupBy').val()})
   }

  render() {
    var table = null
    if(this.state.groupBy == "ae") {
      table = <ToxTableAE
        sortFun={this.state.sortFun}
        {...this.props}
      />
  } else if(this.state.groupBy == "category") {
    table = <ToxTableCategory
      sortFun={this.state.sortFun}
      {...this.props}
    />
  } else if(this.state.groupBy == "keyGroups") {
    table = <ToxTableKeyGroups
      sortFun={this.state.sortFun}
      {...this.props}
    />
  }

    return <div>
      <div className="row">
      <div className="col-xs-3 col-xs-offset-3">
        <label htmlFor="tableSortType">Sort By</label><br/>
        <select id="tableSortType" className="selectpicker" onChange={this.updateSort.bind(this)}>
          <option value="category">Category</option>
          <option value="ae">Adverse Event Name</option>
          <option value="grade1">Grade 1-5</option>
          <option value="grade1">Grade 3-5</option>
        </select>
        <div style={{height: '20px'}}/>
      </div>
      <div className="col-xs-3">
        <label htmlFor="tableGroupBy">Group By</label><br/>
        <select id="tableGroupBy" className="selectpicker" onChange={this.updateGroup.bind(this)}>
          <option value="ae">Adverse Event Name</option>
          <option value="category">Category</option>
          {this.props.data.keyGroups !== undefined ? <option value="keyGroups">Key Groups</option>: null}
        </select>
        <div style={{height: '20px'}}/>
      </div>
      </div>
      {table}
  </div>
  }


}

export default ToxTableUI
