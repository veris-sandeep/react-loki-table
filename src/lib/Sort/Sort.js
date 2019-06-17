import React,{Component} from 'react'
import classes from './Sort.module.css'
import Button from '../Button/Button'

class Sort extends Component{
    state={
      showSortMenu:false
    }

    render(){
      return(
        <div>
        <div 
          style={{display: this.state.showSortMenu?"block":"none"}}
          className={classes.Backdrop}
          onClick={()=>{this.setState({showSortMenu: false})}}  
        ></div>
        <div className={classes.Sort}>  
        <Button 
          icon="fa-sort"
          onClick={()=>{this.setState({showSortMenu:!this.state.showSortMenu})}}
        />
        <div className={classes.SortMenu} style={{display: this.state.showSortMenu?"block":"none"}}>
              <ul>
                {this.props.sortBy.map((filter)=>{
                  return (
                    <li
                      onClick={()=>{this.props.handleSort(filter)}}
                      style={{backgroundColor : this.props.sort.key===filter?"rgba(241, 241, 241, 0.7)":null}}
                    >
                      <p>{filter[0].toUpperCase()+filter.slice(1)}</p>
                      {this.props.sort.key===filter?this.props.sort.desc?<i class="fa fa-sort-desc" aria-hidden="true"></i>:<i class="fa fa-sort-asc" aria-hidden="true"></i>:null}
                    </li>
                  )
                })}

              </ul>
          </div>
        </div>
      </div>
    )
    }
  
}

export default Sort
