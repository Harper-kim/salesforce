import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getAccountId from '@salesforce/apex/ContactController.getAccountId';

const ACTIONS = [{label: 'Edit', value: 'Edit'},
                {label: 'Delete', value: 'Delete'}]

const columns = [
    {label: 'Contact Name', fieldName: 'link', type: 'url', typeAttributes: { label: { fieldName: 'Name' }}},
    {label: 'Title', fieldName: 'Title', type: 'text'},
    {label: 'Email', fieldName: 'Email', type: 'email'},
    {label: 'Phone', fieldName: 'Phone', type: 'phone'},
    {fieldName: 'actions', type: 'actions', typeAttributes: {rowActions: ACTIONS}}
];



export default class ContactListView extends NavigationMixin(LightningElement) {
    @api recordId;
    columns = columns;
    contacts =[];
    baseData;
    error;

    //totalCount;
    title;
    

    connectedCallback(){
        this.viewAll();
    }

    //전체보기
    async viewAll(){
        const result = await getAccountId({ accountId: this.recordId })
            this.contacts = result.map(row => {
                return this.mapCons(row);
            })
        //this.totalCount = this.contacts.length;
        this.title = 'Contacts (' +this.contacts.length+ ')';
        console.log('this.title : ' +this.title);
    }

    mapCons(row){
        return {...row,
            Name: row.Name,
            link: `/${row.Id}`
        };
    }

    //View All
    viewContacts() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordRelationshipPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                relationshipApiName: 'Contacts',
                actionName: 'view'
            },
        });
    }

    //RowAction
    handleRowAction(event){
        if(actions == 'Delete'){
           
       }
       else if(actions == 'Edit'){
          
       }
    }

    
   

}