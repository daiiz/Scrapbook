/**
 * waffle.4.x.js v4.x
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, daiz
 */

window.localStore = {};
waffle = localStore;
waffle.api = "waffle ver 4 x";
waffle.e404 = "---404---";
waffle.overwrite = true;
waffle.storeObject = null;

waffle.uniqueKeys = [];
waffle.indexs = [];

waffle.hack = {};
waffle.hack.all_uniqueKeys = [];
waffle.hack.all_indexs = [];
waffle.hack.tabledata = [];

// cb追加　2013/09/29
waffle.hack.showTable = function(cb) {
    var x = waffle.hack.all_uniqueKeys;
    var y = waffle.hack.all_indexs;
    var xl = x.length;
    var yl = y.length;
    var line_content = "#";
    var i;
    var j;
    var jd;
    var ii;
    var jj;
    
    for (i = 0; i < xl; i++) {
        line_content = line_content + " " + i.toString()[i.toString().length - 1];
    }
    console.log(line_content); waffle.hack.tabledata.push(line_content);
    for (j = 0; j < yl; j++) {
        line_content = "";
        line_content = line_content + j.toString()[j.toString().length - 1] + " ";
        for (i = 0; i < xl; i++) {
            if ((x[i][1]).indexOf(j) != -1) {
                jd = "o";
            } else {
                jd = "-";
            }
            line_content = line_content + jd + " ";

        }
        console.log(line_content); waffle.hack.tabledata.push(line_content);
    }
    waffle.uniqueKeys = [];
    waffle.indexs = [];
    for (ii = 0; ii < xl; ii++) {
        waffle.uniqueKeys.push(x[ii][0]);
    }
    for (jj = 0; jj < yl; jj++) {
        waffle.indexs.push(y[jj][0]);
    }
    console.log("■■■ 横要素配列はwaffle.uniqueKeys、縦要素配列はwaffle.indexsで確認できます。 例） waffle.uniqueKeys 、 waffle.uniqueKeys[2]");
    cb();
}

waffle.plusItem = function(arr, json, cb) {
var flag;
var json_tag_xy;
var ar;
var new_indexs = [];
var t_x;
var t_y;
var xl;
var yl;
var new_x_adress;
var i;
var overw;
var new_x_array;
var r;
var t_y_flag;
var j;
var new_y_array;

/* ------------- */
if(arr.length > 0) {
    for(ar = 0; ar < arr.length; ar++) {
        if(ar > 0) {
            new_indexs.push(arr[ar]);
        }
    }
    json_tag_xy = {"x": arr[0], "y": new_indexs};
}else {
    json_tag_xy = {"x": arr[0], "y": undefined};
}
/* 対応はここまで */

    flag = true;
    if (json_tag_xy.x != undefined && json_tag_xy.y != undefined) {
        json.tag_x = json_tag_xy.x;  // # such as "www.google.com"
        /* json.tag_y = json_tag_xy.y;  # such as ["q1", "q2"]. */
        t_x = json_tag_xy.x;
        t_y = json_tag_xy.y;
        x = waffle.hack.all_uniqueKeys;
        y = waffle.hack.all_indexs;
        xl = x.length;
        yl = y.length;
        new_x_adress = null;
        
        for (i = 0; i < xl; i++) {
            if ((x[i][0]) == t_x) {
                if(waffle.overwrite == false) {
                   flag = false;
                   console.error("701 UnSecureOverwriteError : Unique-Keyが既に存在します。上書きを許可する場合はwaffle.overwriteをtrueに変更して下さい。");
                   return 701;
                }else {
                   new_x_adress = i;
                }
            }
        }
        //console.log(new_x_adress);
        if (flag) {           
            if(new_x_adress == null) {
               // # 新規登録モード
               // # x 追加
               overw = "off";
               new_x_array = [t_x, [], 1];
               waffle.hack.all_uniqueKeys.push(new_x_array); // # Important!
               //console.log(new_x_array);
               new_x_adress = waffle.hack.all_uniqueKeys.length - 1; // # これ以下でxが増えることはない。
            }else {
               // # 上書きモード
               overw = "on";
            }
            // # 既存のyタグ配列を検索し、t_yと一致するものがあれば、SUBSCRIPT of x に x番地を追加する。
            // # 一致するものが無ければ新たにpushする。
            // # いずれの場合でもy番地をxタグ配列のSUBSCRIPT of y に追加する。
            // # y query １件ごとに for で回す。plusリクエストy配列添字はr. 既存y配列添字はj.
            for (r = 0; r < t_y.length; r++) {
                t_y_flag = false;
                for (j = 0; j < yl; j++) {
                    if (y[j][0] == t_y[r]) {
                        // # クエリーが既存と一致した。
                        t_y_flag = true;
                        if(overw == "off" || x[new_x_adress][1].indexOf(j) == -1) {
                            (y[j][1]).push(new_x_adress); // # Important!
                            (x[new_x_adress][1]).push(j); // # Important!
                        }
                    }
                }
                if (t_y_flag == false) {
                    // # 最終的にこのクエリーは一致しなかった。
                    new_y_array = [t_y[r], [new_x_adress], 1]; // # Important!
                    waffle.hack.all_indexs.push(new_y_array); // # Important!
                    new_y_adress = waffle.hack.all_indexs.length - 1;
                    (x[new_x_adress][1]).push(new_y_adress); // # Important!
                }
            // # 次のクエリーのスキャンへ
            }
            // # storage作業
            // console.log(json);
            waffle.rootAdd(json, cb);
        }
    
    } else {
        //waffle.error("103", "SyntaxError", ".plus")
    }
}

