public with sharing class tireProduct {

       

    @AuraEnabled

    public static List<Product2> getProduct(Integer limitSize, Integer offset){

        List<Product2> products = [SELECT Id, Name, Description__c, Description2__c, Type__c, S_Width__c, Division__c,

        Car_Type__c, Brand__c, Pattern__c, Sales_Pattern__c, Tire_Type__c, Performance__c FROM Product2

                                     LIMIT :limitSize

                                     OFFSET :offset

                                     ];

        return products;

    }
}