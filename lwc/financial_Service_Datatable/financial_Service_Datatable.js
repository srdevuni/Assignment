import { LightningElement,wire,track } from 'lwc';
import getFinacialAccounts  from '@salesforce/apex/AccountController.getFinacialAccounts';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Name from '@salesforce/schema/Account.Name';
import { refreshApex } from '@salesforce/apex';
import ID_FIELD from '@salesforce/schema/Account.Id';
const DELAY = 300;
const actions = [
    { label: 'Show details', name: 'show_details' }
];
export default class Financial_Service_Datatable extends LightningElement {
    data = [];
    accData = [];
    accountName = '';
    record = {};
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;
    draftValues = [];
    @track columns = [{
        label: 'Account Name',
        fieldName: 'nameUrl',
        type: 'url',
        editable: true,
        sortable: true,
        target: '_blank',
        typeAttributes: {label: { fieldName: 'AccName' }},
        cellAttributes: { alignment: 'left' }
    },
    {
        label: 'Owner Name',
        fieldName: 'OwnerName',
        type: 'text',
        editable: false,
        sortable: true,
        cellAttributes: { alignment: 'left' }
    },
    {
        label: 'Website',
        fieldName: 'Website',
        editable: false,
        type: 'url',
        sortable: false
    },
    {
        label: 'Phone',
        fieldName: 'Phone',
        editable: false,
        type: 'phone',
        sortable: false
    },
    {
        label: 'Annual Revenue',
        fieldName: 'AnnualRevenue',
        type: 'Currency',
        editable: false,
        sortable: false
    },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
    ];
    @wire(getFinacialAccounts, { accountName: '$accountName' })
    wiredFinacialAccounts({ error, data }){
        if(data){
            this.data = data;
            console.log(data);
        }
        else{
            console.log(error);
            //Show Toast Message
        }
    }
    handleRowAction(event) {
        const row = event.detail.row;
        
    }
    handleRowAction(event) {
        const row = event.detail.row;
        console.log(JSON.stringify(row.Id));
        window.open(window.location.origin+'/'+row.Id);
        this.record = row;
    }
    handleKeyChange(event) {
        const searchKey = event.target.value;
        console.log(searchKey);
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.accountName = searchKey;
        }, DELAY);
    }
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
    handleSave(event) {
        const fields = {}; 
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[Name.fieldApiName] = event.detail.draftValues[0].Name;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account updated',
                    variant: 'success'
                })
            );
            this.draftValues = [];
            //return refreshApex(this.data);
            window.location.reload();
        }).catch(error => {
            console.log(error);
        });
    }
}