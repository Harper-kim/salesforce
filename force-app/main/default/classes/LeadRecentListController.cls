public with sharing class LeadRecentListController {
    
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getRecentList(){
        List<Map<String, Object>> recentLeadList = new List<Map<String, Object>>();
        
        // 최근에 본 Lead 레코드를 쿼리하여 가져옵니다.
        List<Lead> recentlyViewedLeads = [SELECT Id, Name,Company,Email,Status,Rating, MobilePhone, Title, LeadSource,userName__c FROM Lead WHERE Status != 'Closed - Converted'ORDER BY LastViewedDate DESC LIMIT 10];
        
        for (Lead rv : recentlyViewedLeads) {
            Map<String, Object> leadMap = new Map<String, Object>();
            leadMap.put('Id', rv.Id);
            leadMap.put('Name', rv.Name);
            leadMap.put('Company', rv.Company);
            leadMap.put('Email', rv.Email);
            leadMap.put('Status', rv.Status);
            leadMap.put('Rating', rv.Rating);
            leadMap.put('MobilePhone', rv.MobilePhone);
            leadMap.put('Title', rv.Title);
            leadMap.put('LeadSource', rv.LeadSource);
            leadMap.put('userName__c', rv.userName__c);

            recentLeadList.add(leadMap);
        }
        
        return recentLeadList;
    }
}