waffle.minusItem = function(arr, cb) {
    var x = waffle.hack.all_uniqueKeys;
    var y = waffle.hack.all_indexs;
    var xl = x.length;
    var yl = y.length;
    var request_x_value;
    var request_y_values;
    var request_y_value;
    var q;
    var pos_x;
    var pos_y;
    var n;
    var arr_index_x;
    var g;
    var arr_index_y;
    var ar;
    var new_indexs = [];
    
/* ------------- */
if(arr.length > 0) {
    for(ar = 0; ar < arr.length; ar++) {
        if(ar > 0) {
            new_indexs.push(arr[ar]);
        }
    }
    json_tag_xy = {"x": arr[0], "y": new_indexs};
}else {
    json_tag_xy = {"x": arr[0], "y": undefined};
}
/* 対応はここまで */

    // # json_tag_xy : such as {x: "www.google.com", y: "ANY"}
    // # json_tag_xy : such as {x: "www.google.com", y: "q1"}
    // # まずはx配列から該当x配列を取得し、対応するyの位置を ---404--- に変更する。
    // # y配列の対応するxの位置を ---404--- に変更する。
        request_x_value = json_tag_xy.x;
        request_y_values = json_tag_xy.y;
        //request_y_values = request_y_values.split(",");          /* もとから配列で渡す仕様にした */
    for(q = 0; q < request_y_values.length; q++) {
        request_y_value = request_y_values[q];
        pos_y = -1;
        pos_x = -1;
        
        for (n = 0; n < yl; n++) {
            // # 既存のy配列の中からrequestと一致するものを特定する。
            // # 特定した添字をpos_yに保存する。
            if (y[n][0] == request_y_value) {
                pos_y = n;
            }
        }
        
        for (n = 0; n < xl; n++) {
            // # 既存のx配列の中からrequestと一致するものを特定する。
            // # 特定した添字をpos_xに保存する。
            if (x[n][0] == request_x_value) {
                pos_x = n;
            }
        }
        if(pos_x != -1 && pos_y != -1) {
        // # x : pos_x番目の要素: ["TAG_X", [X, X, X, X, pos_y, X]]
        // # y : pos_y番目の要素: ["TAG_Y", [X, pos_x, X, X, X, X, X]]
        // # TAG_X と TAG_Y はリクエストのものと同じはずである。
        
        arr_index_x = x[pos_x][1]; // [X, X, X, X, pos_y, X]
        g = arr_index_x.indexOf(pos_y); // 4
        if(g != -1) {
            x[pos_x][1].splice(g,1);  
        }
        
        arr_index_y = y[pos_y][1];
        g = arr_index_y.indexOf(pos_x);
        if(g != -1) {
            y[pos_y][1].splice(g,1);
        }
        
        //console.log(".minus -x:" + json_tag_xy.x + " -y:" + json_tag_xy.y + " : completed.");
        }
    }
    waffle.rootMinus(request_x_value, request_y_values, cb);
}

