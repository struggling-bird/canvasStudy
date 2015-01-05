/**
 * Created by dyq on 2014/12/16.
 */
/*
* 绘图上下文
* 圆半径
* 原点
* 起始角度
* 增量
* 回调函数
* 是否逆时针
*
* */
var util = jQuery.myUtil;
function draw1(context, radius, origPoint, start, callback, counterclockwise, flag){
    var end = start + 2 * (counterclockwise ? -1:1);
    function run(){
        if(flag.call(this, end)){
            requestNextAnimationFrame(callback);
            return;
        }
        context.beginPath();
        context.arc(origPoint.x, origPoint.y, radius, util.getRadian(start), util.getRadian(end), counterclockwise?true:false);
        context.stroke();
        start = end+2*(counterclockwise ? -1:1);
        end = start + 2*(counterclockwise ? -1:1);
        context.closePath();
        requestNextAnimationFrame(run);
    }
    run();
}
/*
*
* */
function draw2(context, startPoint, endPoint, callback, flag){
    function run(){
        var p = util.getLinePoint(startPoint, endPoint, 5);
        if(flag.call(this, p, endPoint)){
            requestNextAnimationFrame(callback);
            return;
        }

        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(p.x, p.y);
        context.stroke();
        p = util.getLinePoint(p, endPoint, 5);
        startPoint = p;
        requestNextAnimationFrame(run);
    }
    run();
}