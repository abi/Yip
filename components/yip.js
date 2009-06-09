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
  showGrowlNotification : function showGrowlNotification(aNotifyObject){
    
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
    
    //This is dumb but we have to do this
    if(icon == "http://www.meebo.com")
      icon = "http://s2.meebo.com/skin/onyx/img/network/meebome_20_online.png";
    
    try {
      var classObj = Cc["@mozilla.org/alerts-service;1"];
      var alertService = classObj.getService(Ci.nsIAlertsService);
      alertService.showAlertNotification(icon, title, text, textClickable, "", alertListener);
    } catch (e) {
      Components.utils.reportError(e);
    }

  },
  showNotification : function showNotification(aTitle, aText, aImageURI){
    
    //This is dumb but we have to do this
    if(aImageURI == "http://www.meebo.com")
      aImageURI = "http://s2.meebo.com/skin/onyx/img/network/meebome_20_online.png";
      
    try {
      var classObj = Cc["@mozilla.org/alerts-service;1"];
      var alertService = classObj.getService(Ci.nsIAlertsService);
      alertService.showAlertNotification(aImageURI, aTitle, aText);
    } catch (e) {
      dump(e);
    }
  }
  // displayNotification : function(){ //supports all options }
};

var components = [Yip];

function NSGetModule(compMgr, fileSpec) {
  return XPCOMUtils.generateModule(components);
}
