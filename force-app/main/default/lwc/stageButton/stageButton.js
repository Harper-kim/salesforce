import { LightningElement, api, track, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

import STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';

export default class screenAction extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track stageName;

   @wire(getRecord, {
    recordId: "$recordId",
    fields: [AMOUNT_FIELD,STAGENAME_FIELD]
   })
   opportunity;

   changeHandler(event){
    this.value = event.target.value;
   }
  
   handleSuccess(e) {
        this.dispatchEvent(new CloseActionScreenEvent());
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회를 업데이트 했습니다.',
                variant: 'success'
            })
        );
   }
   
   handleErrors(e) {
    const amount = getFieldValue(this.opportunity.data, AMOUNT_FIELD);
    var msg = '';
    if(this.value == 'Proposal/Price Quote' && amount == null) {
            msg = '금액을 입력해주세요'; 
    }else{msg = '전 단계로 이동할 수 없습니다.'}
    this.dispatchEvent(new CloseActionScreenEvent());
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: msg,
                variant: 'Error'
            })
        );
    } 
}