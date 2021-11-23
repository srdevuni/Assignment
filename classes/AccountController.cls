public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<DataTableWrapper> getFinacialAccounts(string accountName) {
        string queryString = 'SELECT id,name,Owner.name,Owner_Name__c,phone,website,AnnualRevenue FROM Account WHERE Industry= \''+'Financial Services\'';
        if(accountName != null && accountName!=''){
            String Key = '%'+accountName+'%';
            queryString += ' AND Name LIKE :Key';
        }
        queryString += ' WITH SECURITY_ENFORCED ';
        List<Account> accList = New List<Account>();
        accList =database.query(queryString);
        /*System.debug(accountName);
        System.debug(queryString);
        system.debug(database.query(queryString));
        return database.query(queryString);*/
        List<DataTableWrapper> response = new List<DataTableWrapper>();
        if(accList.size()>0){
            for(Account acc : accList){
                DataTableWrapper obj = new DataTableWrapper();
                obj.AccId = acc.Id;
                obj.AccName = acc.Name;
                obj.OwnerName = acc.owner.name;
                obj.Phone = acc.Phone;
                obj.nameUrl = '/'+acc.Id;
                obj.Website = acc.Website;
                obj.AnnualRevenue = acc.AnnualRevenue;
                response.add(obj);
            }
        }
        return response;

    }
    private class DataTableWrapper {
        @AuraEnabled
        public Id AccId {get;set;}
        @AuraEnabled
        public String AccName {get;set;}
        @AuraEnabled
        public String nameUrl {get;set;}
        @AuraEnabled
        public String OwnerName {get;set;}
        @AuraEnabled
        public String Phone {get;set;}
        @AuraEnabled
        public String Website {get;set;}
        @AuraEnabled
        public double AnnualRevenue {get;set;}
    }
}