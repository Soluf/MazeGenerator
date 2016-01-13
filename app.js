var app = (function () {
    var gmz = function () {
        app.canvas.clear();
        app.canvas.renderAll(true);

        $("#print").removeAttr("href");
        pointer.end();

        maze.generate(parseInt($("#size input[type='range']").val()), $("#time input[type='range']").val());
    };

    var init = function () {
        if(isFirstRun()) {
            $("#instructions").show();
            $("#hide").addClass("firstRun");

            $(".firstRun").on("click", function(){
                $(this).removeClass("firstRun");
            });
        }
        app.canvas = app.canvas || new fabric.Canvas('c', {selection: false});

        app.h = $(window).height() - 30;
        app.w = $(window).width() - 15;
    };

    var isFirstRun = function() {
        if(Cookies.get("firstRun") == undefined) {
            Cookies.set("firstRun", 'true');
            return true;
        }
        return false;
    };

    return {init: init, gmz: gmz, h: 0, w: 0, canvas: null, isMute: false};
})();
$(document).ready(function () {
    listeners.init();
    app.init();
    pointer.init();
    app.gmz();
});