import { LightningElement, track } from 'lwc';
//import  getTemplateObjects from '@salesforce/apex/SMSTemplateController.getTemplateObjects';
import  getStatusPickList from '@salesforce/apex/SMSTemplateController.getStatusPickList';
import  getChannelPickList from '@salesforce/apex/SMSTemplateController.getChannelPickList';
import getObjectList from '@salesforce/apex/CampaignDripController.getObjectList';
import findRelatedField from '@salesforce/apex/SMSTemplateController.findRelatedField';
import SMSApp_EmojiOne from '@salesforce/resourceUrl/SMSApp_EmojiOne';
import saveTemplate from '@salesforce/apex/SMSTemplateController.saveTemplate';
import getFolders from '@salesforce/apex/SMSTemplateController.getFolders';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { emojiTable1, emojiTable2, emojiTable3, emojiTable4} from 'c/emojiTable';
import getLables from '@salesforce/apex/SMSTemplateController.getLables';



export default class SMSTemplateLWC extends LightningElement {
    selectedStatus='Active';
    myMap = new Map();
    emoiji = SMSApp_EmojiOne+'/1f60e.png';
    isEmoji=true;
    formula;
    addNewFolder=false;
    addNewField1=false;
    addNewField2=false;
    formulaBugFix = '';
    emojiDisabled=false;
    objectList=[];
    index=0;
    charlimit = '1000';
    statusOptions=[];
    channelOptions=[];
    folderName;
    value=false;
    listLabels=[];
    selectedChannelValues;
    selectedObject;
    search=false;
    isExpand=false;
    isExpand2=false;
    isExpand3=false;
    isExpand4=false;
    fieldName5;
    isFinalFormula=false;
    Object;
    textMessage;
    folderOptions;
    Heading;
    generateFormulaObjectList=[];
    templateName;
    description;
    fieldName;
    Object2;
    Object3;
    Object4;
    Object5;
    Object6;
    isFolder=false;
    fieldName2;
    fieldName3;
    fieldName4;
    fields=['Name'];
    value = '';
    addInputField=0;
    showFields=false;
    quickReplyAddDisable=false;
    inputValue1;
    inputValue2;
    inputValue2;
    inputValue;
    get options() {
        return [
            { label: 'Quick replies', value: 'Quickreplies' },
            { label: 'Call to action', value: 'Calltoaction' },
        ];
    }

    renderedCallback(){
      let style = document.createElement('style');

      style.innerText = `
        .callToActionCon lightning-input label {
          display:none
        }
        .emojiComponent{
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .emojiComponent{
          position: absolute;
          top: 8px;
          right: 6px;
          z-index:100000000000;
        }
        .emojiCallIcon{
          cursor: pointer;
        }
        .emojiCallIcon.disabled{
          filter: grayscale(1);
          opacity: 0.6;
          cursor: not-allowed;
        }
        .allEmojiContainer{
          position: absolute;
          top: -230px;
          right: -5px;
          height: 224px;
          width: 220px;
          background: #fff;
          z-index: 1;
          border: 1px solid rgb(221, 219, 218);
          border-radius: 0.25rem;
          box-shadow: 0 2px 15px 0.5px #c5c5c5;
          overflow: hidden;
        }
        .allEmojiContainer.small{
          top: -130px;
          height: 124px;
        }
        .tabs {
          width:100%;
          display:inline-block;
        }
        .tab-links{
          display: flex;
          justify-content: center;
          margin: 0 !important;
          padding: 0 !important;
        }
        .tab-links:after {
          display:block;
          clear:both;
          content:'';
        }
        .tab-links li {
          height: 22px !important;
          font-size: .8125rem;
          margin: 10px 15px;
          background: none;
          list-style: none;
        }
        .tab-links li a {
          opacity: .4;
          padding: 0;
          display: inline-block;
          transition: all linear .15s;
        }
        .tab-links li a:hover{
          opacity: 0.6;
        }
        .tab-links li.active a{
          opacity: 0.8;
        }
        .tab-links li.active a svg{
          fill: rgb(0, 109, 204);
        }
        .tab-content{
          font-size: 0 !important;
        }
        .tab{
          display: none;
          padding: 0 .25rem;
          width: 100%;
          height: 180px;
          overflow-y: scroll;
          text-align: left;
        }
        
        .allEmojiContainer.small .tab{
          height: 80px;
        }
        .tab.active {
          display: block;
        }
        .EmojiIcon{
          font-size: .8125rem;
          margin: 5px;
          max-width: 22px !important;
          cursor: pointer;
        }
        .EmojiIcon:hover{    
          transform: scale(1.2);
          transition: 0.1s;
        }
      
      `;

      try{
        this.template.querySelector(".mainContainer").appendChild(style);
      }catch(e){
        console.log("style===>",e)
      }
    }

    emojiIconClicked(event){
      try{
            var allEmjContainer = this.template.querySelector('.allEmojiContainer');
            if (window.getComputedStyle(allEmjContainer).display === "none") {
                allEmjContainer.style.display = 'block';
            } else{
                allEmjContainer.style.display = 'none';
            }
      } catch(error) {
          console.log('>>>>>>Line 854>>>>>',error);
      }
  }

