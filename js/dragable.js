/**
 * Created by dongyq on 2014/4/4.
 * options:{
 *      dom:"",
 *      callbackFun:回调函数，参数：riseX,riseY
 * }
 * usage:<div id="div2" dragType="onlyX" maxX="200" maxY="200" minX="0" minY="0" hasParent=true></div>
 *      $().dragable({dom:$("#div2")});
 *      dragType:允许的拖动方向   onlyX:只允许横向移动   onlyY:只允许纵向移动       默认：不填写默认全方位移动
 *      maxX:允许拖动的最大横坐标     默认：没有限制
 *      maxY:允许拖动的最大纵坐标     默认：没有限制
 *      minX:允许拖动的最小横坐标     默认：没有限制
 *      minY:允许拖动的最小纵坐标     默认：没有限制
 *      hasParent:是否受父级节点限制     默认：没有限制
 *      resizable:是否改变大小        默认：不支持
 *      handle:是否只能在指定区域进行拖动操作      默认：没有限制
 */
(function($){
    var startX = 0;//节点起始横坐标
    var startY = 0;//节点起始纵坐标
    var beforeX = 0;//鼠标移动前横坐标
    var beforeY = 0;//鼠标移动前纵坐标
    var toDrag = null;
    $.fn.dragable = function(options){
        var dom = $(this);
        if(!(dom instanceof  $)){
            dom = $(dom);
        }
        if(options.callbackFun)dom[0].callbackFun = options.callbackFun;//绑定回调函数
        /**
         * 判断是否是绝对定位
         */
        if(!dom.css("position") || dom.css("position") == "static") dom.css("position","absolute");
        dom.mousedown(onMousedown);
        startX = dom[0].offsetLeft;
        startY = dom[0].offsetTop;
        if(dom.attr("resizable")){//如果支持改变大小
            var pointSize = 10;
            var point = '<div isPointer=true style="position: absolute;top:'+(parseFloat(dom.css("height"))-pointSize)
                +'px;left:'+(parseFloat(dom.css("width"))-pointSize)
                +'px;height:'+pointSize+'px;width:'+pointSize+'px;background-color: black;cursor:nw-resize;"></div>';
            dom.append(point);
            dom.children("div[isPointer=true]").mousedown(onMousedown);
        };
    };
    //鼠标点击后执行的操作
    function onMousedown(event){
        toDrag = $(this);
        if(toDrag.attr("handle")){
            if(event.target != $(toDrag.attr("handle"))[0])return;
        }
        $.myUtil.preventDefault(event);
        //初始化鼠标移动前坐标
        beforeX = event.clientX;
        beforeY = event.clientY;
        startX = toDrag[0].offsetLeft;
        startY = toDrag[0].offsetTop;
        $(document).mousemove(onMousemove);
        $(document).mouseup(onMouseup);
    }
    //鼠标移动时进行的操作
    function onMousemove(event){
        $.myUtil.preventDefault(event);

        //如果受父级节点限制，则增加其位移限制
        if(toDrag.attr("hasParent")){
            var parent = $(toDrag[0].parentNode);
            toDrag.attr("minX",0);
            toDrag.attr("maxX",(parseFloat(parent.css("width")))-(parseFloat(toDrag.css("width"))));
            toDrag.attr("minY",0);
            toDrag.attr("maxY",(parseFloat(parent.css("height")))-(parseFloat(toDrag.css("height"))));
        }
        var riseX = event.clientX - beforeX;//横坐标变化值
        var riseY = event.clientY - beforeY;//纵坐标变化值
        var dragType = toDrag.attr("dragType");
        var maxX = parseFloat(toDrag.attr("maxX"));
        var maxY = parseFloat(toDrag.attr("maxY"));
        var minX = parseFloat(toDrag.attr("minX"));
        var minY = parseFloat(toDrag.attr("minY"));
        if(dragType){
            if(dragType == "onlyX"){//决定移动方向
                toX(maxX, startX, riseX, minX, toDrag);
            }
            if(dragType == "onlyY"){
                toY(maxY, startY, riseY, minY, toDrag);
            }
        }else{
            toX(maxX, startX, riseX, minX, toDrag);
            toY(maxY, startY, riseY, minY, toDrag);
        }
        //更新坐标
        beforeX = event.clientX;
        beforeY = event.clientY;
        startX = toDrag[0].offsetLeft;
        startY = toDrag[0].offsetTop;
        if(toDrag[0].callbackFun)toDrag[0].callbackFun(riseX, riseX);//调取回调函数
    }
    function toX(maxX, startX, riseX, minX, toDrag){
        if((maxX != maxX || (startX+riseX) <= maxX)
            &&(minX != minX || (startX+riseX) >= minX)) {//确定位移范围
            //判断，如果当前操作点是pointer，则改变其父级节点大小
            if(toDrag.attr("isPointer")){
                var parent = $(toDrag[0].parentNode);
                var x = parseFloat(parent.css("width"))+riseX;
                if(x < 10)return;
                parent.css("width",x+"px");
            }
            toDrag.css("left", (startX + riseX) + "px");
        }
    }
    function toY(maxY, startY, riseY, minY, toDrag){
        if((maxY != maxY || (startY+riseY) <= maxY)
            &&(minY != minY || (startY+riseY) >=minY)) {
            //判断，如果当前操作点是pointer，则改变其父级节点大小
            if(toDrag.attr("isPointer")){
                var parent = $(toDrag[0].parentNode);
                var y = parseFloat(parent.css("height"))+riseY;
                if(y < 10)return;
                parent.css("height", y+"px");
            }
            toDrag.css("top", (startY + riseY) + "px");
        }
    }
    //鼠标松开时进行的操作
    function onMouseup(event){
        $.myUtil.preventDefault(event);
        $(document).unbind("mousemove",onMousemove);
        $(document).unbind("mouseup",onMouseup);
    }
})(jQuery);