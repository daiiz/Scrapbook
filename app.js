// License: MIT.

DATA = [];
SHOW_TYPE = "icon";
RMV = "";


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
  
  
/* セレクトボックスのオプションタグを返す */
function getSelectOptions() {
    var tags = validQuery();
    var f = "";
    for(var l = 0; l < tags.length; l++) {
       f = f + '<option value="'+ tags[l] +'">'+ tags[l] +'</option>';
    }
    return f;
}

/* クエリからアイテムを取得する　*/
function getItemsBySelectbox(cb, stp) {
    SHOW_TYPE = stp;
    var newValue = document.getElementById("selectbox").value;
    setCategory(newValue);
    var mkys = getKEYbyQuery(newValue);
    if(mkys != undefined) {
        getItem(mkys, cb);
    }
}


/* 先頭のメニューを表示する部分 */
function setMenu() {
var menu = {"titleStr": "カテゴリを選択してください：　", "btnStr": "詳細"};

var divIO = '<div id="io" style="display:none"><div id="_O_"><b>共有コードをエクスポート</b><div class="ww">このカテゴリの共有コード:　<a href="" download="takeout" id="DL">ダウンロード</a><input type="text" id="InO" readonly="readonly" value="" class="_"><a id="remove_all" style="display:none;">アプリ内のページデータを消去</a><button id="outfile" class="_">出力</button><br></div></div><br><div id="_I_"><b>共有コードをインポート</b><div class="ww"><input type="file" id="files" name="files[]" multiple /><br><br>または<br><br><input type="text" id="InI" value="" class="" placeholder="ファイル形式でない共有コード（旧バージョン）"><button id="import" class="">インポート</button></div></div></div>';

hash.model("menu")('<div id=#0 class="mPanel">#1<select class=sel id="selectbox" value>#4</select><button id=#2 class="mButton">#3</button><div class=bar><a id=#5>カードで表示</a> | <a id=#6>アイコンで表示</a> | <a id=#7>編集</a></div>'+ divIO +'</div>');
var options = getSelectOptions();
hash.bind("menu")(["menu_panel", menu.titleStr, "menu_button", menu.btnStr, options, "asCard", "asIcon", "edit"]);

if(hash.controller.menu == undefined) {
hash.controller.menu = function(e) {
   switch(e.target.id) {
       
       case "menu_button": 
           if(document.getElementById("io").style.display == "none") {
               document.getElementById("menu_button").innerHTML = "詳細を隠す";
               document.getElementById("io").style.display = "block";
               document.getElementById("InO").select();
                   
           }else if(document.getElementById("io").style.display = "block"){
               document.getElementById("menu_button").innerHTML = "詳細";
               document.getElementById("io").style.display = "none";
           }
           break;
       
       case "asCard":
           resetDOM();
           getItemsBySelectbox(gotItems, "card");
           break;
       case "asIcon":  
           resetDOM();       
           getItemsBySelectbox(gotItems, "icon");
           break;
       case "edit": 
           resetDOM();
           getItemsBySelectbox(gotItems, "edit");
           break;  
       case "import":
           var ar = JSON.parse(document.getElementById("InI").value);
           importItems(ar);
           break;  
       case "remove_all": 
           rmv_all();
           break;       
   } 
}
}
hash.view("menu");
document.getElementById("selectbox").addEventListener("change", function() {
    resetDOM();
    getItemsBySelectbox(gotItems, SHOW_TYPE);
}, false);
//setCategory("すべて");
//document.getElementById("outfile").addEventListener("click", output2file, false);
document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

function output2file(q) {
   console.log("ex-data-port--settings");
   var takeoutCode = q;
   if(takeoutCode != "") {
      var blob = new Blob([takeoutCode],{type: "text/plain"});
      var link = window.webkitURL.createObjectURL(blob);
   }
   document.getElementById("DL").href = link;
}



/* すべてのページデータを消去 */
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
    // console.log(j);
   for(var w = 0; w < j.uniqueKeys.length; w++) {
       var mky = j.uniqueKeys[w];
       DATA.push(j.items[mky]);
   }
   console.log(DATA);
   document.getElementById("DL").download = document.getElementById("selectbox").value+"-scrapbook"
   if(document.getElementById("selectbox").value == "すべて") {
      var vl = '';
   }else {
      var vl = document.getElementById("selectbox").value;
   }
   
   var dstr = '["' + vl + '",' + JSON.stringify(DATA) + "]";
   document.getElementById("InO").value = dstr;
   //document.getElementById("InO").select();
   
   var req = document.getElementById("selectbox").value;
    if(req == "すべて") {
        document.getElementById("remove_all").style.display = "inline";
    }else {
        document.getElementById("remove_all").style.display = "none";
    }
   
   if(SHOW_TYPE == "icon") {
      showAsIcon(DATA);
   }else if(SHOW_TYPE == "card") {
      showAsCard(DATA);
   }else if(SHOW_TYPE == "edit")  {
      setEditCard(DATA);
   }
   //
   output2file(dstr);
}



