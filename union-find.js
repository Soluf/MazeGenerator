var newItem = function () {
    return {};
};

var makeSet = function (i) {
    var x = new newItem();
    x.info = i;
    x.p = x;
    x.rank = 0;
    return x;
};

var find = function (x) {
    if (x.p != x) {
        x.p = find(x.p);
    }
    return x.p;
};

var union = function (x, y) {
    link(find(x), find(y));
};

var link = function (x, y) {
    if (x.rank > y.rank) {
        y.p = x;
    } else {
        x.p = y;
        if (x.rank == y.rank) {
            y.rank += 1;
        }
    }
};