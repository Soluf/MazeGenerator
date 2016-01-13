var listeners = {
    init: function () {
        var setDataBasedOnCookies = function () {
            var time = Cookies.get("time"), size = Cookies.get("size"), muteStatus = Cookies.get("muteStatus");
            if (time != undefined) {
                $("input[name='time']").val(time);
            }
            if (size != undefined) {
                $("input[name='size']").val(size);
            }
            setOrInverseMuteStatus(muteStatus);
        };

        var setOrInverseMuteStatus = function (command) {
            var img = $("#volume img");
            command = command || (((img.attr("src") == "mute.svg") ? "un" : "") + "mute");
            img.attr("src", command + ".svg");
            Cookies.set("muteStatus", command);
            app.isMute = command == "mute";
        };

        $("input[type='range']").on("mousemove", function () {
            $(this).prev().html($(this).val());
        });
        $("input[type='range']").on("change", function () {
            Cookies.set($(this).attr('name'), $(this).val());
            $(this).trigger("mousemove");
            app.gmz();
        });

        $("#hide,#show").on("click", function () {
            $(".optional").fadeToggle();
            $("#show").fadeToggle();
        });

        $("#redraw").on("click", function () {
            app.init();
            app.gmz();
        });

        $("#ginst").on("click", function () {
            $("#instructions").toggle();
        });

        $("#volume").on("click", function () {
            setOrInverseMuteStatus();
        });

        $("#instructions").on("click", function () {
            $(this).fadeOut();
        });
        
        $("#win").on("click", function() {
           app.gmz();
        });

        setDataBasedOnCookies();
        $("input[type='range']").trigger("mousemove");

    }
};