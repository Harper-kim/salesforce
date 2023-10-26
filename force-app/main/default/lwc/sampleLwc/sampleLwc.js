import { LightningElement,api } from 'lwc';
import getAccountId from '@salesforce/apex/ContactController.getAccountId';
import { NavigationMixin } from 'lightning/navigation';
import getTotalContacts from '@salesforce/apex/ContactController.getTotalContacts';





export default class sampleLwc extends NavigationMixin(LightningElement) {
    @api recordId;
    contacts =[];
    baseData;
    error;

    totalContacts = 0;

    actions = [{label: 'edit', value: 'edit'},
            {label: 'delete', value: 'delete'}]
    

    connectedCallback(){
        this.viewAll();
    }

    async viewAll(){
        await getAccountId({ accountId: this.recordId })
        .then(result => {
            // this.contacts = result.map(row => {
            //     return this.mapCons(row);
            // }
            // );
            this.contacts = result;
            console.log('END row Mapping');

        })
        .catch(error => {
            console.error(error);
        });
    }

    totalContents(){
        getTotalContacts()
                .then(result => {
                    this.totalContacts = result;
                })
                .catch(error => {
                    console.error(error);
                });
    }
    

    // mapCons(row){
    //     return {...row,
    //         Name: row.Name,
    //         link: `/${row.Id}`
    //     };
    // }

    handleRowAction(event){
        if(actions == 'delete'){
           
       }
       else if(actions == 'edit'){
          
       }
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

   //contact 상세 페이지로 이동
   navigateToProductDetail(event) {
    const contactId = event.currentTarget.dataset.contactId;
        this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: contactId,
            objectApiName: 'Contact',
            actionName: 'view',
        },
     });
    }
    
   
   
}