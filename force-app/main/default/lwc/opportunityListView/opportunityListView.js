import { LightningElement, track } from 'lwc';
import generateData from '@salesforce/apex/OpportunityController.generateData';
import searchOpp from '@salesforce/apex/OpportunityController.searchOpp';

const columns = [
    {label: 'Opportunity Name', fieldName: 'Name', type: 'url', typeAttributes: { label: {fieldName: 'Name'}, target: '__blank'}},
    {label: 'Account Name', fieldName: 'AccountId', type: 'text'},
    {label: 'Amount', fieldName: 'Amount', type: 'currency'},
    {label: 'Stage', fieldName: 'StageName', type: 'text'},
    {label: 'userName', fieldName: 'UserName__c', type: 'text'}
];


export default class OpportunityListView extends LightningElement {
    data = [];
    columns = columns;
    baseData;
    error;

    @track isshowModal = false;
    
    connectedCallback() {
        this.loadData();
    }

    loadData(){
        return generateData()
        .then(result => {
            this.data = result;
            this.baseData = this.data;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.data = undefined;
        })
    }

    //모달창 열기
    showModalBox(){
        this.isshowModal = true;
    }

    //모달창 닫기
    closeModalBox(){
        this.isshowModal = false;
    }

    mapOpps(row){
        var opportunityName = '';
        var opportunityLink = '';
        if(row,OpportunityId != undefined){
            opportunityLink = `/${row.OpportunityId}`;
            opportunityName = row.Opportunity['Name'];
        }

        return {...row,
            FullName: `${row.FirstName} ${row.LastName}`,
            link: `${row.Id}`,
            opportunityLink: opportunityLink,
            opportunityName: opportunityName,
    
        };
    }

    async handleSearch(event){
        if(event.target.value == ""){
            this.data = this.baseData
        }else if(event.target.value.length > 1){
            const searchOpps = await searchOpp({searchString: event.target.value})
            
            this.data = searchOpps.map(row => {
                return this.mapOpps(row);
            })
        }
    }

    
}