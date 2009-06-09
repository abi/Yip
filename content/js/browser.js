(function(){
  
  const VERSION_PREF ="extensions.yip.version";
  const YIP_URL = "about:yip";
  const YIP_ID = "yip@foyrek.com";
  
  //When the user first installs the extension, we show the about:yip page
  var currVersion = Application.prefs.getValue(VERSION_PREF, "firstrun");
  var realVersion = Application.extensions.get(YIP_ID).version;

  if (currVersion != realVersion) {
    Application.prefs.setValue(VERSION_PREF, realVersion);
    window.addEventListener(
      "load",
      function onWindowLoad() {
        window.removeEventListener("load", onWindowLoad, false);
        var tabbrowser = window.getBrowser();
        tabbrowser.addEventListener(
          "load",
          function onBrowserLoad() {
            tabbrowser.removeEventListener("load", onBrowserLoad, false);
            var tab = tabbrowser.addTab(YIP_URL);
            tabbrowser.selectedTab = tab;
          },
          false
        );
      },
      false
    );
  }
  
  const Ci = Components.interfaces;
  const Cc = Components.classes;
 
   Yip = {
     url : function url(spec) {
       var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
       return ios.newURI(spec, null, null);
     },
     openAboutYip : function openAboutYip(){
       Application.activeWindow.open(this.url(YIP_URL)).focus(); 
     }
   }
 
   window.gYip = Yip;
  
})()