public with sharing class OpportunityController {

    @AuraEnabled(cacheable=True)
    public static List<Opportunity> generateData() {
        return [SELECT Id, Name, AccountId, Amount,StageName, UserName__c FROM Opportunity ORDER BY Name ASC LIMIT 30];
    }

    @AuraEnabled(cacheable=True)
    public static List<Opportunity> searchOpp(String searchString){
        return [SELECT Id, Name, AccountId, Amount, UserName__c FROM Opportunity WHERE Name like: searchString];

        
    }
    

    
}