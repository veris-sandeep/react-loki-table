import React from 'react';
import classes from './LoadDataIndicator.module.css'

const loadDataIndicator=(props)=>{
    return(
        <div 
            onClick={props.loadData} className={classes.LoadData}
            style={{
                display: props.show?"flex":"none",
                transform: "translate(-50%, 17px)"
            }}    
        >
            <div>
                Syncing Complete! Load Data  <i className="fa fa-refresh" aria-hidden="true"></i>
            </div>
        </div>
    )
}

export default loadDataIndicator