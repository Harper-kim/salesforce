import { LightningElement, wire, track} from 'lwc';
import getLeadReport from '@salesforce/apex/LeadReportController.getLeadReport';

export default class LeadReport extends LightningElement {

    @track leadArray= [];

    @wire(getLeadReport)
    wiredleads({data, error}){
        if(data) {
            this.leadArray = data;
        } else if(error){
            console.error(error);
        }
    }

    get leReport() {

        let groupDataMap = new Map();

        this.leadArray.forEach(lead => {

            let le = {
                UserName : lead.userName__c,
                leName : lead.Name
            };

            if(groupDataMap.has(le.UserName)) {
                
                groupDataMap.get(le.UserName).leads.push(le);
            } else {
                let newlead = {};
                newlead.UserName = le.UserName;
                newlead.leads = [le];
                groupDataMap.set(le.UserName, newlead);
            }
        });

        let itr = groupDataMap.values();

        let leReport = [];

        let result = itr.next();
        while(!result.done){
            result.value.rowspan = result.value.leads.length + 1;
            leReport.push(result.value);
            result = itr.next();
        }
        return leReport;

    }

}