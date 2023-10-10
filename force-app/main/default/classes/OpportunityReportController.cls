public with sharing class OpportunityReportController {
    @AuraEnabled(cacheable=true)
    public static List<opportunity> getOpportunityReport() {
        return [SELECT Name, UserName__c FROM opportunity];
    }
}