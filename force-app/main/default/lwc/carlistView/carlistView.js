import { LightningElement,track } from 'lwc';
import TireData from '@salesforce/apex/TireController.TireData';
import searchOpp from '@salesforce/apex/TireController.searchOpp';


const colums = [
    {label: 'Material__c', fieldName: 'Material__c', type: 'text'},
    {label: 'Desciption__c', fieldName: 'Desciption__c', type: 'text'},
    {label: 'Desciption2__c', fieldName: 'Desciption2__c', type: 'text'},
    {label: 'Type__c', fieldName: 'Type__c', type: 'text'},
    {label: 'Base_UOM__c', fieldName: 'Base_UOM__c', type: 'text'},
    {label: 'Net_Weight__c', fieldName: 'Net_Weight__c', type: 'text'},
    {label: 'Weight_Unit__c', fieldName: 'Weight_Unit__c', type: 'text'},
    {label: 'Division__c', fieldName: 'Division__c', type: 'text'},
    {label: 'Car_Type__c', fieldName: 'Car_Type__c', type: 'text'},
    {label: 'Brand__c', fieldName: 'Brand__c', type: 'text'},
    {label: 'Pattern__c', fieldName: 'Pattern__c', type: 'text'},
    {label: 'Sales_Pattern__c', fieldName: 'Sales_Pattern__c', type: 'text'},
    {label: 'S_Width__c', fieldName: 'S_Width__c', type: 'text'},
    {label: 'Tire_Type__c', fieldName: 'Tire_Type__c', type: 'text'},
    {label: 'Performance__c', fieldName: 'Performance__c', type: 'text'},
    {label: 'Name', fieldName: 'link', type: 'url', typeAttributes: { label: {fieldName: 'Name'}}}

]

export default class CarlistView extends LightningElement {
    @track data;
    colums = colums;

    // connectedCallback(){
    //     this.TireAll();
    // }

    // TireAll(){
    //     TireData()
    //     .then(result => {
    //         this.data = result;
    //     });
    // }

    // //검색
    // handleSearch(event){
    //     if(!event.target.value){
    //         this.TireAll();
    //     }else{
    //         console.log(event.target.value);
    //         this.search();
    //     }
    // }

    // search(){
    //     const searchOpps = searchOpp({searchString: event.target.value});
    //     this.data = searchOpps;
    //     console.log('searchOPps: ' +searchOpps);
    // }

    //전체데이터 불러오기
    async connectedCallback(){
        await this.TireAll();
       }
  
      //전체보기
      async TireAll(){
          const result = await TireData();
          this.data = result.map(row => {
              return this.mapOpps(row);
          }) 
      }

      //매핑시켜주는 
     mapOpps(row){
        return {...row,
            Name: row.Name,
            link: `/${row.Id}`,
        };
    }

    //검색
    async handleSearch(event){
        //이벤트가 발생하지 않았을 때 
        if(!event.target.value){
            await this.TireAll();
        }else{
            console.log(event.target.value);
            await this.search();
        }
    }

    //검색된 데이터만 보기
    async search(){
        const searchOpps = await searchOpp({searchString: event.target.value});
        this.data = searchOpps.map(row =>{
            return this.mapOpps(row);
        });
    }

    

}