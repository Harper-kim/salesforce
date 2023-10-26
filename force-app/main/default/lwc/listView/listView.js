import { LightningElement,track} from 'lwc';


import getRecord from '@salesforce/apex/ListViewController.getRecord';




export default class listView extends LightningElement {


    @track products = [];
    @track limitSize = 40;
    @track offset = 0;
    @track isFetchingData = false;

    connectedCallback() {
        this.loadData();
    }

 

     loadData() {
        console.log('loadData START');
        if (!this.isFetchingData) {
            this.isFetchingData = true;
            getRecord({ limitSize: this.limitSize, offset: this.offset })
                .then(result => {
                    this.products = this.products.concat(result);
                    this.isFetchingData = false;
                })
                .catch(error => {
                    console.error('Error fetching data: ' + JSON.stringify(error));
                    this.isFetchingData = false;
                });
        }
    }

 

     loadMoreData(event) {
        
        console.log('loadData in scroll START');
        const container = this.template.querySelector('div');
        if (container.scrollHeight - container.scrollTop <= container.clientHeight) {
            
        console.log('if true?::');
            this.offset += this.limitSize;
            
        console.log('loadData START in if');
            this.loadData();

            
        console.log('loadData End in if');
        }
    }


    

}