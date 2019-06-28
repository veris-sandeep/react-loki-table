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
    view = null

    connectWorker=()=>{
        var msg_chan = new MessageChannel();
        msg_chan.port1.onmessage = (event)=>{
        if(!event.data.error){
            this.setState({
                loadData: true
            })
        }
        };
        navigator.serviceWorker.controller.postMessage("Create Message Tunnel", [msg_chan.port2]);
    }

 
    databaseInitialize=()=>{
        if (!this.db.getCollection("logs")) {
            this.collection = this.db.addCollection("logs");
            this.view = this.collection.addDynamicView('logs');
            this.props.getData("")
            .then((data)=>{
                this.collection.insert(data)
                this.setState({
                    data: data,
                    totalRecords: data.length
                })
                this.connectWorker()
            })
        }
        else{
            this.collection = this.db.getCollection("logs")
            this.view = this.collection.addDynamicView('logs');
            let records = this.collection.chain().simplesort(this.state.sort.key, this.state.sort.desc)
            this.setState({
                data: records.limit(this.state.pageSize).data(),
                totalRecords: records.count()
            })
            this.connectWorker()
            }
    }

    db = new loki("veris.db", {
        adapter: new LokiIndexedAdapter('veris.db'),
        autoload: true,
        autoloadCallback : this.databaseInitialize,
    });

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
                }
            )
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
        this.setState({
            page:0,
            data:records.limit(this.state.pageSize).limit(this.state.pageSize).data(),
            filters: filters,
            totalRecords: records.count()
        })
    }

    loadData=()=>{
        this.db.loadDatabase({},()=>{
            this.collection = this.db.getCollection("logs")
            let records = this.collection.chain().simplesort(this.state.sort.key, this.state.sort.desc)
            this.setState({
                data:records.limit(this.state.pageSize).limit(this.state.pageSize).data(),
                totalRecords: records.count(),
                loadData: false,
            })
        })
    }
      
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
