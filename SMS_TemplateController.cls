public with sharing class SMSTemplateController {
    public String uniqueId; 
    public static String objectLabelHeading='';
    public static String objString='';
    public static Integer currentIndex=0;
    public static Map<String, String> valuesMap;
    @AuraEnabled
    public static String getTemplateObjects() {
       objString = MMS_Utilities.getObjectJson('objName','objLabel',false,'SmsTemplate'); 
       valuesMap = new Map<String, String>();

for(Object obj : (List<Object>)JSON.deserializeUntyped(objString)){
   //convert values to map
   Map<String, String> data = (Map<String, String>)obj;
   valuesMap.putAll(data );
}
       return objString;
    }
@AuraEnabled
public Static Map<String,String>  getChannelPickList(){
    Map<String, String> mapOfChannelPickList = new Map<String, String>();
     try{
            Schema.DescribeFieldResult fieldResult = Message_Template__c.Channel__c.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for( Schema.PicklistEntry pickListVal : ple){
             mapOfChannelPickList.put(pickListVal.getValue(),pickListVal.getLabel());
            }   
        }catch(Exception e){
           System.debug('Exception---->'+e.getMessage()); 
           }
         return mapOfChannelPickList;
    }
    @AuraEnabled
    public static Map<String,String> getStatusPickList(){
         Schema.DescribeFieldResult fieldResult = Message_Template__c.Status__c.getDescribe();
     List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
     Map<String, String> mapOfStatusPickList = new Map<String, String>();
    try{
     for( Schema.PicklistEntry pickListVal : ple){
        mapOfStatusPickList.put(pickListVal.getValue(),pickListVal.getLabel());
     }    
       } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
     return mapOfStatusPickList;
 }
 public class FieldsWrapper {
    public Map<String,String> lstField;
    public String selectedField;
    public Integer index;
    Public String labelHeading;
    public FieldsWrapper(Map<String,String> lstField, String selectedField, Integer index, Boolean isEdit,String labelHeading){
       // lstField = CreateSMSTemplateExtension.sortSelectOptions(lstField);
        // if((selectedField == ' ')||(isEdit)){
        //     lstField[0] = new SelectOption(' ', '-Select-');
        // }else{
        //     lstField[0] = new SelectOption('', '--Select--');
        // }
        this.lstField = lstField;
        this.selectedField = selectedField;
        this.index = index;
        this.labelHeading = labelHeading;
    }
}
    public class RelatedFieldsWrapper {
        @AuraEnabled
        public Map<String,String> lstOfField;
        @AuraEnabled
        public String finalFormula;
    }
    @AuraEnabled
    public static RelatedFieldsWrapper  findRelatedField(String currentSelectfield){   
        RelatedFieldsWrapper objRelatedFieldsWrapper=new RelatedFieldsWrapper();     
        Map<Integer, String> mapIndexToField=new  Map<Integer, String>();
        List<FieldsWrapper> lstFieldWrapper= new List<FieldsWrapper>();
        Map<String, String> mapFieldToReference=new Map<String, String>();
        Boolean objError = false;
        String formula;
        String copyofSelctedObject = '';
        Map<String, String> relatedOptions = new Map<String, String>();
        Map<String, String> listobjString = new Map<String, String>();
        Boolean isOnEditPage = false;
        Boolean isFinalResult=false;
         String objectName='';
        FieldsWrapper objFieldsWrapper;
       try{
            objFieldsWrapper = new FieldsWrapper(valuesMap, currentSelectfield, lstFieldWrapper.size(), isOnEditPage,Null);
            lstFieldWrapper.add(objFieldsWrapper);
            if(currentIndex == 0){
                if (currentSelectfield!=NULL && lstFieldWrapper!=NULL && !lstFieldWrapper.isEmpty()) {
                    lstFieldWrapper[currentIndex].selectedField = currentSelectfield;
                    copyofSelctedObject = currentSelectfield;
                }
            }else{
                if (copyofSelctedObject!=NULL) {
                    currentSelectfield = copyofSelctedObject;
                }
            }
            String currentField = '';
            if (lstFieldWrapper!=NULL && !lstFieldWrapper.isEmpty()) {
                currentField=lstFieldWrapper[currentIndex].selectedField;
            }
            if(currentIndex < lstFieldWrapper.size()-1){
                for(Integer i = lstFieldWrapper.size()-1;  i > currentIndex; i--){
                    lstFieldWrapper.remove(i);
                }
            }
            
               if(currentField == null){
                isFinalResult = false;
                   return null;
               }
            // String objectLabelHeading='';
            // if (objectName!=NULL) {
            //     objectLabelHeading=objectName;
            // }
            String suffix = '';
            String tempFormula = '';
             if(currentIndex == 0){
           objectName  = currentField;
           tempFormula = '{!'+currentField;
       }
       else{
         //suffix = currentField.toLowerCase().replace('__c', '__r');
            // Manually replace only last occurence of __c with __r
           if(currentField.length()-3 == currentField.toLowerCase().lastIndexOf('__c')){ 
            suffix = currentField.substring(0, currentField.length()-1);
               
               suffix = suffix+'r';
               
            }
            else if(currentField.length()-3 == currentField.toLowerCase().lastIndexOf('__pc')){ 
               suffix = currentField.substring(0, currentField.length()-1);
                suffix = suffix+'r';
              }
            else{
                suffix = currentField;
          }
        }
            mapIndexToField.put(currentIndex, tempFormula);
            relatedOptions = getFields(lstFieldWrapper[currentIndex].selectedField); 
            if(relatedOptions!=NULL && relatedOptions.size() == 1 && mapFieldToReference != null && lstFieldWrapper!=NULL && !lstFieldWrapper.isEmpty()){
               relatedOptions = getFields(mapFieldToReference.get(lstFieldWrapper[currentIndex].selectedField));  // For reference where api name is different that lookup
            }
            if(relatedOptions!=NULL && relatedOptions.size() > 1){ 
              objFieldsWrapper = new FieldsWrapper(relatedOptions, lstFieldWrapper[currentIndex].selectedField, lstFieldWrapper.size(), isOnEditPage,objectLabelHeading);
                lstFieldWrapper.add(objFieldsWrapper);
                if(suffix != ''){
               tempFormula = mapIndexToField.get(currentIndex-1) + '.' + suffix;
                    mapIndexToField.put(currentIndex, tempFormula);
                }
                isFinalResult = false;
           }
            else{
               formula = mapIndexToField.get(currentIndex-1) + '.' + currentField + '}';
                isFinalResult = true;
            }
          objRelatedFieldsWrapper.lstOfField=relatedOptions;
           objRelatedFieldsWrapper.finalFormula=formula;
        }
        catch(Exception e){
            System.debug('Message---->'+e.getMessage()+' On Line '+e.getLineNumber());
        }
        return objRelatedFieldsWrapper;
    }
    @AuraEnabled
    public static List<Folder__c> getFolders(){
        List<Folder__c> listOfFolder = new List<Folder__c>();
        try{
        listOfFolder=[select name from Folder__c];
        }  
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return listOfFolder;
    }
 @AuraEnabled
 public static Map<String,String>  getFields(String objectName){
 objectName = objectName.equalsIgnoreCase('owner') || objectName.equalsIgnoreCase('$User') ? 'user' :  objectName.equalsIgnoreCase('createdby') || objectName.equalsIgnoreCase('lastmodifiedby') ? 'user' : objectName.equalsIgnoreCase('$Organization') ? 'Organization' : objectName;                     

 if (objectName == 'assetprovidedby' || objectName == 'assetservicedby' || objectName == 'relatedto' ||  objectName == 'what' || objectName == 'convertedaccount') {
  objectName = 'account';
}
else if (objectName == 'source' || objectName == 'replytoemailmessage') {
  objectName = 'emailmessage';
}
else if (objectName == 'activity' ) {
  objectName = 'task';
}
else if (objectName == 'contactpoint' ) {
  objectName = 'contactpointaddress';
}
else if (objectName == 'party' ) {
  objectName = 'individual';
}
else if (objectName == 'who'  || objectName == 'customersigned' || objectName == 'convertedcontact' || objectName == 'customerauthorizedby' || objectName == 'shiptocontact' || objectName == 'billtocontact') {
  objectName = 'contact';
}
else if (objectName == 'activatedby' || objectName == 'manager' || objectName == 'companysigned' || objectName == 'companyauthorizedby' ) {
  objectName = 'user';
}
else if (objectName == 'convertedopportunity' ) {
  objectName = 'opportunity';
}
else if (objectName == 'originalorder' ) {
  objectName = 'order';
}
else if (objectName == 'servicereporttemplate' ) {
  objectName = 'servicereportlayout';
}
else if (objectName == 'delegatedapprover' ) {
  objectName = 'group';
}
 
 
 Map<String, Schema.SObjectField>  fieldsMap = new Map<String, Schema.SObjectField>();
    Map<String, String> mapFieldToReference= new Map<String, String>();
    Map<String, Schema.SObjectType> mapObjNameToObj = new Map<String, Schema.SObjectType>();
    mapObjNameToObj = Schema.getGlobalDescribe();
    String fieldLabel = '';
    List<String> listFields = new List<String>();
    try{
         if(objectName != null && !objectName.equalsIgnoreCase('name') && mapObjNameToObj.get(objectName) != null ){
            Schema.DescribeSObjectResult ds = mapObjNameToObj.get(objectName).getDescribe();
             if(ds.isAccessible())
            {
                objectLabelHeading =ds.getLabel();
                fieldsMap = ds.fields.getMap();
                String stype = '';
                 
                 Schema.DescribeFieldResult descResult;
                 for(String fieldName: fieldsMap.keyset()) {
                       descResult = fieldsMap.get(fieldName).getDescribe();
                       stype = String.valueOf(descResult.getType());
                    if(descResult.isAccessible() && stype != 'ADDRESS' && (!fieldName.equalsIgnoreCase('leadorcontactId')))
                       {    
                       fieldLabel = String.valueOf(descResult.getLabel());
                       if(currentIndex < 4 && stype == 'REFERENCE'  && !((objectName.equalsIgnoreCase('userrole')) || (objectName.equalsIgnoreCase('user') && fieldLabel.startswithIgnoreCase('Call Center')))){
                          String referenceObjName = fieldName;
                          if(!descResult.isCustom()){
                               referenceObjName = referenceObjName.subString(0, fieldName.length()-2); // Removing suffix ID from standard object reference field
                          }
                          
                           if(descResult.getReferenceTo().size () > 0 && descResult.getReferenceTo()[0] != null){
                               ds = descResult.getReferenceTo()[0].getDescribe();
                               if(ds.isAccessible()  ){
                                   if(!descResult.isCustom()){
                                        fieldName = referenceObjName;
                                        if(fieldLabel.subString(fieldLabel.length()-2, fieldLabel.length()).trim().equalsIgnoreCase('id')){
                                            fieldLabel = fieldLabel.subString(0, fieldLabel.length()-2).trim();
                                        } 
                                   }
                                  fieldLabel = fieldLabel +' >' ; 
                                  
                               }
                           }  
                          
                       }
                       listFields.add(fieldLabel);
                       mapFieldToReference.put(fieldName, fieldLabel);
                       System.debug('mapFieldToReference---->'+mapFieldToReference);
                        }  
                 }
              }
         }
     }
     catch(Exception e){
        System.debug('Messsage---->'+e.getMessage());
       }
    return mapFieldToReference;
     }
     @AuraEnabled
     public static string saveTemplate(String messageText,String templateName, String description, String setStatus, String strObjectName, String channel, String folder, String CTAButton){
        try {
            Message_Template__c messageTemplate=new Message_Template__c();
            Folder__c folderName;
            if (String.isNotBlank(folder)) {
                 folderName=[select id from Folder__c where name =: folder LIMIT 1];
            
            }
           if(folderName != NULL && String.isNotBlank(folderName.Id)){
                messageTemplate.Folder__c = folderName.Id;
              }
            //   else{
            //     messageTemplate.Folder__c  = null;
            //   }
              messageTemplate.SMSBodyNew__c = messageText;
              messageTemplate.Name = templateName;
              messageTemplate.Description__c = description;
              messageTemplate.Status__c = setStatus;
              if (CTAButton!= NULL && CTAButton != '') {
                messageTemplate.CTA_Button__c =CTAButton;
              }
              if (String.isNotBlank(channel)) {
                channel = channel.replace('"','');
                channel = channel.replace('[','');
                channel = channel.replace(']','');
                channel = channel.replace(',',';');
            }
        
               messageTemplate.Channel__c = channel;
            
               //messageTemplate.id = msgtempId;
               if(strObjectName.equalsIgnoreCase('$User')){
                 messageTemplate.ObjectName__c = strObjectName.remove('$');  
              }
              else{
               messageTemplate.ObjectName__c = strObjectName;
              }
            //   if(String.isNotBlank(smsSurveyId)){
            //      messageTemplate.SMS_Survey__c = smsSurveyId;
            //       }
              
            //   recType = '!';
            //   for(String str : recTypeList){
            //    recType = recType + str +',';
            //   }
            //   if(recType.length() > 1){
            //        messageTemplate.Record_Type__c = recType.subString(1,recType.length()-1);
            //   }
                    insert messageTemplate; 
              
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return 'Success';
     }
     @AuraEnabled(cacheable=true)
     public static String getLables(){
        wrapperGetLabels wrp=new wrapperGetLabels();
        System.debug('mapFieldToReference---->'+wrp);
        return JSON.serialize(wrp);
     }
     public class wrapperGetLabels{
        String formula='Formula Value';
        String templateName='Template Name';
        String selectObject='Select Object :';
        String selectedObject='Select Object';
        String selectStatus='Select Status';
        String availableChannel='Available Channel';
        String selectedChannel='Selected Channel';
        String description='Brief Description';
        String body='Template Body';
        String CTA='Approved Button';
        String folder='Folder';
     } 
}
