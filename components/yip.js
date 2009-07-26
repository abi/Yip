Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

const Ci = Components.interfaces;
const Cc = Components.classes;

function Yip() { }

Yip.prototype = {
  classDescription: "Yip Notifications Javascript XPCOM Component",
  classID:          Components.ID("{102DF778-5108-11DE-86DB-AAF855D89593}"),
  contractID:       "@foyrek.com/yip;1",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIYip, Ci.nsIClassInfo]),
  _xpcom_categories: [{category: "JavaScript global property", entry: "fluid"}, 
                      {category: "JavaScript global property", entry: "platform"}],
  implementationLanguage: Ci.nsIProgrammingLanguage.JAVASCRIPT,
  flags: Ci.nsIClassInfo.DOM_OBJECT,
  getInterfaces: function(countRef) {
     var interfaces = [Ci.nsIYip, Ci.nsIClassInfo, Ci.nsISupports];
     countRef.value = interfaces.length;
     return interfaces;
  },
  getHelperForLanguage:  function(count) {return null;},
  // This is where we add support for various notification systems 
  // such as libnotify, Snarl and Growl for Windows
  displayNotification : function(aNotifyObject){
    
    var title = aNotifyObject.title ? aNotifyObject.title : "Yip Notification";
    var text = aNotifyObject.description ? aNotifyObject.description : "";
    var icon = aNotifyObject.icon ? aNotifyObject.icon : "chrome://yip/content/images/icon.png";
    var textClickable = false;
    var cookie = "";
    var alertListener = null;
    
    var {onclick, onfinished} = aNotifyObject;
    if (onclick || onfinished) {
      textClickable = true;
      alertListener = {
        observe: function alertObserver(subject, topic, data) {
          if (topic === "alertclickcallback" && onclick)
            onclick();
          else if (topic === "alertfinished" && onfinished)
            onfinished();
        }
      };
    }
    
    var osString = Cc["@mozilla.org/xre/app-info;1"]
                   .getService(Ci.nsIXULRuntime).OS;
    var msgSent = false;
    
    if(osString == "WINNT"){
      // open the interface to Snarl
      const cid = "@tlhan-ghun.de/snarlInterface;5";
      var snarlInterface = Cc[cid].createInstance();
      snarlInterface = snarlInterface.QueryInterface(Ci.ISNARLINTERFACE);
      
      // check if Snarl is running
      if (snarlInterface.snGetIsRunning()){
        try{
          //send notification
          snarlInterface.snShowMessage(title, text, 15 ,icon,0,0);
          // avoid that is send again
          msgSent = true;
        }catch(e){
          msgSent = false;
        }
      }
    }else if(osString == "Linux"){
      //Use libnotify
    }
    
    if(!msgSent){
      try {
        var classObj = Cc["@mozilla.org/alerts-service;1"];
        var alertService = classObj.getService(Ci.nsIAlertsService);
        alertService.showAlertNotification(icon, title, text, textClickable, "", alertListener);
      } catch (e) {
        Components.utils.reportError(e);
      }
    }
    
  },
  showGrowlNotification : function showGrowlNotification(aNotifyObject){
    this.displayNotification(aNotifyObject);
  },
  showNotification : function showNotification(aTitle, aText, aImageURI){
    var aNotifyObject = {
      title : aTitle,
      description : aText,
      icon : aImageURI
    }
    this.displayNotification(aNotifyObject);
  }
};

var components = [Yip];

function NSGetModule(compMgr, fileSpec) {
  return XPCOMUtils.generateModule(components);
}