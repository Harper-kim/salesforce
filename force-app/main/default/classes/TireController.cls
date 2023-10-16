public with sharing class TireController {

        @AuraEnabled
        public static List<Product2> TireData() {
            return [SELECT Material__c,Desciption__c, Desciption2__c,Type__c,Base_UOM__c,Net_Weight__c
                ,Weight_Unit__c,Division__c,Car_Type__c,Brand__c,Pattern__c,Sales_Pattern__c,S_Width__c
                ,Tire_Type__c,Performance__c,Name FROM Product2 LIMIT 30];
        }

        @AuraEnabled
        public static List<Product2> searchOpp(String searchString){
            String searchKeyword = '%'+searchString+'%';
            List<Product2> searchResult = 
                    [SELECT Material__c,Desciption__c, Desciption2__c,Type__c,Base_UOM__c,Net_Weight__c
                    ,Weight_Unit__c,Division__c,Car_Type__c,Brand__c,Pattern__c,Sales_Pattern__c,S_Width__c
                    ,Tire_Type__c,Performance__c,Name FROM Product2 WHERE Brand__c LIKE :searchKeyword LIMIT 30];

            return searchResult;
        }
}
