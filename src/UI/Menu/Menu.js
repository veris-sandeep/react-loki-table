import React,{Component} from 'react'
import classes from './Menu.module.css'

class Menu extends Component{
    state={
        show:false,
        location:true
    }
    getLocation=(event)=>{
        event.stopPropagation()
        let offset = window.innerHeight-event.clientY-this.props.height-10
        this.setState({
            show:true,
            location: offset>0?true:false
        })
    }
    render(){
        let style={}
        if(this.state.location){
            style={
                top:30
            }
        }
        else{
            style={
                bottom:30
            }
        }
        return(
            <div className={classes.Container}>
            <div style={{display: this.state.show?"block":"none" }} onClick={(event)=>{event.stopPropagation(); this.setState({show: false})}} className={classes.Backdrop}></div>
            <div className={classes.Dots} style={{color:this.state.show?"#02abfe":"black",cursor: "pointer" }}  onClick={(event)=>this.getLocation(event)}><i class="fa fa-ellipsis-h" aria-hidden="true"></i></div>
            <div onClick={(event)=>{event.stopPropagation(); this.setState({show: false})}} style={{display: this.state.show?"block":"none",...style}} className={classes.Menu}>
                <ul>
                    <li><i class="fa fa-pencil" aria-hidden="true"></i> Edit Member</li>
                    <li><i class="fa fa-trash" aria-hidden="true"></i>Remove Member</li>
                    <li><i class="fa fa-files-o" aria-hidden="true"></i> Map Group</li>
                </ul>
        </div>
        </div>
        )
    }
}

export default Menu