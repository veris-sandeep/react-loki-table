import React,{Component} from 'react'
import './Search.css'

class Search extends Component {
    state={
        value:"",
        dropdown:false,
        filter: "name"
    }

    handleChange=(event)=>{
        if(event.target.value){
            this.setState({value: event.target.value})
        }
        else{
            this.setState({value: event.target.value},()=>{this.handleSearch()})
            
        }
    }
    handleEnter=(event)=>{
        if(event.key==="Enter"){
            this.setState({value: event.target.value,},()=>{this.handleSearch()})
            // this.handleSearch()
        }
    }
    handleSearch=()=>{
        let filter={}
        filter[this.state.filter]={ '$regex':  [new RegExp('^.*'+this.state.value+'.*$'),'i']}
        this.props.handleFilters('search', filter)}
    
    render(){
        return(
            <div className="Search">
                <input onKeyPress={(event)=>{this.handleEnter(event)}} type="text" placeholder="Search Member..." onChange={(event)=>{this.handleChange(event)}}></input>
                <div>
                <div className="select">
                    <div onClick={()=>{this.setState({dropdown: !this.state.dropdown})}}>
                        {this.state.filter[0].toUpperCase()+this.state.filter.slice(1)}
                        {this.state.dropdown?
                        <i class="fa fa-caret-up" style={{fontSize: "20px"}}></i>
                        : <i class="fa fa-caret-down" style={{fontSize: "20px"}}></i>}
                    </div>
                <ul style={{display: this.state.dropdown?"block ":"none"}}>
                    {
                        this.props.searchBy.map((filter)=>{
                            return <li onClick={()=>{this.setState({dropdown: false, filter:filter})}}>{filter[0].toUpperCase()+filter.slice(1)}</li>        
                        })
                    }
                </ul>
                </div>
                
                </div>
                <button type="submit" className="Button" onClick={this.handleSearch}>
                    <i className="fa fa-search" aria-hidden="true"></i> Search 
                </button>
            </div>
        )
    }
}

export default Search