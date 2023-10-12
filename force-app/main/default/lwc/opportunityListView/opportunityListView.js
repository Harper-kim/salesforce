import { LightningElement, track, wire } from 'lwc';
import generateData from '@salesforce/apex/OpportunityController.generateData';
import searchOpp from '@salesforce/apex/OpportunityController.searchOpp';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import recentlyView from '@salesforce/apex/OpportunityController.searchOpp';


const columns = [
    {label: 'Name', fieldName: 'link', type: 'url', typeAttributes: { label: {fieldName: 'Name'}}},
    {label: 'Account', fieldName: "AccountLink", type: 'url', typeAttributes: {label: {fieldName: 'AccountName'}}},
    //{label: 'Account', fieldName: "AccountId", type: 'text'},
    {label: 'Amount', fieldName: 'Amount', type: 'currency'},
    {label: 'Stage', fieldName: 'StageName', type: 'text'},
    {label: 'userName', fieldName: 'UserName__c', type: 'text'},
    {label: 'closeDate', fieldName: 'CloseDate'}
];


export default class OpportunityListView extends LightningElement {
    oppdata;
    columns = columns;
    baseData;
    error;
    wiredOpportunitys;

    @track isshowModal = false;

    filterOptions = [
        {label: 'All Opportunity', value: 'all'},
        {label: 'Recently Viewed', value: 'recent'}
    ]
    
    // //실행할 때 순차적으로 하려고 사용connectedCallback
    // connectedCallback() {
    //     //this.contactsWire();
    //     this.loadData();
    // }

    // loadData(){
    //     return generateData()
    //     .then(result => {
    //         this.data = result.data.map((row) => {
    //             return this.mapOpps(row);
    //         })
    //         console.log('this.data' +this.data);
    //         this.baseData = this.data;
    //         console.log('this.baseData' +this.baseData);
    //         //this.error = undefined;
    //     })
    //     .catch(error => {
    //         this.error = error;
    //         this.data = undefined;
    //     })
    // }

    //전체데이터 불러오기
    async connectedCallback(){
      await this.viewAll();
     }

    //전체보기
    async viewAll(){
        const result = await generateData();
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

    async viewRecent(){
        const recent = await recentlyView();
        this.oppdata = recent.map(row => {
            return this.mapOpps(row);
        });
    }

    handleFilterChange(event){
        this.selectedFilter = event.target.value;
        if(this.selectedFilter == 'recent'){
            this.viewRecent();
        }else{
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
    async handleSearch(event){
        if(!event.target.value){
            await this.viewAll();
        }else{
            console.log(event.target.value);
            await this.search();
        }
    }
    
    //모달창 열기
    showModalBox(){
        this.isshowModal = true;
    }

    //모달창 닫기
    closeModalBox(){
        this.isshowModal = false;
    }
    
    //New에서 Save할 경우
    handleSuccess(event){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '리드가 생성되었습니다',
                variant: 'success'
            })
        );
        this.closeModalBox(event);
    }

    



    
}