  emojiTable(parentThis) {
    try {
        let svg1 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;" xml:space="preserve"><path d="M344.25,229.5c20.4,0,38.25-17.85,38.25-38.25S364.65,153,344.25,153S306,170.85,306,191.25S323.85,229.5,344.25,229.5z     M165.75,229.5c20.4,0,38.25-17.85,38.25-38.25S186.15,153,165.75,153s-38.25,17.85-38.25,38.25S145.35,229.5,165.75,229.5z     M255,408c66.3,0,122.4-43.35,145.35-102h-290.7C132.6,364.65,188.7,408,255,408z M255,0C114.75,0,0,114.75,0,255    s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M255,459c-112.2,0-204-91.8-204-204S142.8,51,255,51s204,91.8,204,204    S367.2,459,255,459z"></path></svg>';
        let svg2 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><path d="M506.791,186.581c-17.89-55.053-77.234-85.287-132.283-67.403c-7.272,2.363-14.634,5.631-21.91,9.68    c1.603-8.169,2.436-16.182,2.436-23.828c0-58.447-40.387-104.981-97.982-104.981c-57.679,0-100.086,46.637-100.086,104.981    c0,7.645,0.833,15.658,2.436,23.828c-7.276-4.048-14.638-7.317-21.91-9.68C82.446,101.291,23.098,131.528,5.209,186.581    c-18.142,55.838,12.726,118.021,67.403,135.788c7.272,2.363,15.148,4.045,23.414,5.047c-6.099,5.668-11.481,11.661-15.976,17.846    C46.025,392.094,56.444,457.876,103.274,491.9c46.808,34.01,107.605,23.759,141.74-23.225c4.495-6.186,8.529-13.158,12.037-20.71    c3.507,7.553,7.542,14.524,12.037,20.71c34.181,47.048,92.928,57.162,139.636,23.225c46.831-34.025,57.25-99.807,23.225-146.638    c-4.493-6.186-9.878-12.178-15.976-17.847c8.264-1.001,16.145-2.685,23.417-5.046C494.066,304.603,524.933,242.42,506.791,186.581    z M257.052,30.044c39.394,0,67.987,31.536,67.987,74.986c0,19.556-7.653,43.667-20.471,64.497    c-1.551,2.521-2.268,5.33-2.222,8.099l-15.616,27.028c-4.67-2.021-9.78-3.588-14.881-4.627V138.53    c0-8.282-6.515-14.997-14.797-14.997c-8.282,0-14.997,6.715-14.997,14.997v61.498c-5.221,1.064-10.239,2.686-15.007,4.775    l-17.435-28.556c-0.175-2.314-0.888-4.618-2.182-6.72c-12.818-20.83-20.471-44.941-20.471-64.497    C186.961,62.281,217.093,30.044,257.052,30.044z M81.88,293.843c-38.539-12.523-61.037-58.314-48.145-97.993    c12.778-39.324,55.162-60.921,94.489-48.146c16.144,5.246,33.771,17.046,48.512,32.256l25.755,42.184    c-4.094,4.347-7.675,9.179-10.647,14.404l-58.527-19.016c-7.884-2.561-16.339,1.752-18.898,9.628    c-2.561,7.878,1.752,16.338,9.628,18.898l58.505,19.01c-0.678,6.02-0.632,11.422,0.037,17.164l-37.46,13.069    C122.678,300.014,99.332,299.513,81.88,293.843z M242.053,387.296c-1.939,24.232-9.884,48.032-21.303,63.749    c-24.406,33.59-66.469,40.839-99.845,16.589c-33.45-24.304-40.891-71.29-16.588-104.742    c19.857-27.333,54.348-39.752,56.964-41.457l30.712-10.715c2.766,4.816,6.037,9.306,9.764,13.375l-36.175,49.792    c-4.869,6.701-3.383,16.08,3.317,20.948c6.697,4.867,16.077,3.385,20.948-3.317l36.165-49.779    c5.074,2.317,10.44,4.102,16.04,5.243V387.296z M257.052,318.497c-24.808,0-44.992-20.183-44.992-44.992    s20.183-44.992,44.992-44.992c24.808,0,44.992,20.183,44.992,44.992S281.86,318.497,257.052,318.497z M391.094,467.634    c-34.467,25.043-74.131,15.904-97.741-16.589c-11.419-15.717-19.564-39.517-21.505-63.748v-40.314    c5.6-1.142,11.166-2.925,16.24-5.243l36.165,49.779c4.869,6.701,14.248,8.185,20.948,3.317c6.701-4.869,8.187-14.247,3.317-20.948    l-36.174-49.791c3.695-4.036,6.943-8.483,9.694-13.254l27.954,10.071c3.446,2.555,37.543,14.246,57.689,41.978    C431.987,396.344,424.545,443.33,391.094,467.634z M368.012,295.523l-36.516-13.156c0.699-5.9,0.725-11.338,0.054-17.3    l58.505-19.01c7.877-2.56,12.188-11.02,9.628-18.898s-11.021-12.189-18.898-9.628l-58.527,19.016    c-3.024-5.315-6.678-10.224-10.862-14.629l24.769-42.868c14.556-14.767,31.791-26.206,47.61-31.346    c39.321-12.775,81.71,8.821,94.489,48.144c12.892,39.68-9.606,85.471-48.145,97.994h0.001    C412.962,299.417,390.11,299.983,368.012,295.523z"></path></svg>';
        let svg3 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><path d="M467.812,431.851l-36.629-61.056c-16.917-28.181-25.856-60.459-25.856-93.312V224c0-67.52-45.056-124.629-106.667-143.04    V42.667C298.66,19.136,279.524,0,255.993,0s-42.667,19.136-42.667,42.667V80.96C151.716,99.371,106.66,156.48,106.66,224v53.483    c0,32.853-8.939,65.109-25.835,93.291l-36.629,61.056c-1.984,3.307-2.027,7.403-0.128,10.752c1.899,3.349,5.419,5.419,9.259,5.419    H458.66c3.84,0,7.381-2.069,9.28-5.397C469.839,439.275,469.775,435.136,467.812,431.851z"></path><path d="M188.815,469.333C200.847,494.464,226.319,512,255.993,512s55.147-17.536,67.179-42.667H188.815z"></path></svg>';
        let svg4 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 504.124 504.124" style="enable-background:new 0 0 504.124 504.124;" xml:space="preserve"><path d="M378.092,378.092v27.569c0,11.028,8.665,19.692,19.298,19.692h31.902v-47.262h-51.2V378.092z   M74.831,425.354h31.902c10.634,0,19.298-8.665,19.298-19.692v-27.569h-51.2C74.831,378.094,74.831,425.354,74.831,425.354z"/><path d="M413.538,378.092v64.197c0,14.572,11.815,26.388,25.994,26.388h14.572  c14.572,0,25.994-11.815,25.994-26.388v-72.074C480.098,370.215,413.538,378.092,413.538,378.092z M23.631,442.289  c0,14.572,11.815,26.388,25.994,26.388h14.572c14.572,0,25.994-11.815,25.994-26.388v-64.197l-66.56-7.877  C23.631,370.215,23.631,442.289,23.631,442.289z"/><path d="M250.486,35.446h1.182c133.514,0,165.809,57.108,165.809,165.415H86.646  C86.646,92.554,119.335,35.446,250.486,35.446z"/><path style="fill:#fff;" d="M250.88,55.138h1.182c117.366,0,145.723,50.412,145.723,145.723H106.338  C106.338,105.551,135.089,55.138,250.88,55.138z"/><path d="M252.062,334.77c80.345,0,145.723,14.966,145.723,33.477s-65.378,33.477-145.723,33.477  s-145.723-14.966-145.723-33.477C106.338,349.735,171.717,334.77,252.062,334.77z"/><path d="M88.222,212.677l164.234-23.631l163.446,23.631c48.837,0,88.222,39.778,88.222,89.403v19.298  c0,14.178-6.302,25.6-25.206,25.6H25.206C6.695,346.585,0,335.163,0,320.985v-19.298C0,252.455,39.385,212.677,88.222,212.677z"/><path d="M20.086,342.646h463.557c6.695,0,12.209,5.12,12.209,11.815c0,12.997-11.028,23.631-24.812,23.631  H32.689c-13.785,0-24.812-10.634-24.812-23.631C7.877,347.766,13.391,342.646,20.086,342.646L20.086,342.646z"/><path d="M422.597,200.468c0,0-45.686,18.117-69.711,98.068c0,0-13.391,44.111-44.111,44.111H195.348  c-30.72,0-44.111-44.111-44.111-44.111c-24.025-79.951-69.317-97.28-69.317-97.28c-15.754-6.302,0-15.754,0-15.754  c63.803-36.234,170.142-31.902,170.142-31.902s105.945-4.726,170.535,31.902C422.597,185.502,437.169,193.772,422.597,200.468z"/><path d="M168.566,293.022c1.969,6.302,12.209,29.932,25.206,29.932h34.658V173.292  c-59.865,0-98.855,11.028-122.092,21.268C124.455,208.345,151.631,237.095,168.566,293.022z M275.692,173.292v149.662h31.114  c13.391,0,23.237-23.631,25.206-29.932c16.542-55.138,43.323-84.283,61.44-98.462C371.003,184.32,333.194,173.686,275.692,173.292z"/><path d="M244.185,153.6h15.754v189.046h-15.754V153.6z"/><path style="fill:#fff;" d="M70.892,248.123c-19.692,0-35.446,15.754-35.446,35.446s15.754,35.446,35.446,35.446  s35.446-15.754,35.446-35.446C106.338,263.878,90.585,248.123,70.892,248.123z M433.231,248.123  c-19.692,0-35.446,15.754-35.446,35.446s15.754,35.446,35.446,35.446s35.446-15.754,35.446-35.446  C468.677,263.878,452.923,248.123,433.231,248.123z"/><path style="fill:#fff;" d="M70.892,271.754c-6.695,0-11.815,5.12-11.815,11.815s5.12,11.815,11.815,11.815  s11.815-5.12,11.815-11.815S77.194,271.754,70.892,271.754z M433.231,271.754c-6.695,0-11.815,5.12-11.815,11.815  s5.12,11.815,11.815,11.815s11.815-5.12,11.815-11.815S439.926,271.754,433.231,271.754z"/><path d="M426.535,192.985h-7.089c-7.877,0-14.178,5.908-14.178,13.785v6.695  c0,3.938,7.877,6.695,17.329,6.695c9.846,0,17.329-3.151,17.329-6.695v-6.695C440.714,199.286,434.412,192.985,426.535,192.985z   M83.889,192.985H76.8c-7.877,0-14.178,5.908-14.178,13.785v6.695c0,3.938,7.877,6.695,17.329,6.695s17.329-3.151,17.329-6.695  v-6.695C98.068,199.286,91.766,192.985,83.889,192.985z"/><path d="M117.366,122.486c19.692-9.846,76.8-35.052,133.908-35.052c57.502,0,115.397,25.206,135.089,35.052  c-16.542-44.505-55.138-67.348-134.302-67.348h-1.182C172.898,55.138,134.302,77.982,117.366,122.486z"/><path style="fill:#fff;" d="M433.231,256c15.36,0,27.569,12.209,27.569,27.569c0,15.36-12.209,27.569-27.569,27.569  c-15.36,0-27.569-12.209-27.569-27.569C405.662,268.21,417.871,256,433.231,256 M70.892,256c15.36,0,27.569,12.209,27.569,27.569  c0,15.36-12.209,27.569-27.569,27.569s-27.569-12.209-27.569-27.569C43.323,268.21,55.532,256,70.892,256 M433.231,248.123  c-19.692,0-35.446,15.754-35.446,35.446s15.754,35.446,35.446,35.446s35.446-15.754,35.446-35.446  C468.677,263.878,452.923,248.123,433.231,248.123z M70.892,248.123c-19.692,0-35.446,15.754-35.446,35.446  s15.754,35.446,35.446,35.446s35.446-15.754,35.446-35.446C106.338,263.878,90.585,248.123,70.892,248.123z"/></svg>';
        var tabContent1 = emojiTable1();
        var tabContent2 = emojiTable2();
        var tabContent3 = emojiTable3();
        var tabContent4 = emojiTable4();
        var emojiContainer = document.createElement('div');
        emojiContainer.className = 'tabs';
        var emojiContainerbody = '<ul class="tab-links">';
        emojiContainerbody += '<li class="active"><a href="#tab1" id="svg_content1">'+svg1+'</a></li>';
        emojiContainerbody += '<li><a href="#tab2" id="svg_content2">'+svg2+'</a></li>';
        emojiContainerbody += '<li><a href="#tab3" id="svg_content3">'+svg3+'</a></li>';
        emojiContainerbody += '<li><a href="#tab4" id="svg_content4">'+svg4+'</a></li></ul>';

        emojiContainerbody += '<div class="tab-content"><div id="tab1" class="tab active"></div>';
        emojiContainerbody += '<div id="tab2" class="tab"></div>';
        emojiContainerbody += '<div id="tab3" class="tab"></div>';
        emojiContainerbody += '<div id="tab4" class="tab"></div></div>';

        emojiContainer.innerHTML = emojiContainerbody;
        parentThis.template.querySelector('.allEmojiContainer').appendChild(emojiContainer);
        parentThis.template.querySelector('#tab1').innerHTML = tabContent1;
        parentThis.template.querySelector('#tab2').innerHTML = tabContent2;
        parentThis.template.querySelector('#tab3').innerHTML = tabContent3;
        parentThis.template.querySelector('#tab4').innerHTML = tabContent4;
        this.template.querySelector('#svg_content1').addEventListener('click',function(){
            parentThis.removeActiveClass(parentThis);
            parentThis.template.querySelector('#svg_content1').parentNode.classList.add('active');
            parentThis.template.querySelector('#tab1').classList.add('active');
            
        })
        this.template.querySelector('#svg_content2').addEventListener('click',function(){
            parentThis.removeActiveClass(parentThis);
            parentThis.template.querySelector('#svg_content2').parentNode.classList.add('active');
            parentThis.template.querySelector('#tab2').classList.add('active');
        })
        this.template.querySelector('#svg_content3').addEventListener('click',function(){
            parentThis.removeActiveClass(parentThis);
            parentThis.template.querySelector('#svg_content3').parentNode.classList.add('active');
            parentThis.template.querySelector('#tab3').classList.add('active');
        })
        this.template.querySelector('#svg_content4').addEventListener('click',function(){
            parentThis.removeActiveClass(parentThis);
            parentThis.template.querySelector('#svg_content4').parentNode.classList.add('active');
            parentThis.template.querySelector('#tab4').classList.add('active');
        })
        this.template.querySelector('.allEmojiContainer').addEventListener('click',function(event){
            event.stopPropagation();
        })
        let ele = parentThis.template.querySelectorAll(".EmojiIcon");
        $(ele).click(function(){
          //  console.log('getFieldsHandler', parentThis.template.querySelector('.EmojiIcon').getAttribute('alt'));
          //  parentThis.template.querySelector('.utilityTextArea').value= parentThis.template.querySelector('.EmojiIcon').getAttribute('alt');
            let countChar = parentThis.template.querySelector('.utilityTextArea').value.length;
            let limit = parentThis.charlimit;
            if(countChar+2 <= limit)
            {
                // if(!parentThis.emojiDisabled){
                    let previousTextVal = parentThis.template.querySelector('.utilityTextArea');
                    let  start = previousTextVal.selectionStart;
                    let end = previousTextVal.selectionEnd;
                    let text = previousTextVal.value;
                    let before = text.substring(0, start);
                    let after  = text.substring(end, text.length);
                    previousTextVal.value = (before + $(this).attr("alt")+ after);
                    previousTextVal.selectionStart = previousTextVal.selectionEnd = start + $(this).attr("alt").length;
                    previousTextVal.focus();
                    parentThis.handleKeyUp();
                // }
            }
            
        });
    }
     catch(error) {
        console.log('=======allEmjContainer ',error);
    }
  } 
  removeActiveClass(parentThis){  //Make Emoji Tabs Active/Inactive When Switching Between Them
        try{
            parentThis.template.querySelector('.tab-content .tab.active').classList.remove('active');
            parentThis.template.querySelector('.tab-links li.active').classList.remove('active');
        }catch(error){console.log('-------->>>>>>>>>>catch emoji',error);}
    }
   connectedCallback(){
      getLables()
      .then(result=>{
        this.listLabels=JSON.parse(result);
      })
      .catch(error=>{
          console.log('error---->',error);
      });
      let parentThis = this;
      this.template.addEventListener('click',e=>{
        if(e.target && !e.target.closest('.folderContainer'))
        {
          parentThis.isFolder = false;
        }
        if(e.target && !e.target.closest('.emojiComponent'))
        {
          parentThis.template.querySelector('.allEmojiContainer').style.display = 'none';
        }
      })
  getObjectList()
            .then(result=>{
              let excludedObjects = ['CampaignMember', 'tdc_tsw__Survey_Response__c', 'Quote','tdc_tsw__Message__c'];
              result = result.filter(obj => !excludedObjects.includes(obj.value));
               this.objectList=result;
            const objUser= {
                    label:'$User',
                    value:'User'
                }
                this.generateFormulaObjectList= [...this.generateFormulaObjectList,objUser];
                const objOrganization= {
                    label:'$Organization',
                    value:'Organization'
                }
                this.generateFormulaObjectList= [...this.generateFormulaObjectList,objOrganization];
                for(let key in result){
                    this.generateFormulaObjectList=[...this.generateFormulaObjectList,result[key]];;
                }
                this.emojiTable(parentThis);
             })
            .catch(error=>{
                console.log('error---->',error);
            });
            getStatusPickList()
            .then(result=>{
               for(let key in result){
                    var obj = {label: result[key], value: key};
                    this.statusOptions = [ ...this.statusOptions, obj ];
                }
            })
            .catch(error=>{
                console.log('error---->',error);
            });
            getChannelPickList()
            .then(result=>{
                for(let key in result){
                    var obj = {label: result[key], value: key};
                    this.channelOptions = [ ...this.channelOptions, obj ];
                }
            })
            .catch(error=>{
                console.log('error---->',error);
            });
          }
          handleClickAdd(){
           if (this.template.querySelector('lightning-radio-group').value === 'Quickreplies') {
            this.addInputField++;
             if (this.addInputField > 2) {
              this.addInputField=1;
            }
             if (this.addInputField === 1) {
               this.addNewField1=true;
             }
             if (this.addInputField === 2) {
              this.addNewField2=true;
              this.quickReplyAddDisable=true;
            }
            }
             if (this.template.querySelector('lightning-radio-group').value === 'Calltoaction') {
              this.addNewField1=true;
              this.quickReplyAddDisable=true;
            }
          }
          handleApprovedButton(){
            this.showFields=true;
            this.addNewField1=false;
            this.addNewField2=false;
            this.quickReplyAddDisable=false;
          }
          handleClickClose1(event){
            // console.log('handleClickClose');
           this.addNewField1=false;
           this.inputValue2='';
           this.quickReplyAddDisable=false;
          
          }
          handleClickClose2(event){
            // console.log('handleClickClose');
           this.addNewField2=false;
           this.inputValue3='';
           this.quickReplyAddDisable=false;
          
          }
          inputHandler1(event){
           this.inputValue1=event.target.value;
           }
          inputHandler2(event){
            this.inputValue2=event.target.value;
            }
           inputHandler3(event){
            this.inputValue3=event.target.value;
            }
         handleSubmitNewRecord(event){
            this.addNewFolder=false;
            this.isFolder=false;
            this.folderName= event.detail.fields.Name.value;
            }
          handleGetFolders(){
           this.isFolder=true;
            getFolders().then(result=>
              {
                 this.folderOptions=result;
              }
              )
              .catch(error=>{
                console.log('error---->',error);
            });
          }
          handleGetFolderName(event){
           this.folderName=event.target.dataset.var;
            this.isFolder=false;
          }
          closeModal2(){
            this.addNewFolder=false;
          }
          cancelFolder(){
            this.addNewFolder=false;
            this.isFolder=false;
          }
          
