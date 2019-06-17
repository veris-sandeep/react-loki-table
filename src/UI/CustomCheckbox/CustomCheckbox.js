import React from 'react'
import classes from './CustomCheckbox.module.css'

const customCheckbox=(props)=>{
    return (
        <div className={classes.CheckboxContainer}>
            <label>
                <input type="checkbox" checked={props.checked}></input>
                <span className={classes.Checkmark}></span>
            </label>
        </div>
    )
}

export default customCheckbox