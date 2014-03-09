// License: MIT.

var _Q_ALL_ = "すべて";

/* URL を key に変換 */
function encodeURLtoKEY(fullurl) {
   return ((fullurl.replace(/\//gi, "_1_")).replace(/\./gi, "_2_")).replace(/\:/gi,"_0_");
}

/* 有効なquery配列を返す */
function validQuery() {
   var rtnary = [_Q_ALL_];
   var ary = localStore.indexs;
   for(var o = 0; o < ary.length; o++) {
      var mainkeys = getKEYbyQuery(ary[o]);
      if(mainkeys != undefined && mainkeys.length != 0) {
         if(ary[o] != _Q_ALL_) {
               rtnary.push(ary[o]);
         }
      }else {
         console.log("zero value query: "+ ary[o]);
      }
   }
   return rtnary;
}

/* 保存 */
/* queryに、"すべて" を自動付加 */
function addItem(key, query, json, callback) {
  if(key != "" && json != "") {
      var arr = [key, _Q_ALL_];
      //console.log(arr);
    for(var x = 0; x < query.length; x++) {
        if(query[x] != _Q_ALL_) {  //追加
           arr.push(query[x]);
        }
    }
    localStore.setItem(arr, json, callback);
  }
}


/* コンソールに表示 */
function showTable(cb) {
    localStore.hack.showTable(cb);
}

/* query からメインキーを取得する */
function getKEYbyQuery(q) {
    main_keys = localStore.getUniqueKeys(q);
    //console.log(main_keys.length);
    return main_keys;
}

/* JSONオブジェクト を取得する */
function getItem(mkyarr, callback) {
    localStore.getItems(mkyarr, callback);
}


function getRelationQuery(mky) {
    var indexs = localStore.getIndexs(mky);
    return indexs["indexs"];
}


function plusItem(arr, json, cb) {
    waffle.plusItem(arr, json, cb);
}


function removeItem(mky, arr_querys, cb) {
 if(mky != "") {
   var arr = [mky];
   for(var h = 0; h < arr_querys.length; h++) {
       arr.push(arr_querys[h]);
   }
    waffle.minusItem(arr, cb);
 }
}

var __import_length__ = 0;
var __import_now__ = 0;
var __import_itmes__ = "";
var __import_query__ = "";

function importItems(arr) {
    console.log("im-data-port");
    __import_length__ = 0;
    __import_now__ = 0;
    __import_query__= arr[0];
    __import_itmes__ = arr[1];
    __import_length__ = __import_itmes__.length;
    console.log(__import_query__);
    __import_Item();
}


function __import_Item() {
 if(__import_now__ < __import_length__) {
   console.log(__import_now__);
   var json = __import_itmes__[__import_now__];
   var key = json["tag_x"];
   __import_now__ = __import_now__ + 1;
   if(key != "" && json != "") {
     var arr = [key, _Q_ALL_];
     if(__import_query__ != "" && __import_query__ != _Q_ALL_) {  //追加
        arr = [key, _Q_ALL_, __import_query__];
     }
    console.log(arr);
    localStore.plusItem(arr, json, __import_Item);
   }
 }else {
    // プログラム依存
    location.reload();
 }
}

console.info("accessStore.js: 準備完了");