/* カテゴリを表示する部分 */
function setCategory(a) {
var category = a;
hash.model('category')('<div class=cat>#0</div>');
hash.bind('category')([category]);
hash.controller.category = function(e) {
}
hash.view("category");
}


/* 編集用カードを表示する部分 */
function setEditCard(husens) {

hash.model('edits')("<div id=#0 class='card' title=#1><div id='' class='color' style='background-color: #3'>#4</div><div class='title' id=#5>#1</div><br><input class='tags' type='text' id=#6 title='カンマ(,)区切りで複数指定ができます' placeholder='カテゴリを入力してください' value=#9><br><div class=eBtns><button id=#7 name=#2>更新</button><button id=#8 name=#2>削除</button></div></div>");

for(var c = 0; c < husens.length; c++) {
    var qa = [];
    var H = husens[c];
    var refQuerys = getRelationQuery(H.tag_x);
    for(var p = 0; p < refQuerys.length; p++) {
       if(refQuerys[p] != "すべて") {
           qa.push(refQuerys[p]);
       }
    }
    var qa_str = qa.toString();
    var pl = qa_str;//(qa_str == "") ? '' : qa_str;
    
    hash.bind('edits')(["edit_"+c, H.title, H.tag_x, H.color, H.character, "e_title_"+c, "e_tags"+c, "e_update_"+c, "e_remove_"+c, pl]);
}


if(hash.controller.edits == undefined) {
    hash.controller.edits = function(e) {
    //var reqNum = e.target.id[(e.target.id).length - 1];
    var reqNum = +((e.target.id).split("_")[2]);
    //var sign = (e.target.id).substring(0, (e.target.id).length - 1);
    var sign = (e.target.id).split("_")[0] + "_" + (e.target.id).split("_")[1] + "_";
    console.log(sign);
        switch(sign) {
            case "e_remove_":
               var mky = e.target.name;
               var arr_querys = getRelationQuery(mky);
               console.log(arr_querys);
               RMV = reqNum;
               removeItem(mky, arr_querys, removed);
            break;
            
            case "e_update_": 
               var mky = e.target.name;
               var jsn = DATA[reqNum];
               var tags = document.getElementById("e_tags" + reqNum).value;
               if(tags != "") {
                   var ts = tags;
                   query = ts.split(",");
                   addItem(mky, query, jsn, updated);
               }
            break;
        }
    }
}

hash.view("edits");
}


function removed() {
    document.getElementById("edit_" + RMV).outerHTML = "";
    RMV = "";
    showTable(setMenu); 
}

/* アイテムのタグが更新されたとき実行する部分 */
function updated() {
   showTable(setMenu);
   //setMenu();
   //console.log(options);
}

/* カードを表示する部分（フル表示） */
function showAsCard(husens) {

hash.model('cards')("<div id=#0 class='card' title='#4'><div id=#1 class='color' style='background-color: #2'>#3</div><div class='title' id=#6>#4</div><br><div class='url' id=#7>#5</div></div>");

for(var c = 0; c < husens.length; c++) {
    var H = husens[c];
    hash.bind("cards")(["card_"+c, "color_"+c, H.color, H.character, H.title, H.url, "title_"+c, "url_"+c]);
}

if(hash.controller.cards == undefined) {
hash.controller.cards = function(e) {
  //var cardNum = (e.target.id)[(e.target.id).length - 1];
  var cardNum = +((e.target.id).split("_")[1]);
  var reqUrl = hash.ArrBinder["cards"][cardNum][5];
  window.open(reqUrl);
}
}

hash.view("cards");
}


/* カードを表示する部分（アイコン表示） */
function showAsIcon(husens) {

hash.model('icons')('<div id=#0 class="icon #2" title="#1" style="background-color: #2" name=#4>#3</div>');

for(var c = 0; c < husens.length; c++) {
    var H = husens[c];
    hash.bind("icons")(["icon_"+c, H.title, H.color, H.character, H.url]);
}

if(hash.controller.icons == undefined) {
hash.controller.icons = function(e) {
  //var cardNum = (e.target.id)[(e.target.id).length - 1];
  var cardNum = +((e.target.id).split("_")[1]);
  var reqUrl = hash.ArrBinder["icons"][cardNum][4];
  window.open(reqUrl);
}
}

hash.view("icons");
}



function showQ(q) {
   var mkys = getKEYbyQuery(q);
     if(mkys != undefined) {
         getItem(mkys, gotItems);
     }
}



//showAsIcon(data);
function loadend() {
    console.log(1);
    setCategory("すべて");
    showQ("すべて");
    setMenu();
}


function resetDOM() {
   document.getElementById("#icons").innerHTML = "";
   document.getElementById("#cards").innerHTML = "";
   document.getElementById("#edits").innerHTML = "";
}


//window.addEventListener("load", loadend, false);
//setMenu();
//window.setTimeout(loadend, 50);
localStore.open("pizza", "chromelocalstorage", loadend);
