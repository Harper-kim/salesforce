public with sharing class TireController {

        @AuraEnabled
        public static List<Product2> tireData() {
            return [SELECT Id, Material__c,Description__c, Description2__c,Type__c,Base_UOM__c,Net_Weight__c
                ,Weight_Unit__c,Division__c,Car_Type__c,Brand__c,Pattern__c,Sales_Pattern__c,S_Width__c
                ,Tire_Type__c,Performance__c,Name FROM Product2 ORDER BY Name DESC LIMIT 30];
        }

        @AuraEnabled
        public static List<Product2> searchOpp(String searchString){
            String searchKeyword = '%'+searchString+'%';
            List<Product2> searchResult = 
                    [SELECT Id, Material__c,Description__c, Description2__c,Type__c,Base_UOM__c,Net_Weight__c
                    ,Weight_Unit__c,Division__c,Car_Type__c,Brand__c,Pattern__c,Sales_Pattern__c,S_Width__c
                    ,Tire_Type__c,Performance__c,Name FROM Product2 WHERE Brand__c LIKE :searchKeyword OR Material__c LIKE :searchKeyword 
                    OR Car_Type__c LIKE :searchKeyword OR Tire_Type__c LIKE :searchKeyword ORDER BY Name DESC LIMIT 30];

            return searchResult;
        }

        @AuraEnabled
        public static void insertProduct(String name){
                Product2 pro = new Product2();
                pro.Name = name;

                insert pro;
               

        }

        @AuraEnabled
        public static Product2 getproInfo(String productId) {

                Product2 pro = [SELECT Id, Name, Description__c, Description2__c FROM Product2 WHERE Id =:productId];

                return pro;
        }


        @AuraEnabled
        public static String updateProduct(Id productId, String description, String description2){
                
                Id userId = UserInfo.getUserId();
                
                Product2 product = [SELECT Id, Name,Description__c,Description2__c, CreatedById FROM Product2 WHERE Id =:productId];

                Id owner = product.CreatedById;
                
                if(owner == userId){

                        // //둘다 null이 아닐때는 모두 업데이트
                        // if(description != null && description2 != null){
                                product.Description__c = description;
                                product.Description2__c = description2;
                                update product;
                        // }
                        // //description 만 null일때는 description2 업데이트
                        // else if(description == null && Description2 !=null){
                        //         product.Description2__c = Description2;
                        //         update product;
                        // }
                        // //description2 null일때는 description 업데이트
                        // else if(description != null && description2 == null){
                        //         product.Description__c = Description;
                        //         update product;
                        // }
                        return 'Success';
                }
                else {
                        return 'error1';
                }
        }

        @AuraEnabled
        public static void deleteProduct(Id productId){
               Product2 product = [SELECT Id, Name FROM Product2 WHERE Id =:productId];

               delete product;
        }

        
}