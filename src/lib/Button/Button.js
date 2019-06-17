import React from 'react'
import classes from './Button.module.css'

const button=(props)=>{
    return(
        <div 
            className={classes.Button}
            onClick={()=>{props.onClick()}}
            >
                <i className={["fa",props.icon].join(" ")} aria-hidden="true"></i>
        </div>
    )
}

export default button
