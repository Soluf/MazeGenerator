var maze = (function () {
    var sleepTime, edgesAfterClear, runID = 0;

    var makeCoordsFromCells = function (cellA, cellB) {
        if (cellA.i == cellB.i) {
            return [cellA.i * maze.xRatio - 1, (cellA.j + 1) * maze.yRatio,
                (cellB.i + 1) * maze.xRatio + 1, cellB.j * maze.yRatio];
        } else {
            return [(cellA.i + 1) * maze.xRatio, cellA.j * maze.yRatio - 1,
                cellB.i * maze.xRatio, (cellB.j + 1) * maze.yRatio + 1];
        }
    };
    var getMatrixSize = function (difficulty, dimensions) {
        var x, y, w = dimensions[0], h = dimensions[1];
        if (w < h) {
            x = Math.floor(difficulty * w / h);
            y = difficulty;
        } else {
            x = difficulty;
            y = Math.floor(difficulty * h / w);

        }
        return [x, y];
    };
    var createData = function (difficulty, dimensions) {
        var tmp = getMatrixSize(difficulty, dimensions), x = tmp[0], y = tmp[1];
        var cells = [];
        for (var i = 0; i < x; i++) {
            cells[i] = [];
            for (var j = 0; j < y; j++) {
                cells[i][j] = {s: makeSet(i * y + j), loc: {i: i, j: j}};
            }
        }
        var edges = [];
        for (var i = 0; i < x; i++) {
            for (var j = 0; j < y; j++) {
                if (j != y - 1) {
                    edges.push([cells[i][j], cells[i][j + 1]]);
                }
                if (i != x - 1) {
                    edges.push([cells[i][j], cells[i + 1][j]]);
                }
            }
        }
        return {edges: edges, x: x, y: y};
    };
    var drawEdges = function () {
        var edges = [];
        for (var i = maze.data.edges.length - 1; i >= 0; i--) {
            var edge = maze.data.edges[i], line = makeLineForMaze(makeCoordsFromCells(edge[0].loc, edge[1].loc));
            maze.data.edges[i][2] = line;
            edges.push(line);
        }
        addObjectArrayToCanvas(edges);
    };
    var drawBorder = function (dimensions) {
        var w = dimensions[0], h = dimensions[1];
        maze.border = [];
        maze.border.push(makeLineForMaze([0, 0, 0, h]));
        maze.border.push(makeLineForMaze([maze.xRatio, 0, w, 0]));
        maze.border.push(makeLineForMaze([w, 0, w, h]));
        maze.border.push(makeLineForMaze([0, h, w - maze.xRatio, h]));
        addObjectArrayToCanvas(maze.border);
    };
    var drawMaze = function (dimensions) {
        drawEdges();
        drawBorder(dimensions);
    };
    var clearEdge = function (i) {
        var edge = maze.data.edges[i], f1 = find(edge[0].s), f2 = find(edge[1].s);
        if (sleepTime == 0) {
            if (f1 != f2) {
                union(f1, f2);
                edge[2].setOpacity(0);
            } else {
                edgesAfterClear.push(edge);
            }
        } else {
            if (i != 0) {
                var nextEdge = maze.data.edges[i - 1];
                nextEdge[2].setStroke('#ff0066');
            }
            edge[2].setStroke('green');
            app.canvas.renderAll();
            if (f1 != f2) {
                union(f1, f2);
                edge[2].animate('opacity', 0, {
                    duration: sleepTime,
                    onChange: app.canvas.renderAll.bind(app.canvas),
                    easing: fabric.util.ease[2]
                });
            } else {
                setTimeout(function () {
                    edge[2].setStroke('red');
                    app.canvas.renderAll();
                }, sleepTime);
                edgesAfterClear.push(edge);
            }
        }
        tryToClearEdges(i - 1);
    };
    var tryToClearEdges = function (i) {
        if (i >= 0) {
            if (sleepTime != 0 && i != maze.data.edges.length - 1) {
                var localSeed = runID;
                window.setTimeout(function () {
                    if (localSeed == runID) {
                        clearEdge(i);
                    }
                }, sleepTime);
            } else {
                clearEdge(i);
            }
        } else {
            window.setTimeout(function () {
                setPrint();
                afterClearEdgesEnded();
            }, 200);
        }
    };
    var afterClearEdgesEnded = function () {
        maze.data.edges = edgesAfterClear;
        app.canvas.renderAll();
        pointer.start();
    };
    var addCredit = function () {
        var credit = new fabric.Text("By Soluf - Dean Stephansky", {
            fontWeight: 'small', stroke: 'black', top: app.canvas.getHeight() - maze.PADDING[1] - 20, left: 5
        });
        app.canvas.add(credit);
        return credit;
    };
    var setCanvasColorAndBackground = function (color, bg) {
        for (var i = maze.data.edges.length - 1; i >= 0; i--) {
            maze.data.edges[i][2].setStroke(color);
        }
        for (var i = maze.border.length - 1; i >= 0; i--) {
            maze.border[i].setStroke(color);
        }
        app.canvas.setBackgroundColor(bg);
        app.canvas.renderAll();
    };
    var setPrint = function () {
        setCanvasColorAndBackground("black", "white");
        var credit = addCredit();
        $('#print').attr({href: app.canvas.toDataURL(), download: "maze.png"});
        credit.remove();
        setCanvasColorAndBackground("red", "transparent");
    };
    var increaseRunID = function () {
        runID++;
    };
    var generate = function (difficulty, animationTime) {
        increaseRunID();

        app.canvas.setHeight(app.h - 2);
        app.canvas.setWidth(app.w - 2);

        var dimensions = [app.canvas.getWidth() - maze.PADDING[0], app.canvas.getHeight() - maze.PADDING[1]];
        maze.data = createData(difficulty, dimensions);
        permutation(maze.data.edges);

        sleepTime = Math.floor(animationTime * 1000 / maze.data.edges.length);
        maze.xRatio = dimensions[0] / maze.data.x;
        maze.yRatio = dimensions[1] / maze.data.y;


        drawMaze(dimensions);

        edgesAfterClear = [];
        tryToClearEdges(maze.data.edges.length - 1);
    };

    return {data: null, border: null, xRatio: 0, yRatio: 0, generate: generate, PADDING: [5, 20]};
})();


