trigger OpportunityTrigger on Opportunity (before update,before insert) {

    if(Trigger.isBefore){

        if(Trigger.isUpdate){
    
            for(Opportunity newTriggerObj : Trigger.new){
                Opportunity oldTriggerObj = Trigger.oldMap.get(newTriggerObj.id);

                //이전단계로 이동 불가 
                if(newTriggerObj.StageName != oldTriggerObj.StageName || newTriggerObj.CustomStageName__c != oldTriggerObj.CustomStageName__c){
                    List<String> stageOrder = new List<String>{'Qualification','Needs Analysis','Value Proposition','Id. Decision Makers'
                                        ,'Perception Analysis','Proposal/Price Quote','Negotiation/Review','Closed Won','Closed Lost'};
                    Integer oldStageIndex = stageOrder.indexOf(newTriggerObj.StageName);
                    Integer newStageIndex = stageOrder.indexOf(oldTriggerObj.StageName);

                    Integer oldCustomStageIndex = stageOrder.indexOf(newTriggerObj.CustomStageName__c);
                    Integer newCustomStageIndex = stageOrder.indexOf(oldTriggerObj.CustomStageName__c);

                    if (oldStageIndex < newStageIndex || oldCustomStageIndex < newCustomStageIndex) {
                            newTriggerObj.adderror('전 단계로 이동할 수 없습니다.');
                    }

                }  

    
                //금액 없으면 'Proposal/Price Quote' 단계 이동 불가 
                if(newTriggerObj.StageName != null ){
                    if((newTriggerObj.StageName == 'Proposal/Price Quote' || newTriggerObj.CustomStageName__c == 'Proposal/Price Quote') && newTriggerObj.Amount == null){
                        newTriggerObj.addError('금액을 입력해주세요');
                    }
                } 
                
                
            }
        }

        //기회 생성 시 CustomStageName을 StageName에 대입
        if(Trigger.isInsert){
            for(Opportunity newTriggerObj : Trigger.new){
                if(newTriggerObj.StageName == null){
                    newTriggerObj.StageName = newTriggerObj.CustomStageName__c;
                }
            }
        }
    }
}