import { LightningElement, track, wire  } from 'lwc';
import getLeadData from '@salesforce/apex/LeadController.getLeadData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { recentlyViewed } from 'lightning/uiRecordApi'; 
import { NavigationMixin } from 'lightning/navigation';
import getRecentList from '@salesforce/apex/LeadRecentListController.getRecentList';

const columns = [
    { label: '이름', fieldName: 'LeadName', type: 'url',  typeAttributes: { label: {fieldName: 'Name'}, target: '__blank'}},
    { label: '회사', fieldName: 'Company', type: 'text'},
    { label: '이메일', fieldName: 'Email', type: 'email'},
    { label: '상태', fieldName: 'Status', type: 'text'},
    { label: '등급', fieldName: 'Rating', type: 'text'},
    { label: '소유자', fieldName: 'userName__c', type: 'text'},
    { label: '전화번호', fieldName: 'MobilePhone', type: 'phone'},
    { label: '직급', fieldName: 'Title', type: 'text'},
    { label: '리드소스', fieldName: 'LeadSource', type: 'text'}
];

export default class leadListView extends LightningElement {

    @track data;
    @track searchString;
    @track initialRecords;
    @track records;
    @track isShowModal = false;

    availableLeads;
    error;
    columns = columns;

    //필터
    selectedFilter = ''; // 선택한 필터 초기화
    filterOptions = [  // 필터 옵션 정의
        { label: '모든 진행 중인 리드', value: 'all' },
        { label: '최근 본 리드', value: 'recent' },
    ];
    leads;
    showRecentOnly = false;
    // @track isComponentLoaded = true;
    // @track recentViewRecords = [];

    @wire(getLeadData)
    wiredLeads( { error, data } ) {
        if (data) {
            let tempRecs = [];
            data.forEach((record) => {
                let tempRec = Object.assign( {}, record );
                tempRec.LeadName = '/' + tempRec.Id;
                tempRec.Name = record.Name;
                tempRecs.push(tempRec);
                console.log('여기'+data);
            });

            this.initialRecords = tempRecs;
            this.availableLeads = tempRecs;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.availableLeads = undefined;
        }
    }
    searchData;

    //목록보기 필터
    @wire(getRecentList)
    wiredRecentLists({ error, data }) {
        if (data) {
            this.records = data.map(item => {
                return {
                    Id: item.Id,
                    LeadName: '/' + item.Id,
                    Name: item.Name,
                    Company: item.Company,
                    Status: item.Status,
                    Email: item.Email,
                    Rating: item.Rating,
                    userName__c: item.userName__c,
                    MobilePhone: item.MobilePhone,
                    Title: item.Title,
                    LeadSource: item.LeadSource
                };
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    //검색
    handleLeadSearch(event) {
        const searchKey = event.target.value.toLowerCase();
        if(searchKey) {
            this.searchData = this.initialRecords;
            if(this.searchData) {
                let searchRecords = [];
                for (let record of this.searchData) {
                    let valuesArray = Object.values(record);
                    for(let val of valuesArray) {
                        //console.log('val is' + val);
                        let strVal = String(val);
                        if(strVal) {
                            if(strVal.toLowerCase().includes(searchKey)){
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }
                console.log('매치된 계정은 ' + JSON.stringify(searchRecords));
                this.searchData = searchRecords;
                this.availableLeads = this.searchData;
            }
        } else {
            this.searchData = this.initialRecords;
            this.availableLeads = this.searchData;
        }
    }

    //모달창 열기
    showModalBox() {  
        this.isShowModal = true;
    }

    //모달창 닫기
    closeModalBox() {  
        this.isShowModal = false;
    }

    //새로고침
    handleClose = () => {
        window.location.reload();
    }

    //성공
    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '리드가 생성되었습니다.',
                variant: 'success'

            })
        );
        //this.closeModalBox(event);
        this.handleClose(event);
    }

    //목록 보기 필터

    //전체 목록 보기
    showAllList(){
        this.availableLeads = this.initialRecords;
    }

    // 필터 변경 핸들러
    handleFilterChange(event) {
        this.selectedFilter = event.detail.value;

        if (this.selectedFilter === 'recent') {
            this.showRecentList();
        } else {
            this.showAllList();
        }
    }

    // 최근 목록 보기
    showRecentList() {
        this.availableLeads = this.records;
    }

    // 전체 목록 보기
    showAllList() {
        this.availableLeads = this.initialRecords;
    }

    
}