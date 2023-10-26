public with sharing class ListViewController {

    @AuraEnabled
    public static List<Product2> getRecord(Integer limitSize, Integer offset){

        List<Product2> products = [SELECT Id, Name, Material__c, Description__c, Description2__c, Division__c, Car_Type__c,Brand__c, S_Width__c, Tire_Type__c, Type__c  FROM Product2 
                                     LIMIT :limitSize OFFSET :offset];
        return products;
    }

}