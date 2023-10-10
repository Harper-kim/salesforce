trigger AccountTrigger on Custom_Account__c (before insert, before update, before delete) {

    //before
    if(Trigger.isBefore){
        if (Trigger.isInsert) {
    
            List<Account> accounts = new List<Account>();
    
    
            for (Custom_Account__c a : Trigger.new) {
    
                accounts.add(new Account(Name = a.Name, AccountNumber = a.Account_No__c, OwnerId = a.Account_Owner__c,
    
                                          Site = a.Account_Site__c, Phone = a.Acccount_Ph__c));
            }
                insert accounts;
    
        }
    
        if(Trigger.isDelete) {
        
            for (Custom_Account__c a : Trigger.old) {
                List<Account> acc =[SELECT Id FROM ACCOUNT WHERE AccountNumber = :a.Account_No__c];
                delete acc;
            }
    
        }
    
        if(Trigger.isUpdate) {
            for (Custom_Account__c a : Trigger.old) {
                    Account acc =[SELECT Id FROM ACCOUNT WHERE AccountNumber = :a.Account_No__c];
                        acc.Name = trigger.new[0].name;
                        acc.AccountNumber = trigger.new[0].Account_No__c;
                        acc.OwnerId = trigger.new[0].Account_Owner__c;
                        acc.Site = trigger.new[0].Account_Site__c;
                        acc.Phone = trigger.new[0].Acccount_Ph__c;
                        update acc;
                }
        }
    }
}