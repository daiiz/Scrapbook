// scrapbook v0.2.3

var myApp = myApp || {};
myApp.keepDATA = [];

// -------継承--------
function showQ(q) {
   console.info("showQ: "+q);
   var mkys = getKEYbyQuery(q);
   //console.log(mkys.length);
     if(mkys != undefined) {
         getItem(mkys, gotItems);
     }
}

/* カラーコード調整 */
function color(c) {
  var rc;
  switch(c) {
    case "lime": rc = "#59BB0A"; break;
    case "yellow": rc = "#FFDD00";break;
    default: rc = c; break;
  }
  return rc;
}

/* インポートfileを読み込む */
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    f = files[0];
    var reader = new FileReader();
    reader.onload = (function(theFile) {
       ar = JSON.parse(theFile.target.result);
       console.log(ar);
       importItems(ar);
    });
    reader.readAsText(f);
}

/* モバイルアプリ用共有コードを読み込む */
function importing() {
   if(document.getElementById("InI").value != "") {
     var ar = JSON.parse(document.getElementById("InI").value);
     importItems(ar);
   }
}


/* エクスポートファイル生成 */
function output2file(q,v) {
   console.info("エクスポートファイルを生成します: "+ v);
   var takeoutCode = q;
   if(takeoutCode != "") {
      var blob = new Blob([takeoutCode],{type: "text/plain"});
      var link = window.webkitURL.createObjectURL(blob);
   }
   document.getElementById("DL").href = link;
}

/* すべてのデータを削除 */
function rmv_all() {
    if(window.confirm('すべてのページデータを消去してよろしいですか？この操作は取り消せません。')){
		       chrome.storage.local.clear();
         location.reload();
    }else {
    }
}

/* コールバック： アイテム取得時 */
function gotItems(j) {
   DATA = [];
   var arr;
   //console.log(j.uniqueKeys.length);
   for(var w = 0; w < j.uniqueKeys.length; w++) {
       var mky = j.uniqueKeys[w];
       DATA.push(j.items[mky]);
   }
   var type = document.getElementById("function_menu").value;
   //console.log(DATA.length);
     if(type == "user-text") {
         document.getElementById("io_center").style.display = "none";
         arr = setArrForIcon(DATA, type);
     }else if(type == "user-card") {
         document.getElementById("io_center").style.display = "none";
         arr = setArrForCard(DATA, type);
     }else if(type == "user-edit") {
         document.getElementById("io_center").style.display = "none";
         arr = setArrForEdit(DATA, type);
     }else {
         arr = setArrForCard(DATA, "user-card");
     }
     /* エクスポート設定 */
     var vl = document.getElementById("select_menu").value;
     document.getElementById("DL").download = vl + "-scrapbook"
     var dstr = '["' + vl + '",' + JSON.stringify(DATA) + "]";
     if(vl == "すべて") {
        document.getElementById("remove_all").style.display = "inline";
     }else {
        document.getElementById("remove_all").style.display = "none";
     }
     document.getElementById("InO").value = dstr;
     output2file(dstr, vl);
     /* ここまで */
     
     if(arr != "N") {
        //console.log(arr.length);
        myApp.renderingCards(arr);
     }
}

/* アイコン表示用 */
function setArrForIcon(DATA, type) {
   var arr = [];
   for(var t = 0; t < DATA.length; t++) {
       var scid = "D"+t;
       var dataset = [["url", DATA[t].url]];
       var init = DATA[t].character;
       var card = color(DATA[t].color);
       var title = DATA[t].title;
       arr.push({"id":scid, "type":type, "dataset":dataset, "init":init, "card":card, "title":title});
   }
   griddles.layout.card_width_px = 60;
   griddles.layout.card_height_px = 60;
   return arr;
}

/* カード表示用 */
function setArrForCard(DATA, type) {
   var arr = [];
   for(var t = 0; t < DATA.length; t++) {
       var scid = "D"+t;
       var dataset = [["url", DATA[t].url]];
       var init = '' + 
                  '<div id="color_'+ t +'" class="color" data-url="'+ DATA[t].url +'" style="background-color: '+ color(DATA[t].color) +'">'+ DATA[t].character +'</div>'+
                  '<div class="title" data-url="'+ DATA[t].url +'" id="title_'+ t +'">'+ DATA[t].title +'</div>'+
                  '<br>'+
                  '<div class="url" data-url="'+ DATA[t].url +'" id="url_'+ t +'">'+ DATA[t].url +'</div>'+
                  '';
       var card = "#fff";
       var title = DATA[t].title;
       arr.push({"id":scid, "type":type, "dataset":dataset, "init":init, "card":card, "title":title});
   }
   griddles.layout.card_width_px = 300;
   griddles.layout.card_height_px = 85;
   return arr;
}

