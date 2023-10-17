public with sharing class TireController {

        @AuraEnabled
        public static List<Product2> tireData() {
            return [SELECT Id, Material__c,Description__c, Description2__c,Type__c,Base_UOM__c,Net_Weight__c
                ,Weight_Unit__c,Division__c,Car_Type__c,Brand__c,Pattern__c,Sales_Pattern__c,S_Width__c
                ,Tire_Type__c,Performance__c,Name FROM Product2 ORDER BY Name ASC LIMIT 30];
        }

        @AuraEnabled
        public static List<Product2> searchOpp(String searchString){
            String searchKeyword = '%'+searchString+'%';
            List<Product2> searchResult = 
                    [SELECT Id, Material__c,Description__c, Description2__c,Type__c,Base_UOM__c,Net_Weight__c
                    ,Weight_Unit__c,Division__c,Car_Type__c,Brand__c,Pattern__c,Sales_Pattern__c,S_Width__c
                    ,Tire_Type__c,Performance__c,Name FROM Product2 WHERE Brand__c LIKE :searchKeyword OR Material__c LIKE :searchKeyword 
                    OR Car_Type__c LIKE :searchKeyword OR Tire_Type__c LIKE :searchKeyword ORDER BY Name ASC LIMIT 30];

            return searchResult;
        }

        @AuraEnabled
        public static Product2 getproInfo(String productId) {

                Product2 pro = [SELECT Id, Name, Description__c, Description2__c FROM Product2 WHERE Id =:productId];

                return pro;
        }


        @AuraEnabled
        public static void updateProduct(Id productId, String Description, String Description2){
                
                Product2 product = [SELECT Id, Name,Description__c,Description2__c FROM Product2 WHERE Id =:productId LIMIT 1];
           
                product.Description__c = Description;
                product.Description2__c = Description2;
                

                update product;
            
        }
}