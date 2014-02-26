/**
 * Griddles v0.0.12
 * (c) 2013-2014 daiz. https://github.com/daiz713/griddles
 * License: MIT
 */

var griddles = griddles || {};

 /* User settings */
griddles.msgLoading = "...griddles";

/* ３つのうちどれか一つをtrueにする */
griddles.chromeApp = false;
griddles.phonegap = false;
griddles.webPage = true;

griddles.layout = {
    "page_title": "スクラップブック",
    "app_name": "scrapbook",
    "app_icon": "4848.png",
    "background_color": "#eee",
    "card_width_px": 60,
    "card_height_px": 60,//"auto",
    "card_margin_bottom": 14,
    "stream_margin_left_px": 7,
    "stream_margin_right_px": 7,
    "available_width_percent": 95,
    "tooltip": "yes",
    "cards": [
    ]
};

griddles.layout.cardOnClick = function(j) {
  if(j.dataset.url != undefined && j.dataset.url != "" && j.dataset.url != null) {
    console.info("ページを開きます: "+ j.dataset.url);
    window.open(j.dataset.url);
    
  }else if (j.dataset.tagx != undefined && j.id[0] == "e") {
      var es = j.id.split("_");
      if(es[1] == "update") {
          /* タグのアップデート */
          var newTag = document.getElementById("e_tags_"+es[2]).value;
          if(newTag != undefined && newTag != "") {
               var reqNum = es[2];
               var jsn = myApp.keepDATA[reqNum];
               newTag = newTag.replace(/ /gi, "");
               newTag = newTag.replace(/　/gi, "");
               newTag = newTag.replace(/、/gi, ",");
               var query = newTag.split(",");
               var qs = [];
               for(var g = 0; g < query.length; g++) {
                   if(query[g] != "") {
                      qs.push(query[g]);
                   }
               }
               console.info("タグをアップデート(NEWタグ）: "+ qs.length +" :" + newTag);
               console.info(qs);
               addItem(j.dataset.tagx, qs, jsn, updated);
          }
      }else if(es[1] == "remove") {
          /* アイテムの削除 */
          console.info("登録データを削除(tag-x): "+j.dataset.tagx);
          var reqNum = es[2];
          var arr_querys = getRelationQuery(j.dataset.tagx);
          document.getElementById("D"+reqNum).outerHTML = "";
          document.getElementById("card_"+reqNum).innerHTML = "<div class='rmd'><center>削除しました。</center></div>";
          removeItem(j.dataset.tagx, arr_querys, removed);
      }
  }
}