waffle.setItem = function(arr, json, cb) {
    var ar;
    var new_indexs = [];
    var reqestX;
    var x;
    var y;
    var placeX;
    var ga;
    var rel_x;
/* ------------- */
if(arr.length > 0) {
    for(ar = 0; ar < arr.length; ar++) {
        if(ar > 0) {
            new_indexs.push(arr[ar]);
        }
    }
    json_tag_xy = {"x": arr[0], "y": new_indexs};
}else {
    json_tag_xy = {"x": arr[0], "y": undefined};
}
/* 対応はここまで */

   // # xキーに対して、yキーの追加と解除の両方を行いたい場合に使用。
   // # waffle.overwrite == true のときのみ動作。
   if(waffle.overwrite) {
       reqestX = json_tag_xy.x;
       x = waffle.hack.all_uniqueKeys;
       y = waffle.hack.all_indexs;
       var placeX = -1;
       
       for(ga = 0; ga < x.length; ga++) {
           if(x[ga][0] == reqestX) {
               placeX = ga;
               break;
           }else {
               placeX = -1;
           }
       }
       
       if(placeX != -1) {
           // # 既存
           console.log("上書きします。");
           
           /*
           for(ga = 0; ga < (x[placeX][1]).length; ga++) {
               x[placeX][1].splice(ga,1);
           }
           */
           
           x[placeX][1] = [];
           
           for(ga = 0; ga < y.length; ga++) {
               rel_x = (y[ga][1]).indexOf(placeX);
               //console.log(ga + " : " + rel_x);
               if(rel_x != -1) {
               // # requestXとの関連があった場合
                   y[ga][1].splice(rel_x,1);
               }else {
               }
           }
        // # この時点では、xはいかなるyとも関連はない。
       }else {
           // # 新規
       }
    waffle.plusItem(arr, json, cb);
   }
}

waffle.getUniqueKeys = function(request_y) {
   // # request_y: String 
   var ga;
   var gb;
   var x_index;
   var y = waffle.hack.all_indexs;
   var ry = request_y;
   var rtn_xs = [];
   var ri = 0;
   for(ga = 0; ga < y.length; ga++) {
       if(y[ga][0] == ry) {
          x_index = y[ga][1];
          
          for(gb = 0; gb < x_index.length; gb++) {
            if(x_index[gb] != waffle.e404) {
              rtn_xs[ri] = waffle.hack.all_uniqueKeys[x_index[gb]][0];
              ri = ri + 1;
            }
          }
          return rtn_xs;
       }
   }
}

waffle.getItems = function(reqest_xs, callback) {
  // # request_xs: Array
  waffle.rootGet(reqest_xs, callback);
}

waffle.getIndexs = function(uniqueID) {
    var x;
    var yys;
    var rtn_ys;
    var ux;
    var uy;
    
    x = waffle.hack.all_uniqueKeys;
    yys = [];
    rtn_ys = [];
    for(ux = 0; ux < x.length; ux++) {
        if(uniqueID == x[ux][0]) {
            yys = x[ux][1]
            //console.log(yys);
            break;
        }
    }
    for(uy = 0; uy < yys.length; uy++) {
       rtn_ys[uy] = waffle.hack.all_indexs[yys[uy]][0];
    }
    
    //return {ys: rtn_ys, x: uniqueID};     // 改変（元はrtn_ys）
    return {indexs: rtn_ys, uniqueKey: uniqueID};
}

waffle.clear = function(clearFlag) {
   if(clearFlag == true) {
       // chrome.storage.local.clear();
       waffle.rootClear();
   }
}

// # root code.
// # ローカルデータ保存API
// cb追加　2013/09/29
waffle.open = function (name, storeType, cb) {
    waffle.name = name;
    waffle.storeType = storeType;
    if(waffle.storeType == "chromelocalstorage" || waffle.storeType == "html5webstorage") {
        waffle.getStore(cb);
    }
}

