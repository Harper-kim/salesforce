import { LightningElement,track,api } from 'lwc';
import tireData from '@salesforce/apex/TireController.tireData';
import searchOpp from '@salesforce/apex/TireController.searchOpp';
import updateProduct from '@salesforce/apex/TireController.updateProduct';
import getproInfo from '@salesforce/apex/TireController.getproInfo';

const ACTIONS = [{label: 'edit', value: 'edit'}]

const colums = [
    {label: 'Material__c', fieldName: 'Material__c', type: 'text'},
    {label: 'Description__c', fieldName: 'Description__c', type: 'text'},
    {label: 'Description2__c', fieldName: 'Description2__c', type: 'text'},
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
    {label: 'Name', fieldName: 'link', type: 'url', typeAttributes: { label: {fieldName: 'Name'}}},
    {fieldName: 'actions', type: 'action', typeAttributes: {rowActions: ACTIONS}}
]

export default class CarlistView extends LightningElement {
    @api recordId;
    @api objectName;

    @track data;
    colums = colums;


    @track isEditModal = false;


    //전체데이터 불러오기
    async connectedCallback(){
        await this.tireAll();
    }
  
      //전체보기
      async tireAll(){
          const result = await tireData();
          this.data = result.map(row => {
              return this.mapProducts(row);
          }) 
      }

      //매핑시켜주는 
      mapProducts(row){
        return {...row,
            Name: row.Name,
            link: `/${row.Id}`,
        };
    }

    //edit모달 열기
    editModalBox(){
        this.isEditModal = true;
    }
    //edit모달창 닫기
    editCloseModalBox(){
        this.isEditModal = false;
    }

    //검색
    async handleSearch(event){
        if(event.target.value){
            console.log(event.target.value);
            await this.search();
        }
        else{
            await this.tireAll();
        }
    }

    //검색된 데이터만 보기
    async search(){
        const searchOpps = await searchOpp({searchString: event.target.value});
        this.data = searchOpps.map(row =>{
            return this.mapProducts(row);
        });
    }

    async handleRowAction(event){
        if(event.detail.action.value == 'edit'){
            const response = await getproInfo({productId : event.detail.row.Id});
                this.id = response.Id;
                this.Name = response.Name;
                this.Description__c = response.Description__c;
                this.Description2__c = response.Description2__c;
            this.editModalBox();
        }
    }

    async handleSave(event){
        const row = event.detail.row;
        await updateProduct({
           ProductId : row.Id,
           Description: row.Description__c,
           Description2: row.Description2__c
        });
        this.editOpps();
    }
    
    //편집
    editOpps(){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회를 업데이트하였습니다.',
                variant: 'success'
            }),);
            this.editCloseModalBox();
    }

}