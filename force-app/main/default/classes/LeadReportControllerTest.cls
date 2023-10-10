@isTest
Run All Tests|Debug All Tests
public class LeadReportControllerTest {
    
    @isTest
    static void testGetLeadReport(){
        List<Lead> testLeads = new List<Lead>();

        Lead lead = new Lead();
        lead.FirstName = '민정';
        lead.LastName = '킴';
        testLeads.add(lead);

        insert testLeads;

        Test.startTest();
        System.debug('test시작');
        List<Lead> result = LeadReportController.getLeadReport();
        Test.stopTest();
        System.debug('test끝');
    }
}