waffle.getStore = function(cb) {
var strg = waffle.storeObject;
var storeType = undefined;
var hack_table_x;
var hack_table_y;

hack_table_x = "___" +waffle.name + "___" + "hack_table_x";
hack_table_y = "___" +waffle.name + "___" + "hack_table_y";

if(waffle.storeType == "chromelocalstorage") {
  chrome.storage.local.get(["hack_table_x"], function(items_x) {
      if(items_x.hack_table_x == undefined) {
          console.log("空でした。");
          chrome.storage.local.set({"hack_table_x": []}, function() {
               chrome.storage.local.set({"hack_table_y": []}, function(){
                   waffle.hack.showTable(cb);
               });
          });
      }else {
              console.log("ありました。");
              waffle.hack.all_uniqueKeys = items_x.hack_table_x;
          chrome.storage.local.get(["hack_table_y"], function(items_y) {
              waffle.hack.all_indexs = items_y.hack_table_y;
              waffle.hack.showTable(cb);
          });
      }
  });
  
}else if(waffle.storeType == "html5webstorage") {
  if(localStorage[hack_table_x] == undefined && localStorage[hack_table_y] == undefined) {
      console.log("空でした。");
      localStorage[hack_table_x] = JSON.stringify([]);
      localStorage[hack_table_y] = JSON.stringify([]);
      waffle.hack.showTable(cb);
  }else {
      console.log("ありました。");
      waffle.hack.all_uniqueKeys = JSON.parse(localStorage[hack_table_x]);
      waffle.hack.all_indexs = JSON.parse(localStorage[hack_table_y]);
      waffle.hack.showTable(cb);
  }
}

}

waffle.rootAdd = function(jn, cb) {
var hack_table_x = "___" +waffle.name + "___" + "hack_table_x";
var hack_table_y = "___" +waffle.name + "___" + "hack_table_y";
var savejson;
var caption;

    if(waffle.storeType == "chromelocalstorage") {
        // # chrome.storage.local : QUOTA_BYTES ( 5,242,880 )
        // # unlimitedStorage permission が有効である可能性あり。
        // # まずはアイテムを保存する。
        savejson = {};
        caption = jn.tag_x;
        savejson[caption] = jn;
        chrome.storage.local.set(savejson, function() {
            // # 次にテーブル情報を上書き保存する。
            chrome.storage.local.set({"hack_table_x": waffle.hack.all_uniqueKeys}, function() {
                chrome.storage.local.set({"hack_table_y": waffle.hack.all_indexs}, function() {
                    console.log("(chromelocalstorage)writeEnded: " + JSON.stringify(savejson[caption]));
                    cb();
                });
            });
        })
    }else if(waffle.storeType == "html5webstorage") {
        // # HTML5 localStorage : QUOTA_BYTES ( 5,242,880 )
        // # まずはアイテムを保存する。
        localStorage[jn.tag_x] = JSON.stringify(jn);
        // # 次にテーブル情報を上書き保存する。
        localStorage[hack_table_x] = JSON.stringify(waffle.hack.all_uniqueKeys);
        localStorage[hack_table_y] = JSON.stringify(waffle.hack.all_indexs);
        console.log("(html5webstorage)writeEnded: " + localStorage[jn.tag_x]);
        cb();
    }
}

waffle.rootMinus = function(req_x, req_y, cb) {
var hack_table_x = "___" +waffle.name + "___" + "hack_table_x";
var hack_table_y = "___" +waffle.name + "___" + "hack_table_y";

// # テーブル情報を更新するだけ
    if(waffle.storeType == "chromelocalstorage") {
            chrome.storage.local.set({"hack_table_x": waffle.hack.all_uniqueKeys}, function() {
                chrome.storage.local.set({"hack_table_y": waffle.hack.all_indexs}, function() {
                    console.log("(chromelocalstorage)minusEnded: x = " + req_x + "から、指定されたy = "+ req_y.toString() +"を解除しました。");
                    cb();
                });
            });        
    }else if(waffle.storeType == "html5webstorage") {
            localStorage[hack_table_x] = JSON.stringify(waffle.hack.all_uniqueKeys);
            localStorage[hack_table_y] = JSON.stringify(waffle.hack.all_indexs);
            console.log("(html5webstorage)minusEnded: x = " + req_x + "から、指定されたy = "+ req_y.toString() +"を解除しました。");
            cb();
    }
}

waffle.rootGet = function(xs, cb) {
var items;
var iy;
var item;

   if(xs != undefined) {
      if(waffle.storeType == "chromelocalstorage") {
           chrome.storage.local.get(xs, function(items) {
              //console.log(xs);
              cb({items: items, uniqueKeys: xs}); //独自改変
              // cb(items, xs);
           });
      }else if(waffle.storeType == "html5webstorage") {
        items = {};
        for(iy = 0; iy < xs.length; iy++) {
           item = JSON.parse(localStorage[xs[iy]]);
           items[xs[iy]] = item;
        }
        cb({items: items, uniqueKeys: xs});
        // cb(items, xs);
      }
   }else {
      cb({});
   }
}

console.log(waffle.api + ": loaded.");