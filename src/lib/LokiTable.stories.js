import React from 'react';
import {storiesOf} from '@storybook/react';
import { action } from '@storybook/addon-actions';

import classes from '../App.module.css'
import Menu from '../UI/Menu/Menu'
import CustomCheckbox from '../UI/CustomCheckbox/CustomCheckbox'
import axios from 'axios'
import LokiTable from './index.js'
import { addDecorator } from '@storybook/react/dist/client/preview';

const columns = [{
    width: 40,
    resizable: false,
    sortable: false
  },{
    id: 'select',
    resizable: false,
    sortable: false,
    minWidth: 40,
    Header: <CustomCheckbox/>,
    accessor: props=>props,
    Cell: props => <CustomCheckbox />
  },{
    id: 'memberName',
    Header: 'Member',
    minWidth: 200,
    sortable: false,
    accessor: props=>props,
    Cell: props =><div className="member">
                        <p className={classes.MemberName}>{props.value.name}</p>
                        <p className={classes.MemberDesignation}>{props.value.designation} | {props.value.department}</p>
                      </div>
  },{
    id: 'contactDetails',
    Header: 'Contact Details',
    accessor: props=>props,
    sortable: false,
    Cell: props =><div>
                    <p>{props.value.phone}</p>
                    <p>{props.value.email}</p>
                  </div>
  },{
    id: 'gender',
    Header: 'Gender',
    sortable: false,
    accessor: props=>props,
    Cell: props =><div className="created">
                    <p>{props.value.gender}</p>
                  </div>
  },{
    id: 'memberType',
    Header: 'Member Type',
    sortable: false,
    accessor: props=>props,
    Cell: props =><div>
                    <p>{props.value.type}</p>
                  </div>
  },{
    id: 'group',
    Header: 'Group',
    sortable: false,
    accessor: props=>props,
    Cell: props =><div>
                        <p>{props.value.group}</p>
                      </div>
  },{
    id: 'dots',
    width: 40,
     sortable: false,
    accessor: props=>props,
    Cell: props=><Menu height={134}/>,
  },{
    width: 40,
    resizable: false,
    sortable: false
  }]

storiesOf('LokiTable', module)
    .addDecorator(story => <div style={{ padding: '3rem' }}>{story()}</div>)
    .add('Default', () => 
    
    <LokiTable 
  columns={columns}
  dbName="logs"
     
  sortKey="created"
  interval={5000}
  searchBy={["department", "designation", "created", "group", "email", "phone", "name", "gender", "type", "id"]}
  sortBy={["department", "designation", "created", "group", "email", "phone", "name", "gender", "type", "id"]}

  getData={async (sortKey)=>{
      let response = await axios.get(`https://r49s5gk7z3.execute-api.us-east-1.amazonaws.com/faker?created=${sortKey}`) 
        return response.data.Items.map(item=>{
            return {
            department: item.department.S,
            designation: item.designation.S,
            created: item.created.S,
            group: item.group.S,
            email: item.email.S,
            phone: item.phone.S,
            name: item.name.S,
            gender: item.gender.S,
            type: item.type.S,
            id: item.id.N,
          }
      })        
  }}
/>)
