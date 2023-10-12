public with sharing class OpportunityController {

    @AuraEnabled
    public static List<Opportunity> generateData() {
        return [SELECT Id, Name, AccountId, Account.Name, Amount,StageName, UserName__c,CloseDate FROM Opportunity ORDER BY Name ASC LIMIT 30];
    }

    @AuraEnabled
    public static List<Opportunity> searchOpp(String searchString){
        String searchKeyword = '%'+searchString+'%';
        List<Opportunity> searchResult = [SELECT Id, Name, AccountId, Account.Name, Amount, StageName, UserName__c,CloseDate FROM Opportunity WHERE Name LIKE :searchKeyword LIMIT 30];
        return searchResult;
    }

    @AuraEnabled
    public static List<Opportunity> recentlyView(){
        return [SELECT Id, Name, AccountId, Account.Name, Amount, StageName, UserName__c,CloseDate FROM Opportunity ORDER BY LastViewedDate];
    }
    

    
}