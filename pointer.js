var pointer = (function () {
    var REMOVE_EDGE_INTERVAL_TIME = 400;

    var src, winRect, downTime, workingLine, intervalID = null;
    var history = [];

    var waitForMazeToFinish = function (func, e) {
        if (src != null) {
            func(e)
        }
    };

    var removeLastObject = function () {
        var tmp = history[history.length - 1], line = tmp[0], circle = tmp[1];
        line.remove();
        circle.remove();
        history.length--;
    };

    var getLastLineEndPoints = function () {
        workingLine = history[history.length - 1][0];
        return [workingLine.get("x2"), workingLine.get("y2")];
    };
    var getMousePoints = function (o) {
        var pointer = app.canvas.getPointer(o.e);
        return [pointer.x, pointer.y];
    };
    var checkWin = function (line) {
        var tmp = getLastLineEndPoints(), x = tmp[0], y = tmp[1];
        if (winRect[0][0] <= x && x <= winRect[1][0] && winRect[0][1] <= y && y <= winRect[1][1]) {
            $("#win").fadeIn(1000);
            if (!app.isMute) {
                var snd = new Audio("cheering.mp3");
                snd.volume = 0.1;
                snd.play();
            }
        }
    };
    var hasIntersectionWithMaze = function (line) {
        for (var i = maze.data.edges.length - 1; i >= 0; i--) {
            if (haveIntersection(maze.data.edges[i][2], line)) {
                return true;
            }
        }
        for (var i = maze.border.length - 1; i >= 0; i--) {
            if (haveIntersection(maze.border[i], line)) {
                return true;
            }
        }
        return false;
    };
    var addLine = function (o) {
        if (workingLine == null) {
            downTime = true;
            var p1, p2 = getMousePoints(o);
            if (history.length == 0) {
                p1 = src;
            } else {
                p1 = getLastLineEndPoints();
            }
            workingLine = MakeLineFromPoints(p1, p2);
            addObjectToCanvasAndRender(workingLine);
        }
    };
    var MakeLineFromPoints = function (p1, p2) {
        var line = makeLineForPointer([p1[0], p1[1], p2[0], p2[1]]);
        return line;
    };

    var validateNewLine = function () {
        if (hasIntersectionWithMaze(workingLine)) {
            workingLine.remove();
        } else {
            var circle = makeCircleForPointer([workingLine.get("x2"), workingLine.get("y2")]);
            addObjectToCanvasAndRender(circle);
            history.push([workingLine, circle]);
            checkWin(workingLine);
        }
        workingLine = null;
    };
    var clearInterval = function () {
        window.clearInterval(intervalID);
        intervalID = null;
    };
    var mouseDown = function () {
        downTime = new Date().getTime();

        if (intervalID == null) {
            intervalID = setInterval(function () {
                if (history.length > 0) {
                    removeLastObject();
                } else {
                    clearInterval();
                }
            }, REMOVE_EDGE_INTERVAL_TIME);
        }
    };
    var mouseUp = function (o) {
        clearInterval(intervalID);
        if (new Date().getTime() - downTime < REMOVE_EDGE_INTERVAL_TIME) {
            addLine(o);
            validateNewLine();
        }
    };

    var end = function () {
        history.length = 0;
        src = null;
        winRect = null;
        workingLine = null;
        intervalID = null;
        downTime = 0;
        $("#win").hide();
    };
    var start = function () {
        var halfCellX = maze.xRatio / 2, halfCellY = maze.yRatio / 2;
        src = [halfCellX + 3 ,halfCellY + 2];
        var end = [app.canvas.getWidth() - halfCellX - 3, app.canvas.getHeight() - maze.PADDING[1]  - halfCellY + 3];
        winRect = [[end[0] - halfCellX + 3, end[1] - halfCellY + 3], [end[0] + halfCellX - 3, end[1] + halfCellY - 3]];
        addObjectArrayToCanvas([makeCircleForPointer(src, 'white'), makeCircleForPointer(end, 'white')]);

        if($("#instructions").is(':visible')) {
            $("#instructions").trigger("click");
        }
    };
    var stop = function() {

    }
    var init = function () {
        app.canvas.on('mouse:down', function (e) {
            waitForMazeToFinish(mouseDown, e);
        });

        app.canvas.on('mouse:up', function (e) {
            waitForMazeToFinish(mouseUp, e);
        });
        end();
    };
    return {init: init, start: start, end: end};

})();