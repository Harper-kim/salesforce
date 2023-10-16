trigger LeadEmailValidation on Lead (before insert, before update) { // before insert, before update Lead 레코드가 삽입되거나 업데이트되기 전에 실행됨

    // // 이메일 주소를 키로 사용하여 Lead 레코드를 저장하는 맵입니다. 중복 검사 및 오류 추가를 위해 사용됩니다.

    // Map<String, Lead> leadMap = new Map<String, Lead>();

    // // 'System.Trigger.new':  현재 트리거의 삽입 또는 업데이트되는 Lead 레코드 목록.

    // // 루프는 각 Lead 레코드에 대해 실행되며, 이메일 주소가 존재하고 삽입되거나 업데이트되는 경우에만 맵에 추가함.

    // for (Lead Lead : System.Trigger.new) {

    //     if ((Lead.Email != null) && (System.Trigger.isInsert || (Lead.Email != System.Trigger.oldMap.get(Lead.Id).Email))) {

    //         leadMap.put(Lead.Email, Lead);         

    //    }

    // }
    // // 'SELECT Email From Lead WHERE Email IN :leadMap.keySet()' : 이메일 주소가 leadMap의 키 (KeySet)에 있는 Lead 레코드를 데이터베이스에서 검색함.

    // for (Lead lead : [SELECT Email

    //                   FROM Lead

    //                   WHERE Email IN :leadMap.KeySet()]) {

    //     Lead newLead = leadMap.get(Lead.Email);

    //     newLead.Email.addError('이 전자 메일 주소를 가진 리드가 이미 있습니다.');

    // }

}