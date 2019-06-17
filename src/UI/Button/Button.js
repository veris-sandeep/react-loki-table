import React from 'react'
import classes from './Button.module.css'

const button=(props)=>{
    return(
        <button className={[classes.Button, classes[props.theme]].join(" ")}>
            {props.fa?<i className={["fa",props.fa].join(" ")} aria-hidden="true"></i>:null}
            {props.label}
        </button>
    )
}

export default button