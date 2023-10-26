public with sharing class ContactController {


    @AuraEnabled
    public static List<Contact> getAccountId(String accountId) {
        List<Contact> conList = [SELECT Id,AccountId, Name, Title, Email,MobilePhone,Phone FROM Contact WHERE AccountId = :accountId];
        system.debug('START getAccountID');
        
        return conList;
    }

   
    
}