/* 編集カード表示用 */
function setArrForEdit(DATA, type) {
   myApp.keepDATA = DATA;
   var arr = [];
   for(var t = 0; t < DATA.length; t++) {
       /* タグを取得 */
       var qa = [];
       var refQuerys = getRelationQuery(DATA[t].tag_x);
       for(var p = 0; p < refQuerys.length; p++) {
           if(refQuerys[p] != "すべて") {
               qa.push(refQuerys[p]);
          }
       }
       var qa_str = qa.toString();
       
       var scid = "D"+t;
       var dataset = [["non_url", DATA[t].url]];
       var init = DATA[t].character;
       var init = '' + 
                  '<div id="cha_'+ t +'" class="color" style="background-color: '+ color(DATA[t].color) +'">'+ DATA[t].character +'</div>'+
                  '<div class="title" id="e_title_'+ t +'">'+ DATA[t].title +'</div>'+
                  '<br>'+
                  '<input class="tags" type="text" id="e_tags_'+ t +'" title="カンマ区切りで複数指定ができます" placeholder="タグをカンマ区切りで入力" value="'+ qa_str +'">'+
                  '<br>'+
                  '<div class="eBtns">'+
                  '<button id="e_update_'+ t +'" data-tagx="'+ DATA[t].tag_x +'">更新</button>'+
                  '<button id="e_remove_'+ t +'" data-tagx="'+ DATA[t].tag_x +'">削除</button>'+
                  '</div>'+
                  '';
       var card = "#fff";
       var title = DATA[t].title;
       arr.push({"id":scid, "type":type, "dataset":dataset, "init":init, "card":card, "title":title});
   }
   griddles.layout.card_width_px = 300;
   griddles.layout.card_height_px = 120;
   return arr;
   
}

/* アイテムのタグが更新されたとき実行する部分 */
function updated() {
   console.info("タグアップデート完了:");
   showTable(setMenu);
   var tags = validQuery();
   myApp.settingSelectBox(tags);
}

/* アイテムが削除されたとき実行する部分 */
function removed() {
   showTable(setMenu);
   var tags = validQuery();
   myApp.settingSelectBox(tags);
}
// --------------------------
myApp.load = function(e) {
   console.info("スクラップブック： 起動");
   var tags = validQuery();
   myApp.settingSelectBox(tags);
   showQ("すべて");
}

myApp.changedSelectBox = function(e) {
   var val = e.target.value;
   console.info("myApp.changedSelectBox: "+ val);
   showQ(val);
}

myApp.changedFunctionSelectBox = function(e) {
   var type = document.getElementById("function_menu").value;
   console.info("myApp.changedFunctionSelectBox: "+ type);
   if(type.search(/user-/) != -1) {
       showQ(document.getElementById("select_menu").value);
   }else {
       document.getElementById("io_center").style.display = "block";
       //arr = "N";
       showQ(document.getElementById("select_menu").value);
   }
}

myApp.settingSelectBox = function(options) {
    var optionTags = "";
    for(var i = 0; i < options.length; i++) {
       var opt = options[i];
       optionTags = optionTags + '<option value="'+ opt +'">'+ opt +'</option>';
    }
    document.getElementById("select_menu").innerHTML = optionTags;
    document.getElementById("select_menu").addEventListener("change", myApp.changedSelectBox, false);
}

myApp.renderingCards = function(cards) {
   griddles.layout.cards = cards;
   griddles.render = true;  /* important! */
   griddles.load();
}

document.getElementById("function_menu").addEventListener("change", myApp.changedFunctionSelectBox, false);
document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById("import").addEventListener("click", importing, false);
document.getElementById("remove_all").addEventListener("click", rmv_all, false);
document.getElementById("app_icon").addEventListener("click", function(){
  window.open("../options.html");
}, false);
localStore.open("pizza", "chromelocalstorage", myApp.load);
//window.addEventListener("load", myApp.load, false);