          handleSelectChannelChange
          (event){
            this.selectedChannelValues = event.detail.value;
          }
          selectObjectHandler(event){
            this.selectedObject = event.detail.value;
          }
          selectStatusHandler(event){
            this.selectedStatus = event.target.value;
          }
          handleChangeTemplateName(event){
            this.templateName = event.target.value;
          }
          handleDescriptionChange(event){
            this.description = event.target.value;
          }
          handleClickFolder(){
             this.isFolder=true;
          }
          handleAddNewFolder(){
            this.addNewFolder=true;
          this.isFolder=false;
          }
          generateFormulaObjectListtHandler(event){
            this.formula='';
             this.isFinalFormula=false;
            this.isExpand=false;
            this.isExpand1=false;
            this.isExpand2=false;
            this.isExpand3=false;
            this.isExpand4=false;
            this.fieldName=[];
            this.value=true;
           
            this.formula = '{!'+event.target.value;
            this.formula= this.formula.toLowerCase();
            this.myMap.set(0,  this.formula );
            // console.log('getFieldsHandler', this.myMap);
             this.Object = event.target.value;
           this.Heading=event.target.value+' Fields';
            findRelatedField({currentSelectfield:this.Object})
            .then(result=>{
         let fields = Object.keys(result.lstOfField).map(key => {
              return { label: result.lstOfField[key], value: key };
            });
            fields.sort((a, b) => a.label.trim().localeCompare(b.label.trim(), undefined, { ignorePunctuation: true, sensitivity: 'base' }));
            this.fieldName = fields;
           })
            .catch(error=>{
                console.log('error---->',error);
            });
          }
          getFieldsHandler(event){
           this.fieldName2=[];
              this.isExpand=false;
            this.isExpand1=false;
            this.isExpand2=false;
            this.isExpand3=false;
            this.isExpand4=false;
            // const dotArray = this.formula.split('.');
            this.Heading=event.target.dataset.label +' Fields';
              var headingName=event.target.dataset.value;
              this.Object2 = headingName;
              if (this.Object2 === 'masterrecord' || this.Object2 === 'reportsto' || this.Object2 === 'parent' || this.Object2 === 'asset' || this.Object2 === 'rootasset' || this.Object2 === 'convertedcontact' || this.Object2 === 'parentworkorder' || this.Object2 === 'rootworkorder') {
                this.Object2 = this.Object;
              }
              if (event.currentTarget.closest('.scrollable-container') != null) {
                // console.log('getFieldsHandler',  event.currentTarget.closest('.scrollable-container'));
                this.index=1;
                // console.log('getFieldsHandler', this.index);
           
              }
              findRelatedField({currentSelectfield:this.Object2})
              .then(result=>{
                if (result.lstOfField && Object.keys(result.lstOfField).length !== 0) {
                  this.isExpand=true;
                  // console.log('getFieldsHandler', this.myMap);
                  this.formula = this.myMap.get(this.index-1)+ '.'+headingName ;
                  // console.log('getFieldsHandler', this.formula);
                  this.isFinalFormula=false;
                  this.myMap.set(this.index,  this.formula );
                }
                else{
                  this.formula = this.myMap.get(this.index-1)+ '.'+headingName +'}';
                  // console.log('getFieldsHandler', this.formula);
                  this.formulaBugFix = this.formula;
                  this.isFinalFormula=true;
                  this.myMap.set(this.index,  this.formula );
                }
                let fields = Object.keys(result.lstOfField).map(key => {
                return { label: result.lstOfField[key], value: key };
              });
              fields.sort((a, b) => a.label.trim().localeCompare(b.label.trim(), undefined, { ignorePunctuation: true, sensitivity: 'base' }));
              this.fieldName2 = fields;
             })
              .catch(error=>{
                  console.log('error---->',error);
              });
            }
            getFieldsHandler1(event){
              this.Heading=event.target.dataset.label +' Fields';
               var headingName=event.target.dataset.value;
              this.Object3 = headingName;
              if (event.currentTarget.closest('.scrollable-container1') != null) {
                // console.log('getFieldsHandler',  event.currentTarget.closest('.scrollable-container1'));
                this.index=2;
                // console.log('getFieldsHandler', this.index);
           
              }
              if (this.Object3 === 'masterrecord' || this.Object3 === 'reportsto' || this.Object3 === 'parent' || this.Object3 === 'asset' || this.Object3 === 'rootasset' || this.Object3 === 'convertedcontact' || this.Object3 === 'parentworkorder' || this.Object3 === 'rootworkorder') {
                this.Object3 = this.Object2;
              }
             
              // const dotArray = this.formula.split('.');
             this.isExpand2=false;
              this.isExpand3=false;
            this.isExpand4=false;
              this.fieldName3=[];
             
              findRelatedField({currentSelectfield:this.Object3})
              .then(result=>{
                if (result.lstOfField && Object.keys(result.lstOfField).length !== 0) {
                  this.isExpand=true;
                  this.isExpand2=true;
                  // console.log('myMap', this.myMap);
                  this.formula = this.myMap.get(this.index-1)+ '.'+headingName ;
                  // console.log('getFieldsHandler', this.formula);
                  this.isFinalFormula=false;
                  this.myMap.set(this.index,  this.formula );
                }
                else{
                  this.formula = this.myMap.get(this.index-1)+ '.'+headingName +'}';
                  // console.log('getFieldsHandler', this.formula);
                  this.formulaBugFix = this.formula;
                  this.isFinalFormula=true;
                  this.myMap.set(this.index,  this.formula );
                }
                
                let fields = Object.keys(result.lstOfField).map(key => {
                return { label: result.lstOfField[key], value: key };
              });
              fields.sort((a, b) => a.label.trim().localeCompare(b.label.trim(), undefined, { ignorePunctuation: true, sensitivity: 'base' }));
              this.fieldName3 = fields;
             })
              .catch(error=>{
                  console.log('error---->',error);
              });
            }
            getFieldsHandler2(event){
              this.Heading=event.target.dataset.label +' Fields';
              var headingName=event.target.dataset.value;
              this.Object4 = headingName;
              if (event.currentTarget.closest('.scrollable-container2') != null) {
                // console.log('getFieldsHandler',  event.currentTarget.closest('.scrollable-container2'));
                this.index=3;
                // console.log('getFieldsHandler', this.index);
           
              }
              if (this.Object4 === 'masterrecord' || this.Object4 === 'reportsto' || this.Object4 === 'parent' || this.Object4 === 'asset' || this.Object4 === 'rootasset' || this.Object4 === 'convertedcontact' || this.Object4 === 'parentworkorder' || this.Object4 === 'rootworkorder') {
                this.Object4 = this.Object3;
              }
             this.fieldName4=[];
              this.isExpand3=false;
              this.isExpand4=false;
             
              findRelatedField({currentSelectfield:this.Object4})
              .then(result=>{
                if (result.lstOfField && Object.keys(result.lstOfField).length !== 0) {
                 this.isExpand3=true;
                //  console.log('myMap', this.myMap);
                  this.formula = this.myMap.get(this.index-1)+ '.'+headingName ;
                  // console.log('getFieldsHandler', this.formula);
                  this.isFinalFormula=false;
                  this.myMap.set(this.index,  this.formula );
                }
                else{
                  this.formula = this.myMap.get(this.index-1)+ '.'+headingName +'}';
                  // console.log('getFieldsHandler', this.formula);
                  this.formulaBugFix = this.formula;
                  this.isFinalFormula=true;
                  this.myMap.set(this.index,  this.formula );
                }

                let fields = Object.keys(result.lstOfField).map(key => {
                return { label: result.lstOfField[key], value: key };
              });
              fields.sort((a, b) => a.label.trim().localeCompare(b.label.trim(), undefined, { ignorePunctuation: true, sensitivity: 'base' }));
              this.fieldName4 = fields;
             })
              .catch(error=>{
                  console.log('error---->',error);
              });
            }
            getFieldsHandler3(event){
              this.Heading=event.target.dataset.label +' Fields';
              // const dotArray = this.formula.split('.');
              this.fieldName5=[];
              var headingName=event.target.dataset.value;
              this.Object5 = headingName;
              if (event.currentTarget.closest('.scrollable-container3') != null) {
                // console.log('getFieldsHandler',  event.currentTarget.closest('.scrollable-container3'));
                this.index=4;
                // console.log('getFieldsHandler', this.index);
           
              }
              if (this.Object5 === 'masterrecord' || this.Object5 === 'reportsto' || this.Object5 === 'parent' || this.Object5 === 'asset' || this.Object5 === 'rootasset' || this.Object5 === 'convertedcontact' || this.Object5 === 'parentworkorder' || this.Object5 === 'rootworkorder') {
                this.Object5 = this.Object4;
              }
              this.isExpand4=false;
             findRelatedField({currentSelectfield:this.Object5})
              .then(result=>{
                if (result.lstOfField && Object.keys(result.lstOfField).length !== 0) {
                  this.isExpand4=true;
                  // console.log('myMap', this.myMap);
                  this.formula = this.myMap.get(this.index-1)+ '.'+headingName ;
                  // console.log('getFieldsHandler', this.formula);
                  this.isFinalFormula=false;
                  this.myMap.set(this.index,  this.formula );
                }
                else{
                  this.formula = this.myMap.get(this.index-1)+ '.'+headingName +'}';
                  // console.log('getFieldsHandler', this.formula);
                  this.formulaBugFix = this.formula;
                  this.isFinalFormula=true;
                  this.myMap.set(this.index,  this.formula );
                }let fields = Object.keys(result.lstOfField).map(key => {
                return { label: result.lstOfField[key], value: key };
              });
              if (fields.some(obj => obj.label.includes('>'))) {
                fields = fields.map(obj => {
                  obj.label = obj.label.replace('>', 'ID');
                  return obj;
                });
              }
              fields.sort((a, b) => a.label.trim().localeCompare(b.label.trim(), undefined, { ignorePunctuation: true, sensitivity: 'base' }));
              this.fieldName5 = fields;
             })
              .catch(error=>{
                  console.log('error---->',error);
              });
            }

