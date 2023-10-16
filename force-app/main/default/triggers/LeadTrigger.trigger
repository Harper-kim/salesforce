trigger LeadTrigger on Lead(before insert,before update,after update){
    
    //before
    if(Trigger.isBefore){

        Map<String, Lead> leadMap = new Map<String, Lead>();

        for (Lead Lead : System.Trigger.new) {

            if ((Lead.Email != null) && (System.Trigger.isInsert || (Lead.Email != System.Trigger.oldMap.get(Lead.Id).Email))) {

                leadMap.put(Lead.Email, Lead);         

            }

        }

        for (Lead lead : [SELECT Email

                    FROM Lead

                    WHERE Email IN :leadMap.KeySet()]) {

        Lead newLead = leadMap.get(Lead.Email);

        newLead.Email.addError('이 전자 메일 주소를 가진 리드가 이미 있습니다.');

        }
        
        //업데이트
        if(Trigger.isUpdate){
            for(Lead newTriggerObj : Trigger.new){
                Lead oldTriggerObj = Trigger.oldMap.get(newTriggerObj.id);
        
                if(newTriggerObj.Status != oldTriggerObj.Status){
                    List<String> Status = new List<String>{'Open - Not Contacted' ,'Working - Contacted', 'Closed - Not Converted','Closed - Converted'};
                    Integer oldStatus = status.indexOf(newTriggerObj.Status);
                    Integer newStatus = status.indexOf(oldTriggerObj.Status);
                    if(oldStatus < newStatus){
                        newTriggerObj.addError('전 단계로 이동할 수 없습니다.');
                    }
                }
                if(newTriggerObj.Status != oldTriggerObj.Status && newTriggerObj.Status == 'Closed - Converted'){
                    if(newTriggerObj.Rating != 'Hot'){
                        newTriggerObj.addError('등급이 Hot일경우에만 리드 전환이 가능합니다.');
                    }
                }

                if(oldTriggerObj.Status != newTriggerObj.Status && newTriggerObj.Status != 'Closed - Converted'){
                    SendEmailController.sendEmail(Trigger.new);
                }
                if(newTriggerObj.Status == 'Closed - Converted'){
                    SendEmailConvertController.sendEmailConvert(Trigger.new);
                }
            }
        }

    }


    //After
    if(Trigger.isAfter){
        List<Task> taskList = new List<Task>();

        //업데이트
        if(Trigger.isUpdate){
            //리드상태가 'Working - Contacted'일 경우에만 작업('전화걸기') 생성
            for(Lead newTriggerObj : Trigger.new) {
                Lead oldTriggerObj = Trigger.oldMap.get(newTriggerObj.id);
                
                if(oldTriggerObj.Status != 'Working - Contacted' && newTriggerObj.Status == 'Working - Contacted') {
                    taskList.add(new Task(Subject='전화걸기', WhoId=newTriggerObj.id,
                                        OwnerId=newTriggerObj.OwnerId, Status='Not Started'));
                }
            }
            if(taskList.size()> 0 ){
                insert taskList;
            }
       }
       
    }

}