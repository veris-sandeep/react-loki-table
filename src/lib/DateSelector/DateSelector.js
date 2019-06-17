import React,{Component} from 'react'
import classes from './DateSelector.module.css'

class Search extends Component {
    state={
        startDate:null,
        endDate:null
    }

    setStartDate=(event)=>{
        this.setState({
            startDate: new Date(event.target.value).getTime()
        },()=>{
            if(this.state.startDate){
                if(this.state.endDate){
                    this.props.handleFilters(
                        'date',{created: {'$between':[this.state.startDate,this.state.endDate]}}
                    )
                }
                else{
                    this.props.handleFilters(
                        'date',{created: {'$gte': this.state.startDate}}
                    )
                }
            }
            else{
                if(this.state.endDate){
                    this.props.handleFilters(
                        'date',{created: {'$lte':this.state.endDate}}
                    )
                }
                else{
                    this.props.handleFilters(
                        'date',{}
                    )
                }
            }
        }) 
    }
    setEndDate=(event)=>{
        this.setState({
            endDate: new Date(event.target.value).getTime() + 86399999
        },()=>{
            if(this.state.endDate){
                if(this.state.startDate){
                    this.props.handleFilters(
                        'date',{created: {'$between':[this.state.startDate,this.state.endDate]}}
                    )
                }
                else{
                    this.props.handleFilters(
                        'date',{created: {'$lte': this.state.endDate}}
                    )
                }
            }
            else{
                if(this.state.startDate){
                    this.props.handleFilters(
                        'date',{created: {'$gte':this.state.startDate}}
                    )
                }
                else{
                    this.props.handleFilters(
                        'date',{}
                    )
                }   
            }
        }) 
    }

    render(){
        return(
            <div className={classes.DateSelector}>
                <input onChange={(event)=>{this.setStartDate(event)}} type="date"></input>
                <input onChange={(event)=>{this.setEndDate(event)}} type="date"></input>
            </div>
        )
    }
}

export default Search