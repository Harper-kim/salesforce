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
        return [SELECT Id, Name, AccountId, Account.Name, Amount, StageName, UserName__c,CloseDate 
        FROM Opportunity ORDER BY LastViewedDate ASC LIMIT 30];
    }

    @AuraEnabled
    public static void deleteOpportunitys(list<Id> OppIds){
            list<Opportunity> oppToDelete = new list<Opportunity>();
            for(Id idOpp : OppIds) {
                oppToDelete.add(new Opportunity(Id = idOpp));
            }
            if(!oppToDelete.isEmpty()) {
                delete oppToDelete;
            }
    }

    @AuraEnabled
    public static void insertRecord(String name, String stageName, Date closeDate){
        Opportunity oppObj = new Opportunity();
        oppObj.Name = name;
        oppObj.stageName = stageName;
        oppObj.closeDate = closeDate;

        insert oppObj;
    }

    @AuraEnabled
    public static Opportunity getOppInfo(String opportunityId){

        Opportunity opp = [SELECT Id, Name, StageName,CloseDate FROM Opportunity WHERE Id =:opportunityId];
        
        return opp;
    }

    @AuraEnabled
    public static void updateOpportunitys(Id opportunityId, String StageName,Date CloseDate){
        Opportunity opUpdate = [SELECT Id,Name,StageName,CloseDate FROM Opportunity WHERE Id =:opportunityId];
            opUpdate.StageName = StageName;
            opUpdate.CloseDate = CloseDate;

            update opUpdate;

    }


    
       
        
    

    
    

    
}