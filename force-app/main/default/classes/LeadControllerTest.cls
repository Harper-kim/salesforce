@isTest
public class LeadControllerTest {
    @isTest
    static void testGetLeadData() {
        List<Lead> testLeads = new List<Lead>();
       
            Lead lead = new Lead();
            lead.LastName = 'Test Lead';
            lead.Email = 'test@gmail.com';
            lead.Company = 'testCom';
            lead.Rating = 'Hot';
            lead.Status = 'Open - Not Contacted';
            //lead.userName__c = '김민정';
            lead.MobilePhone = '123-456-7890';
            lead.Title = 'Title';
            lead.LeadSource = 'Web';
            testLeads.add(lead);
        
        insert testLeads;

        Test.startTest();
        System.debug('test시작');
        List<Lead> result = LeadController.getLeadData();
        Test.stopTest();
        System.debug('test끝');
    }
}