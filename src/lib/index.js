import React, {Component} from 'react';
import 'react-table/react-table.css'
import './LokiTable.css';

import loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter'  
import ReactTable from 'react-table' 
import Search from './Search/Search'
import DateSelector from "./DateSelector/DateSelector"
import LoadDataIndicator from "./LoadDataIndicator/LoadDataIndicator"
import Button from "./Button/Button"
import Sort from "./Sort/Sort"

class OfflineTable extends Component{
  state={
    data:[],
    loadData: false,
    page:0,
    pageSize:10,
    totalRecords:null,
    sort:{key:"created",desc:true},
    filters:{
      search:{},
      date:{}
    }
  }

  collection=null

  databaseInitialize=()=>{
      if (!this.db.getCollection(this.props.dbName)) {
        this.props.getData("")
        .then((data)=>{
          this.collection = this.db.addCollection(this.props.dbName)
          this.collection.insert(data)
          this.setState({
            data: data,
            totalRecords: data.length
          })
        })

        
        setInterval(()=>{
          let lastestRecord = this.collection.chain().simplesort("created", true).data()[0][this.props.sortKey]         
          this.props.getData(lastestRecord)
          .then((data)=>{
            if(data.length>0){
              this.collection.insert(data)
              this.setState({
                loadData: true
              })
            }
          })
        },this.props.interval)

      }
      else{
        this.collection = this.db.getCollection(this.props.dbName)
        let records = this.collection.chain().simplesort(this.state.sort.key, this.state.sort.desc)
        this.setState({
          data: records.limit(this.state.pageSize).data(),
          totalRecords: records.count()
        })
        setInterval(()=>{
          let lastestRecord = this.collection.chain().simplesort("created", true).data()[0][this.props.sortKey]         
          this.props.getData(lastestRecord)
          .then((data)=>{
            if(data.length>0){
              this.collection.insert(data)
              this.setState({
                loadData: true
              })
            }
          })
        },this.props.interval)
      }
    }

    handleNext=()=>{
      if((this.state.page+1)<Math.ceil(this.state.totalRecords/this.state.pageSize)){
        let data = this.collection.chain().find({...this.state.filters.search,...this.state.filters.date}).simplesort(this.state.sort.key, this.state.sort.desc).offset((this.state.page+1)*this.state.pageSize).limit(this.state.pageSize).data()
        this.setState({
          data: data,
          page: this.state.page+1
        })
      }
    }

    handleSort=(key)=>{
      let sort = this.state.sort;
      if(sort.key===key){
        this.setState({
          sort: {...this.state.sort, desc: !this.state.sort.desc}
        },()=>{
          this.handleFilters({})
       })
      }
      else{
        this.setState({
          sort:{key:key,desc:true}
        },()=>{
          this.handleFilters({})
        })
      }
    }

    handlePrevious=()=>{
        if(this.state.page-1>=0){
          let data = this.collection.chain().find({...this.state.filters.search,...this.state.filters.date}).simplesort(this.state.sort.key, this.state.sort.desc).offset((this.state.page-1)*this.state.pageSize).limit(this.state.pageSize).data()
          this.setState({
            data: data,
            page: this.state.page-1
          })
        }
    }

    handleFilters=(type,filter)=>{
      let filters={...this.state.filters}
      filters[type]=filter
      let records = this.collection.chain().find({...filters.search,...filters.date}).simplesort(this.state.sort.key, this.state.sort.desc)
      console.log(records)
      this.setState({
        page:0,
        data:records.limit(this.state.pageSize).data(),
        filters: filters,
        totalRecords: records.count()
      })
    }

    loadData=()=>{
      let records = this.collection.chain().simplesort(this.state.sort.key, this.state.sort.desc)
      this.setState({
        data:records.limit(this.state.pageSize).data(),
        totalRecords: records.count(),
        loadData: false,
      })
    }
  
    db = new loki("veris.db", { 
      env: 'BROWSER',
      adapter: new LokiIndexedAdapter(),
      autoloadCallback : this.databaseInitialize,
      autoload: true,
      autosave: true, 
      autosaveInterval: 4000
    });
      
    render(){
      return(
        <div className="LokiTable">
          <div className="searchControls"> 
            <Search searchBy={this.props.searchBy} handleFilters={this.handleFilters}/>
            <DateSelector handleFilters={this.handleFilters} />
          </div>     
          <LoadDataIndicator loadData={this.loadData} show={this.state.loadData}/>
          <div className="controlsContainer">
            <div className="controls">
                <div className="pageControl">
                  {this.state.totalRecords?
                    <p>
                      {`${(this.state.page*this.state.pageSize)+1}-${((this.state.page+1)*this.state.pageSize)>this.state.totalRecords?this.state.totalRecords:((this.state.page+1)*this.state.pageSize)} of ${this.state.totalRecords}`}
                    </p>
                  :null}     
                  <Button 
                    icon="fa-angle-left"
                    onClick={this.handlePrevious}
                  />
                  <Button 
                    icon="fa-angle-right"
                    onClick={this.handleNext}
                  />
                  <Sort
                    sortBy={this.props.sortBy}
                    sort={this.state.sort}
                    handleSort={this.handleSort}
                  />
                </div>
            </div>
          </div>
          <ReactTable
            {...this.props}
            data={this.state.data}
            defaultPageSize={this.state.pageSize}
            loading={!this.state.data.length>0}
            showPagination={false}
          />
        </div>
      )
    } 
}
 
export default OfflineTable;
