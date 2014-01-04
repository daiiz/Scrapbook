var page = {"title": "---", "url": "---", "color": "", "character": ""};


function setPalette() {
   var g = document.getElementsByClassName("palette");
   for(var t = 0; t < g.length; t++) {
      g[t].style.backgroundColor = g[t].id;
   }
}

function cgColor(e) {
    document.getElementById("bigIcon").style.backgroundColor = e.target.id;
    document.getElementById("inp").style.backgroundColor = e.target.id;
}

function addPage(e) {
    page.character = document.getElementById("inp").value;
    page.color = document.getElementById("inp").style.backgroundColor;
    if(page.title != "---" && page.url != "---" && page.character != "?" && page.character != "") {
       var ky = encodeURLtoKEY(page.url);
       addItem(ky, [], page, added);
       // console.log(page);
    }else {
       addPage();
    }
    return;
}

function added() {
    console.log("the item was added.");
}

function openPage(e) {
   chrome.tabs.create({url: "main.html"}, function() {
       window.close();
   });
   //window.open("main.html");
}


document.getElementById("colors").addEventListener("click", cgColor, false);
document.getElementById("addBtn").addEventListener("click", addPage, false);
document.getElementById("openBtn").addEventListener("click", openPage, false);

/* 読み込み完了時実行 */
chrome.tabs.getSelected(window.id, function (tab) {
    //tab.urlに開いているタブのURLが入っている
    page.title = tab.title;
    page.url = tab.url;
});
setPalette();
localStore.open("pizza", "chromelocalstorage", loadend);

function loadend() {
    document.getElementById("inp").focus();
}

