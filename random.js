var getRandomNumber = function (i) {
    return Math.floor(Math.random() * (i + 1));
};

var permutation = function (seq) {
    for (var i = seq.length - 1; i >= 0; i--) {
        var random = getRandomNumber(i);
        var tmp = seq[random];
        seq[random] = seq[i];
        seq[i] = tmp;
    }
};
