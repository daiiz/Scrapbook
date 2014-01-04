var hash = hash || {};
hash.controller = hash.controller || {};
hash.binder = {};
hash.ArrBinder = {};
hash.keep = {};


hash.model = function(a) {
    hash.clear(a);
    return function(b) {
        // モデル構造を保持する
        hash.keep[a] = b;
    }
}

hash.bind = function(a) {
    if (hash.keep[a] != undefined) {
        return function(b) {
            hash.__bind__(a, b);
            hash.ArrBinder[a].push(b);
        }
    } else {
        console.error("モデルが定義されていません. " + a);
    }
}

hash.__bind__ = function(a, b) {
    hash.binder[a] = hash.binder[a] || [];
    var t = hash.keep[a];
    var bi;
    for (var i = 0; i < b.length; i++) {
        var rg = new RegExp("#" + i, "gi");
        bi = b[i];
        //var rf = new RegExp("class=#" + i, "gi");
        //(t.search(rf) == -1) ? bi = b[i] : bi = '"' + a + ' ' + b[i] + '"';
        t = t.replace(rg, bi);
    }
    hash.binder[a].push(t);
}


hash.view = function(a) {
    var s = '';
    for (var x = 0; x < hash.binder[a].length; x++) {
        s = s + hash.binder[a][x];
    }
    document.getElementById("#" + a).innerHTML = s;
    hash.setController(a);
    return hash.ArrBinder[a];
}

hash.setController = function(a) {
    if (hash.controller[a] != undefined) {
        document.getElementById("#" + a).addEventListener("click", hash.controller[a], false);
    } else {
        console.warn("コントローラが定義されていません. " + a);
    }
}

hash.rebind = function(a) {
    return function(b) {
        return function(c) {
            var arr = hash.ArrBinder[a];
            // 目的の添字
            var ob_index = b[0];
            // 目的の添字に対する値（これでモデルのなかから一意に特定する）
            var ob_value = b[1];
            for (var r = 0; r < arr.length; r++) {
                var scan_arr = arr[r];
                if (scan_arr[ob_index] == ob_value) {
                    // 対象を発見したとき
                    var change_index = c[0];
                    var change_value = c[1];
                    // 指定箇所を変更
                    scan_arr[change_index] = change_value;
                } else {
                }
            
            }
            
            hash.binder[a] = [];
            for (var w = 0; w < arr.length; w++) {
                hash.__bind__(a, arr[w]);
            }
        
        }
    }
}

hash.clear = function(a) {
    // 初期化
    hash.ArrBinder[a] = [];
    hash.binder[a] = [];
}

