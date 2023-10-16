trigger LeadStatusUpdateTrigger on Lead (after update) {

    // try{
    //     if(Trigger.isUpdate){
    //         for(Lead newTriggerObj : Trigger.new){
    //             Lead oldTriggerObj = Trigger.oldMap.get(newTriggerObj.id);
    //             if(oldTriggerObj.Status != newTriggerObj.Status && newTriggerObj.Status != 'Closed - Converted'){
    //                 SendEmailController.sendEmail(Trigger.new);
    //             }
    //             else if(newTriggerObj.Status == 'Closed - Converted'){
    //                 SendEmailConvertController.sendEmailConvert(Trigger.new);
    //             }
    //         }
    //     }
    // }catch(Exception e){
    //     System.debug(e.getMessage());
    // }
}