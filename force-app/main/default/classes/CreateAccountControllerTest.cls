@isTest
public class CreateAccountControllerTest {
    @isTest
    static void testcreateAcc() {
       

        Account acc = new Account();
        acc.name = 'Test Account';
        acc.phone = '010-4240-9087';
        acc.AccountNumber = '123456';
        acc.Website = 'http://www.example.com';

        Test.startTest();
        System.debug('createAccTest시작');
        CreateAccountController.createAcc(acc);
        Test.stopTest();
        System.debug('createAccTest끝');

        Account createdAccount = [SELECT Id, Name, Phone, AccountNumber, Website FROM Account WHERE Id = :acc.Id];

        //System.assertEquals('Test Account', createAccount.Name, 'Account Name does not match');


    }

    @isTest
    static void testDisplayAcc(){
        Test.startTest();
        List<Account> accList = CreateAccountController.displayAcc();
        Test.stopTest();

        System.assertEquals(0, accList.size(), 'Account list is empty');
    }
}