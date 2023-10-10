public with sharing class LeadReportController {

    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadReport() {
        return [SELECT Name,userName__c FROM Lead];
    }
}