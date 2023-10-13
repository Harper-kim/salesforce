import { LightningElement, track, wire } from 'lwc';
import generateData from '@salesforce/apex/OpportunityController.generateData';
import searchOpp from '@salesforce/apex/OpportunityController.searchOpp';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import recentlyView from '@salesforce/apex/OpportunityController.recentlyView';

import deleteOpportunitys from '@salesforce/apex/OpportunityController.deleteOpportunitys';
import updateOpportunitys from '@salesforce/apex/OpportunityController.updateOpportunitys';
import Name from '@salesforce/schema/Account.Name';

import {refreshApex} from '@salesforce/apex';

const ACTIONS = [{label: 'Edit', value: 'edit'},
                {label: 'Delete', value: 'delete'}]

const columns = [
    {label: 'Name', fieldName: 'link', type: 'url', typeAttributes: { label: {fieldName: 'Name'}}},
    {label: 'Account', fieldName: "AccountLink", type: 'url', typeAttributes: {label: {fieldName: 'AccountName'}}},
    //{label: 'Account', fieldName: "AccountId", type: 'text'},
    {label: 'Amount', fieldName: 'Amount', type: 'currency'},
    {label: 'Stage', fieldName: 'StageName', type: 'text'},
    {label: 'userName', fieldName: 'UserName__c', type: 'text'},
    {label: 'closeDate', fieldName: 'CloseDate'},
    {fieldName: 'actions', type: 'action', typeAttributes: {rowActions: ACTIONS}}
];


export default class OpportunityListView extends LightningElement {
    oppdata;
    columns = columns;
    baseData;
    error;
    wiredOpportunitys;
    selectedOpportunitys;

    
    @track isshowModal = false;
    @track isEditForm = false;
    @track rocord = [];
    @track currentRecordId;

    refreshTable;

    value = 'all';
    filterOptions = [
        {label: 'All Opportunity', value: 'all'},
        {label: 'Recently Viewed', value: 'recent'}
    ]
    

    //전체데이터 불러오기
    async connectedCallback(){
      await this.viewAll();
     }

    //전체보기
    async viewAll(){
        const result = await generateData();
        this.refreshTable = result;
        this.oppdata = result.map(row => {
            return this.mapOpps(row);
        }) 
    }
    //검색된 데이터만 보기
    async search(){
        const searchOppos = await searchOpp({searchString: event.target.value});
        this.oppdata = searchOppos.map(row =>{
            return this.mapOpps(row);
        });
    }

    //최근 본 데이터
    async viewRecent(){
        const result = await recentlyView();
        this.oppdata = result.map(row => {
            return this.mapOpps(row);
        });
    }

    //필터
    async handleFilterChange(event){
        console.log(event.target.value);
        //this.selectedFilter = event.target.value;
        this.value = event.target.value;
        if(this.value == 'recent'){
            await this.viewRecent();
        }else if(this.value == 'all'){
            await this.viewAll();
        }
    }

     //매핑시켜주는 
     mapOpps(row){
        var accountName = '';
        var accountLink = '';
        if(row.AccountId != undefined){
            accountLink = `/${row.AccountId}`;
            accountName = row.Account['Name'];
        }
        return {...row,
            Name: row.Name,
            link: `/${row.Id}`,
            AccountLink: accountLink,
            AccountName: accountName
        };
    }

    //검색
    async handleSearch(event){
        //이벤트가 발생하지 않았을 때 
        if(!event.target.value){
            await this.viewAll();
        }else{
            console.log(event.target.value);
            await this.search();
        }
    }

    //new모달창 열기
    showModalBox(currentRow){
        this.isshowModal = true;
        this.isEditForm = false;
        this.record = currentRow;
        
    }

    //new모달창 닫기
    closeModalBox(){
        this.isshowModal = false;
    }

    //edit모달 열기
    editModalBox(currentRow){
        this.isEditForm = true;
    }
    //edit모달창 닫기
    editCloseModalBox(){
        this.isEditForm = false;
    }

    handlerefresh() {
        return refreshApex(this.refreshTable);
    }

    //New에서 Save할 경우
    handleSuccess(event){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회가 생성되었습니다',
                variant: 'success'
            })
        );
        this.closeModalBox(event);
    }


    //편집 삭제 handler
    async handleRowAction(event){
        if(event.detail.action.value == 'delete'){
            await deleteOpportunitys({OppIds: [event.detail.row.Id]});
            this.deleteOpps();
        }
        else if(event.detail.action.value == 'edit'){
            this.editModalBox();
            this.editOpps();
        }
    }

    //삭제
    deleteOpps() {  
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회를 삭제하였습니다.',
                variant: 'success'
        }),);
    }

    //편집
    editOpps(event){
        event.preventDefault();
        this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
        this.isshowModal = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회가 업데이트되었습니다',
                variant: 'success'
            })
        );    
    }

    handleRowAction(event){
        const row = event.detail.row;
        this.record = row;
        this.isshowModal = true;
        this.editCurrentRecord(row);
    }
    editCurrentRecord(currentRow){
        this.currentRecordId = currentRow.Id;
    }

    

    // //삭제
    // deleteOpps(oppName) {
    //     let oppRecord = [];
    //     oppRecord.push(oppName.Id);
    //     deleteOpportunitys({OppIds: oppRecord})
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Success',
    //                 message: '리드를 삭제하였습니다.',
    //                 variant: 'success'
    //     }),);
    // }

    // //편집 삭제 handler
    // handleRowAction(event){
    //     let actionName = event.detail.action.name;
    //     //console.log('actionName : ' +actionName);
    //     let row = event.detail.row;
    //     //console.log('row : '+row);
    //     switch(actionName){
    //         case 'edit':
    //             this.editCurrentRecord(row);
    //             break;
    //         case 'delete':
    //             this.deleteOpps(row);
    //             break;
    //     }
    // }

    



    

    


  



    



    
}