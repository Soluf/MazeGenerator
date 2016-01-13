var addObjectArrayToCanvas = function (array) {
    var group = new fabric.Group(array, {selectable: false});
    app.canvas.add(group);
};
var addObjectToCanvasAndRender = function (object) {
    app.canvas.add(object);
    app.canvas.renderAll();
};

var makeLineForMaze = function (coords) {
    return new fabric.Line(coords, {
        stroke: 'red',
        strokeWidth: 5,
        selectable: false
    });
};
var makeLineForPointer = function (coords, color) {
    return new fabric.Line(coords, {
        strokeWidth: 5,
        stroke: 'blue',
        originX: 'center',
        originY: 'center',
        selectable: false
    });
};
var makeCircleForPointer = function (coords, color) {
    return new fabric.Circle({
        left: coords[0] - 5,
        top: coords[1] - 5,
        strokeWidth: 0,
        radius: 5,
        fill: (color == null) ? 'blue' : color,
        stroke: 'white',
        selectable: false
    });
};


//https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
//https://gist.github.com/Joncom/e8e8d18ebe7fe55c3894
var haveIntersection = function (line1, line2) {
    var p0_x = line1.get('x1'), p0_y = line1.get('y1'), p1_x = line1.get('x2'), p1_y = line1.get('y2');
    var p2_x = line2.get('x1'), p2_y = line2.get('y1'), p3_x = line2.get('x2'), p3_y = line2.get('y2');
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        // Collision detected
        return true;
    }

    return false; // No collision
};