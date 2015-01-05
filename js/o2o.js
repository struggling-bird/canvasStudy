/**
 * Created by dyq on 2014/9/18.
 */
function Point(x, y){
    this.x = x;
    this.y = y;
}
Point.prototype = {
    x:0,
    y:0,
    area:1,/*象限区域*/
    length:0,
    angle:0,/*角度*/
    end:undefined,
    isOver:false/*移动是否结束*/
};
$().ready(function(){
    var toCanvas = $("#toCanvas"),
        util = $.myUtil,
        canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        points = [new Point(300, 300)],
        angle = 1;

    toCanvas.click(function(event){
        var point = util.getPoint(canvas, event);
        point = new Point(point.x, point.y);
        if(points.length > 0 && typeof points[points.length-1].end == "undefined"){
            /*如果数组不为空，并且没有确定落点，则添加落点*/
            points[points.length-1].end = point;
        }else{
            /*添加新点*/
//            points.push(point);
//            context.beginPath();
//            context.arc(point.x, point.y, 2, 0, util.getRadian(360));
//            context.fill();
//            context.closePath();
            points[0].end = point;
        }
    });
    requestNextAnimationFrame(animate);
    function animate(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.beginPath();
        var point1 = util.getAnglePoint({
            x: 380,
            y:260
        }, angle+=1, 100);
        context.arc(point1.x, point1.y, 10, 0, util.getRadian(360));
        context.fill();
        context.stroke();
        context.closePath();
        for(var i=0; i<points.length; i++){
            var point = points[i];
            if(typeof point.end != "undefined"){
                var result = util.getLinePoint(point, point.end, 5);
                point.x = result.x;
                point.y = result.y;

                context.beginPath();
                context.arc(point.x, point.y, 10, 0, util.getRadian(360));
                context.fill();
                context.closePath();
            }
        }
        requestNextAnimationFrame(animate);
    }
});