/**
 * Created by dongyq on 2014/8/6.
 */
$().ready(function(){
    var util = $.myUtil,
        canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        shade = document.getElementById("shade"),/*辅助画布*/
        shadeContext = shade.getContext("2d"),/*辅助画布上下文*/
        toCanvas = $(".toCanvas"),
        originalImg = null,/*原始图像*/
        tempImg = null,/*缓存图像*/
        startPoint = {
            x:0,
            y:0
        },
        endPoint = {
            x:0,
            y:0
        },
        pen = {/*画笔*/
            strokeStyle: "black",
            fillStyle: "white",
            lineWidth : 1,
            lineCap: "round",
            lineJoin: "round",
            penType: 1/*默认为铅笔*/
        },
        isBeginRecord = false,/*是否开始记录锚点*/
        points = [];/*记录点击事件存储的锚点*/

    canvas.width = shade.width = toCanvas.width();
    canvas.height = shade.height = toCanvas.height();
    originalImg = context.getImageData(0, 0, canvas.width, canvas.height);

    /*坐标辅助线*/
    util.assistLine(toCanvas, shadeContext);

    toCanvas.mousedown(onDown);
    initColorPane();

    /*初始化颜色面板*/
    function initColorPane(){
        $('#strokeColor').colpick({
            layout:'hex',
            submit:1,
            colorScheme:'dark',
            onChange:function(hsb,hex,rgb,el,bySetColor) {
                pen.strokeStyle = '#'+hex;
                $(el).css("background-color",'#'+hex);
            },
            onSubmit:function(hsb, hex, rgb, el){
                $(el).colpickHide();
            }
        });
        $('#fillColor').colpick({
            layout:'hex',
            submit:1,
            colorScheme:'dark',
            onChange:function(hsb,hex,rgb,el,bySetColor) {
                pen.fillStyle = '#'+hex;
                $(el).css("background-color",'#'+hex);
            },
            onSubmit:function(hsb, hex, rgb, el){
                $(el).colpickHide();
            }
        });
    }

    /*绘图类型选择*/
    $(".leftMenu li").click(choosePenType);
    function choosePenType(){
        $(this).attr("penType")&&(pen.penType = parseFloat($(this).attr("penType")));
        switch (pen.penType){
            case 4:/*二次曲线*/
                break;
        }
    }

    function initPen(){
        context.strokeStyle = pen.strokeStyle;
        context.fillStyle = pen.fillStyle;
        context.lineWidth = pen.lineWidth;
        context.lineCap = pen.lineCap;
        context.lineJoin = pen.lineJoin; 
    }

    /*画布上的点击操作*/
    function onClick(event){
        var point = util.getPoint(canvas, event);
        switch (pen.penType){
            case 4:/*二次曲线*/
                points.push(point);
                if(points.length == 1) return;
                context.putImageData(tempImg, 0, 0);
                context.beginPath();
                context.moveTo(startPoint.x, startPoint.y);
                context.quadraticCurveTo(point.x, point.y, endPoint.x, endPoint.y);
                context.stroke();
                isBeginRecord = false;
                toCanvas.unbind("click", onClick);
                originalImg = tempImg = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

                context.beginPath();
                context.arc(startPoint.x, startPoint.y, 2, util.getRadian(0), util.getRadian(360), true);
                context.fill();
                context.beginPath();
                context.arc(point.x, point.y, 2, util.getRadian(0), util.getRadian(360), true);
                context.fill();
                context.beginPath();
                context.arc(endPoint.x, endPoint.y, 2, util.getRadian(0), util.getRadian(360), true);
                context.fill();
                break;
        }
    }

    function onDown(event){
        util.preventDefault(event);

        /*如果开始记录锚点，并且记录未结束，则取消下一步的处理*/
        if(isBeginRecord) return;
        context.save();
        initPen();
        startPoint = util.getPoint(canvas, event);/*记录起点*/
        switch (pen.penType){
            case 1:/*铅笔，自由绘线*/
                context.moveTo(startPoint.x, startPoint.y);
                context.beginPath();
                break;
            case 2:/*直线*/
                context.putImageData(originalImg, 0, 0);
                break;
            case 3:/*矩形*/
                break;
            case 4:/*二次曲线*/
                context.putImageData(originalImg, 0, 0);
                tempImg = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
                points = [];
                break;
        }

        toCanvas.mousemove(onMove);
        toCanvas.mouseup(onUp);
    }
    function onMove(event){
        util.preventDefault(event);
        var point = util.getPoint(canvas, event);
        switch (pen.penType){
            case 1:/*铅笔*/
                context.lineTo(point.x, point.y);
                context.stroke();
                break;
            case 2:/*直线*/
            case 4:/*二次曲线*/
                context.putImageData(originalImg, 0, 0);
                context.beginPath();
                context.moveTo(startPoint.x, startPoint.y);
                context.lineTo(point.x, point.y);
                context.stroke();
                context.closePath();
                break;
            case 3:/*矩形*/
                context.putImageData(originalImg, 0, 0);
                context.beginPath();
                context.moveTo(startPoint.x, startPoint.y);
                context.rect(startPoint.x, startPoint.y, point.x-startPoint.x, point.y-startPoint.y);
                context.fill();
                context.stroke();
                break;
        }
    }
    function onUp(event){
        util.preventDefault(event);
        endPoint = util.getPoint(canvas, event);
        switch (pen.penType){
            case 1:/*铅笔*/
                context.closePath();
                break;
            case 4:/*二次曲线*/
                context.closePath();
                toCanvas.click(onClick);
                isBeginRecord = true;
                break;
        }

        originalImg = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

        toCanvas.unbind("mousemove", onMove);
        toCanvas.unbind("mouseup", onUp);
    }

    $("#anglePoint").click(function(event){
        initPen();
        for(var i = 0; i<360; i+=1){
            var point = util.getAnglePoint({
                x: 300,
                y: 300
            }, i, 200);
            context.beginPath();
            context.moveTo(300, 300);
            context.lineTo(point.x, point.y);
            context.stroke();
            context.closePath();
        }
    });

    $("#eachTest").click(function(){
        util.canvasEach(context.getImageData(0, 0, 20, 20), function(item){
            console.log(item);
        })
    });
});