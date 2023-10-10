trigger LeadTrigger on Lead(before insert,before update,after update){
    
    //before
    if(Trigger.isBefore){


        // 이메일 중복체크(insert, update둘다)
        // 이메일 주소를 키로 사용하여 Lead 레코드를 저장하는 맵입니다. 중복 검사 및 오류 추가를 위해 사용됩니다.
        Map<String, Lead> leadMap = new Map<String, Lead>();


        // 'System.Trigger.new':  현재 트리거의 삽입 또는 업데이트되는 Lead 레코드 목록.
        // 루프는 각 Lead 레코드에 대해 실행되며, 이메일 주소가 존재하고 삽입되거나 업데이트되는 경우에만 맵에 추가함.
        for (Lead Lead : System.Trigger.new) {

            if ((Lead.Email != null) && (System.Trigger.isInsert || (Lead.Email != System.Trigger.oldMap.get(Lead.Id).Email))) {

                leadMap.put(Lead.Email, Lead);         

            }

        }

         // 'SELECT Email From Lead WHERE Email IN :leadMap.keySet()' : 이메일 주소가 leadMap의 키 (KeySet)에 있는 Lead 레코드를 데이터베이스에서 검색함.
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
        
                //이전 단계로 이동 시 에러메세지
                if(newTriggerObj.Status != oldTriggerObj.Status){
                    List<String> Status = new List<String>{'Open - Not Contacted' ,'Working - Contacted', 'Closed - Not Converted','Closed - Converted'};
                    Integer oldStatus = status.indexOf(newTriggerObj.Status);
                    Integer newStatus = status.indexOf(oldTriggerObj.Status);
                    if(oldStatus < newStatus){
                        newTriggerObj.addError('전 단계로 이동할 수 없습니다.');
                    }
                }

                //등급이 'HOT'인 경우만 리드전환 가능 
                if(newTriggerObj.Status != oldTriggerObj.Status && newTriggerObj.Status == 'Closed - Converted'){
                    if(newTriggerObj.Rating != 'Hot'){
                        newTriggerObj.addError('등급이 Hot일경우에만 리드 전환이 가능합니다.');
                    }
                }

                //리드 업데이트 시 sendEmail 이메일 전송, 리드 전환 시 sendEmailConvert 이메일 전송
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