            getFieldsHandler4(event){
              this.Heading=event.target.dataset.label +' Fields';
              // const dotArray = this.formula.split('.');
              // this.fieldName5=[];
              var headingName=event.target.dataset.value;
              this.Object6 = headingName;
              if (event.currentTarget.closest('.scrollable-container4') != null) {
                // console.log('getFieldsHandler',  event.currentTarget.closest('.scrollable-container4'));
                this.index=5;
                // console.log('getFieldsHandler', this.index);
           
              }
              if (event.target.dataset.label.includes('ID') && !event.target.dataset.value.includes('id')) {
                // console.log('ObjChannel>>>>>>>>>>>>',label);
                headingName =event.target.dataset.value+'id';
              }
               this.formula = this.myMap.get(this.index-1)+ '.'+headingName +'}';
                  // console.log('getFieldsHandler', this.formula);
                  this.formulaBugFix = this.formula;
                  this.isFinalFormula=true;
                  this.myMap.set(this.index,  this.formula );
               }
          handleMessage(event){
            this.textMessage=event.target.value;
          }
          countchar(textMsg, c) {
            try {
              let result = 0,
                i = 0;
              for (i; i < textMsg.length; i++) {
                if (textMsg[i] === c) result++;
              }
              return result;
            } catch (e) {
            }
          }
          isGSMAlphabet(textMsg) {
            try {
              var regexp = new RegExp(
                "^[A-Za-z0-9 @!\"#$%&'`()*+,_\\-./:;<=>?^{}\\\\\\[~\\]|\\r\\n]*$"
              );
              return regexp.test(textMsg);
            } catch (error) { }
          }
          handleKeyUp() {
            try{
              // console.log('handleKeyUp Result---->');
                      
              let ele = this.template.querySelector('.utilityTextArea');
              if(ele.scrollHeight  > ele.clientHeight)
                  this.template.querySelector(".emojiComponent").style.right = "16px";
              else
                  this.template.querySelector(".emojiComponent").style.right = "5px";
            this.messageText = this.template.querySelector('.utilityTextArea').value;
            this.textMessage = this.template.querySelector('.utilityTextArea').value;
            // console.log('handleSave Result---->',this.textMessage);
                      
            let segment = 1;
            let isTrue = this.isGSMAlphabet(this.messageText);
            let nonGsmLength = this.messageText.length;
            let strLength = this.messageText.length + this.countchar(this.messageText,'{') + this.countchar(this.messageText, '}') + this.countchar(this.messageText, '[') + this.countchar(this.messageText, ']');
            if(isTrue) {
                if (strLength <= 160) {
                    segment = 1;
                } else {
                    if (strLength % 153 === 0)
                        segment = (strLength / 153);
                    else
                        segment = (strLength / 153) + 1;
                }
            }else {
                if (nonGsmLength <= 70) {
                    segment = 1;
                } else {
                    if (nonGsmLength % 67 === 0)
                        segment = (nonGsmLength / 67);
                    else
                        segment = (nonGsmLength / 67) + 1;
                }
            }
            if (nonGsmLength === 0) {
                segment = 0;
            }
            let showSegment =0;
            showSegment = parseInt(segment,10); 
             if( nonGsmLength == 1 ){
                this.template.querySelector('.segmentId').innerHTML = nonGsmLength+' Characters / '+showSegment+' Segment :'+parseInt(segment,10)+' (Segment will depend on merge fields)';
                }else if( showSegment == 0 ){
                this.template.querySelector('.segmentId').innerHTML = 'You can enter up to ' + this.charlimit + ' characters';
             }else if( showSegment >= 1 ){
                this.template.querySelector('.segmentId').innerHTML = nonGsmLength+' Character / '+showSegment+' Segment :'+parseInt(segment,10)+' (Segment will depend on merge fields)';
            }else{
                if(nonGsmLength ==0 ){ // Added else if for charater count issue after removing all characters from text area.
                    this.template.querySelector('.segmentId').innerHTML = 'You can enter up to ' + this.charlimit + ' characters';
               }
                else{
                    this.template.querySelector('.segmentId').innerHTML = nonGsmLength+' Characters /1 Segment :'+parseInt(segment,10)+' (Segment will depend on merge fields)';;
                  
                }
            }
        }catch(e){
            console.log('======catch char count',e);
        }
          }
         handleSave(event){ 
          console.log('handleSave Result---->',this.textMessage);
                      
          this.inputValue = this.inputValue1 || null;
          if (this.inputValue2) {
            this.inputValue += ' ' + this.inputValue2;
          }
          if (this.inputValue3) {
            this.inputValue += ' ' + this.inputValue3;
          }
          //  console.log('messageText',JSON.stringify(this.inputValue));
          if (this.templateName == null ||  this.templateName === '') {
            this.dispatchEvent(
              new ShowToastEvent({
                  title: 'Error!',
                  message: 'Please Enter Template Name',
                  variant: 'error',
              }),
          );
          }
          else  if (this.selectedObject == null ||  this.selectedObject === '') {
            this.dispatchEvent(
              new ShowToastEvent({
                  title: 'Error!',
                  message: 'Please Select an Object',
                  variant: 'error',
              }),
          );
          }

          else if (this.textMessage == null ||  this.textMessage === '') {
            // console.log('hello');
            this.dispatchEvent(
              new ShowToastEvent({
                  title: 'Error!',
                  message: 'Please Enter Template Body',
                  variant: 'error',
              }),
          );
          }
          else{
            saveTemplate({messageText:this.textMessage,templateName:this.templateName, description:this.description, setStatus:this.selectedStatus,  strObjectName:this.selectedObject,  channel:JSON.stringify(this.selectedChannelValues), folder:this.folderName, CTAButton: JSON.stringify(this.inputValue)})
                    .then(result=>{
                      console.log('handleSave Result---->',this.textMessage);
                      // this.textMessage=null;
                      this.template.querySelector('.utilityTextArea').value=null;
                      this.templateName='';
                      this.description='';
                      this.selectedStatus='Active';
                      this.selectedObject='';
                      this.selectedChannelValues=[];
                      this.folderName='';
                      this.inputValue1='';
                      this.inputValue2='';
                      this.inputValue3='';
                      this.addNewField1=false;
                      this.addNewField2=false;
                      this.showFields=false;
                      this.value=false;
                      this.Object='';
                      this.isFinalFormula=false;
                      this.formulaBugFix='';
                      this.template.querySelector('lightning-radio-group').value='';
                      this.template.querySelector('.segmentId').innerHTML = 'You can enter up to ' + this.charlimit + ' characters';
                  })
                    .catch(error=>{
                      console.log('error---->',error);
                  });
                }
            }
            handleCancel(event){
              console.log(event.target.value);
              
            }
            onSearchClick(){
              console.log('onSearchClick');
              this.search=true;
            }
 }

