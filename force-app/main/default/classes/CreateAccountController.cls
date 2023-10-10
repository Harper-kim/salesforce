public class CreateAccountController {

    @AuraEnabled
 
    public static void createAcc(Account acc) {
 
        insert acc;
 
    }
 
    @AuraEnabled
 
    public static List<Account> displayAcc() {
 
        return [SELECT Id,name,phone,AccountNumber,Website FROM Account LIMIT 10];
 
    }
 
 }