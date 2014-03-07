// # releaseするときは、0にする。
var dev_chanel = 1;

!function() {
if(dev_chanel == 1) {
   localStorage["dev_chanel"] = "y";
   if(document.getElementsByTagName("title")[0] != undefined) {
      document.getElementsByTagName("title")[0].innerHTML = "[dev] " + document.getElementsByTagName("title")[0].innerHTML;
   }
   chrome.browserAction.setBadgeText({"text": "dev"});
   chrome.browserAction.setBadgeBackgroundColor({"color": "#FF0000"});
}else {
   localStorage["dev_chanel"] = "n";
}
}();