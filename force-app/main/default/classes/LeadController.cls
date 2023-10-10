public with sharing class LeadController {
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadData() {
        return [SELECT Id, Name, Email, Company, Rating, Status, MobilePhone, Title, LeadSource, userName__c FROM Lead 
                WHERE Status != 'Closed - Converted' AND Status != 'Closed - Not Converted' ORDER BY Name ASC];

    }

}

 