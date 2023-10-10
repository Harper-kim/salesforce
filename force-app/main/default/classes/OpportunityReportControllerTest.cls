@isTest
public class OpportunityReportControllerTest {
    
    @isTest
    static void TestGetOpportunityReport(){
        List<Opportunity> testopp = new List<Opportunity>();

        Opportunity opp = new Opportunity();
        opp.Name = '테스트기회';
        testopp.add(opp);

        insert testopp;

        test.startTest();
        List<Opportunity> result = OpportunityReportController.getOpportunityReport();
        test.stopTest();
        
    }
}