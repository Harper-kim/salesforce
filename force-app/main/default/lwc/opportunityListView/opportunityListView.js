import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import generateData from '@salesforce/apex/OpportunityController.generateData';

import recentlyView from '@salesforce/apex/OpportunityController.recentlyView';
import searchOpp from '@salesforce/apex/OpportunityController.searchOpp';

import insertRecord from '@salesforce/apex/OpportunityController.insertRecord';
import deleteOpportunitys from '@salesforce/apex/OpportunityController.deleteOpportunitys';
import getOppInfo from '@salesforce/apex/OpportunityController.getOppInfo';
import updateOpportunitys from '@salesforce/apex/OpportunityController.updateOpportunitys';

import { NavigationMixin } from 'lightning/navigation';
import {refreshApex} from '@salesforce/apex';

const ACTIONS = [{label: 'edit', value: 'edit'},
                {label: 'delete', value: 'delete'}]

const columns = [
    {label: 'Name', fieldName: 'link', type: 'url', typeAttributes: { label: {fieldName: 'Name'}}},
    {label: 'Account', fieldName: "AccountLink", type: 'url', typeAttributes: {label: {fieldName: 'AccountName'}}},
    {label: 'Amount', fieldName: 'Amount', type: 'currency'},
    {label: 'Stage', fieldName: 'StageName', type: 'text'},
    {label: 'userName', fieldName: 'UserName__c', type: 'text'},
    {label: 'closeDate', fieldName: 'CloseDate'},
    {fieldName: 'actions', type: 'action', typeAttributes: {rowActions: ACTIONS}}
];


export default class OpportunityListView extends NavigationMixin(LightningElement) {
    oppdata;
    columns = columns;
    baseData;
    error;
    wiredOpportunitys;
    selectedOpportunitys;

    
    @track isshowModal = false;
    @track isEditModal = false;


    @track Name;
    @track StageName;
    @track CloseDate;


    //필터
    value = 'all';
    filterOptions = [
        {label: 'All Opportunity', value: 'all'},
        {label: 'Recently Viewed', value: 'recent'}
    ]

    //새로만들기 stageName 옵션
    options = [
        {label: 'closedWon', value: 'closedWon'},
        {label: 'closedLost', value: 'closedLost'}
    ]
    
    //새로 만들기
    handleNameChange(event){
        this.Name = event.target.value;
    }

    handleStageNameChange(event){
        this.StageName = event.target.value;
    }

    handleCloseDateChange(event){
        this.CloseDate = event.target.value;
    }

    //새로 만들기
    createOpp(){
        insertRecord({
            name : this.Name,
            stageName: this.StageName,
            closeDate: this.CloseDate
        })
        .then(result => {
           this.handleSuccess();
        })
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
    

    //전체데이터 불러오기
     connectedCallback(){
       this.viewAll();
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
     search(){
        const searchOppos =  searchOpp({searchString: event.target.value});
        this.oppdata = searchOppos.map(row =>{
            return this.mapOpps(row);
        });
    }

    //최근 본 데이터
     viewRecent(){
        const result =  recentlyView();
        this.oppdata = result.map(row => {
            return this.mapOpps(row);
        });
    }

    //필터
     handleFilterChange(event){
        console.log(event.target.value);
        //this.selectedFilter = event.target.value;
        this.value = event.target.value;
        if(this.value == 'recent'){
             this.viewRecent();
        }else if(this.value == 'all'){
             this.viewAll();
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
     handleSearch(event){
        //이벤트가 발생하지 않았을 때 
        if(!event.target.value){
             this.viewAll();
        }else{
            console.log(event.target.value);
             this.search();
        }
    }

    //new모달창 열기
    showModalBox(){
        this.isshowModal = true;
    }

    //new모달창 닫기
    closeModalBox(){
        this.isshowModal = false;
    }

    //edit모달 열기
    editModalBox(){
        this.isEditModal = true;
    }
    //edit모달창 닫기
    editCloseModalBox(){
        this.isEditModal = false;
    }


    //편집 삭제 handler
     handleRowAction(event){
        
        if(event.detail.action.value == 'delete'){
             deleteOpportunitys({OppIds: [event.detail.row.Id]});
            this.deleteOpps();
        }
        else if(event.detail.action.value == 'edit'){
            const response =  getOppInfo({opportunityId : event.detail.row.Id});
                this.id = response.Id;
                this.Name = response.Name;
                this.StageName = response.StageName;
                this.CloseDate = response.CloseDate;
            this.editModalBox();
        }
    }

    //삭제 메세지
    deleteOpps() {  
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회를 삭제하였습니다.',
                variant: 'success'
        }),);
    }

    

    //편집 메세지
    editOpps(){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회를 업데이트하였습니다.',
                variant: 'success'
            }),);
    }

    //상세 페이지로 이동
    // navigateToOpportunityDetail(opportunityId) {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__recordPage',
    //         attributes: {
    //             recordId: opportunityId,
    //             objectApiName: 'Opportunity',
    //             actionName: 'view'
    //         }
    //     });
    // }
    
}