import { LightningElement,track, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import tireData from '@salesforce/apex/TireController.tireData';
import searchOpp from '@salesforce/apex/TireController.searchOpp';
import insertProduct from '@salesforce/apex/TireController.insertProduct';
import getproInfo from '@salesforce/apex/TireController.getproInfo';
import updateProduct from '@salesforce/apex/TireController.updateProduct';
import deleteProduct from '@salesforce/apex/TireController.deleteProduct';

const ACTIONS = [{label: 'edit', value: 'edit'},
                {label: 'delete', value: 'delete'}]

const columns = [
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
    @track data;
    columns = columns;

    @track isEditModal = false;
    @track isNewModal = false;

    @track Name;

    //전체데이터 불러오기
     connectedCallback(){
         this.tireAll();
    }
  
    //전체보기
    async tireAll(){
        this.Name = '';
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
    newModalBox(){
        this.isNewModal = true;
    }

    newCloseModalBox(){
        this.isNewModal = false;
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
     handleSearch(event){
        if(event.target.value){
            console.log(event.target.value);
             this.search();
        }
        else{
             this.tireAll();
        }
    }

    //검색된 데이터만 보기
     search(){
        const searchOpps =  searchOpp({searchString: event.target.value});
        this.data = searchOpps.map(row =>{
            return this.mapProducts(row);
        });
    }
    handleNameChange(event){
        this.Name = event.target.value;
    }

     handleSave(){
         insertProduct({
            name : this.Name
        })
        this.saveCreate();
        this.tireAll();
    }

    saveCreate(event){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '생성 되었습니다.',
                variant: 'success'
            })
        );
        this.newCloseModalBox(event);
    }

    //수정,편집(RowAction)
     handleRowAction(event){
        if(event.detail.action.value == 'edit'){
            const response =  getproInfo({productId : event.detail.row.Id});
                this.id = response.Id;
                this.Name = response.Name;
                //value 값을 가져오는 거
                this.Description__c = response.Description__c;
                this.Description2__c = response.Description2__c;

                //field Name 업데이트에 저장하는 거
                this.updescription = response.Description__c;
                this.updescription2 = response.Description2__c;
            this.editModalBox();
        }
        else if(event.detail.action.value == 'delete'){
            deleteProduct({productId : event.detail.row.Id});
                this.saveDelete();
        }
    }

    // (Description__c,Description2__c 두컬럼만)
    handleDescriptionChange(event){
        this.updescription = event.target.value; 
    }
    handleDescription2Change(event){
        this.updescription2 = event.target.value;
    }

    //수정 저장 누를시
     handleUpdateSave(){
        const result =  updateProduct({
            productId : this.id,
            description: this.updescription,
            description2: this.updescription2
        });
       
        //성공
        if(result === 'Success') {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: '업데이트가 되었습니다.',
                    variant: 'success'
                })
            );
            this.editCloseModalBox();
        }
        //실패
        else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: '오류',
                    variant: 'error'
                })
            );
      
        }
        this.editCloseModalBox();
        this.tireAll();
    }
    
    saveDelete(){
        this.dispatchEvent(
            new ShowToastEvent({
                title:'Success',
                message:'삭제되었습니다.',
                variant:'success'
            })
        );
        this.tireAll();
    }
}