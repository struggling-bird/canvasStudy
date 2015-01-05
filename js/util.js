/**
 * Created by dyq on 2014/4/4.
 */
jQuery.myUtil = {
    preventDefault:function(event){
        if(event.preventDefault)event.preventDefault();
        if(event.stopPropagation)event.stopPropagation();
        if(event.returnValue)event.returnValue = false;
        if(event.cancelBubble) event.cancelBubble = true;
    },

    /*获取鼠标在画布上点击的坐标*/
    getPoint:function(canvas,event){
        var position = $(canvas).position();
        return {
            x: (event.clientX ? event.clientX : event.changedTouches && event.changedTouches[0] && event.changedTouches[0].pageX) - position.left,
            y: (event.clientY ? event.clientY : event.changedTouches && event.changedTouches[0] && event.changedTouches[0].pageY) - position.top
        }
    },
    /*获取指定方向和距离的终点*/
    getAnglePoint:function (point, angle, length){
        if(angle > 360){
            angle = angle - Math.floor(angle / 360) * 360;
        }
        //确定当前线段长度
        var endPoint = {
            x:0,
            y:0
        };
        //确定线段方向
        var radian = 0;//弧度值
        if(angle > 0 && angle < 90){
            var sin = Math.sin(this.getRadian(angle)),
                cos = Math.cos(this.getRadian(angle));
            endPoint.x = length * sin + point.x;
            endPoint.y = point.y  - cos * length;
        }else if(angle > 90 && angle < 180){
            angle = angle - 90;
            var sin = Math.sin(this.getRadian(angle)),
                cos = Math.cos(this.getRadian(angle));
            endPoint.y = length * sin + point.y;
            endPoint.x = length * cos + point.x;
        }else if(angle > 180 && angle < 270){
            angle = angle - 180;
            var sin = Math.sin(this.getRadian(angle)),
                cos = Math.cos(this.getRadian(angle));
            endPoint.x = point.x - length * sin;
            endPoint.y = point.y + length * cos;
        }else if(angle > 270 && angle < 360){
            angle = angle - 270;
            var sin = Math.sin(this.getRadian(angle)),
                cos = Math.cos(this.getRadian(angle));
            endPoint.x = point.x - cos * length;
            endPoint.y = point.y - sin * length;
        }else if (angle == 90){
            endPoint.y = point.y;
            endPoint.x = point.x + length;
        }else if(angle == 180){
            endPoint.x = point.x;
            endPoint.y = point.y + length;
        }else if(angle == 270){
            endPoint.y = point.y;
            endPoint.x = point.x - length;
        }else if(angle == 360 || angle == 0){
            endPoint.x = point.x;
            endPoint.y = point.y - length;
        }
        return endPoint;
    },
    /*获取指定直线路径上的坐标*/
    getLinePoint:function(startPoint, endPoint, step){
        step = -step;
        /*两点之间的距离*/
        var length = Math.sqrt(Math.pow(Math.abs(startPoint.x - endPoint.x), 2) + Math.pow(Math.abs(startPoint.y - endPoint.y), 2)),
            y = endPoint.y - startPoint.y,
            x = endPoint.x - startPoint.x,
            sin = Math.abs(y) / length,
            cos = Math.abs(x) / length,
            result = {
                x: startPoint.x,
                y: startPoint.y
            };
        if(Math.floor(length) <= 3)
        return result;
        if(x > 0 && y < 0){/*第二象限↗*/
            result = {
                x: endPoint.x - (length + step) * cos,
                y: endPoint.y + (length + step) * sin
            };
        }else if(x > 0 && y > 0){/*第三象限↘*/
            result = {
                x: endPoint.x - cos * (length + step),
                y: endPoint.y - sin * (length + step)
            };
        }else if(x < 0 && y > 0){/*第四象限↙*/
            result = {
                x: endPoint.x + cos * (length + step),
                y: endPoint.y - sin * (length + step)
            };
        }else if(x < 0 && y < 0){/*第一象限↖*/
            result = {
                x: endPoint.x + cos * (length + step),
                y: endPoint.y + sin * (length + step)
            };
        }else if(x == 0 && y > 0){/*垂直向下 ↓*/
            result = {
                x: endPoint.x,
                y: startPoint.y - step
            };
        }else if(x ==0 && y < 0){/*垂直向上  ↑*/
            result = {
                x: endPoint.x,
                y: startPoint.y + step
            };
        }else if(x > 0 && y == 0){/*水平向右  →*/
            result = {
                x: startPoint.x - step,
                y: startPoint.y
            };
        }else if(x < 0 && y == 0){/*水平向左  ←*/
            result = {
                x: startPoint.x + step,
                y: startPoint.y
            };
        }else{
            result = startPoint.end;
        }
        return result;
    },
    /*获取弧度值*/
    getRadian: function(value){
        return Math.PI/180*value;
    },
    /*获取指定范围的随机数*/
    getRandom:function(min, max){
        return Math.round(Math.random()*(max-min))+min;
    },
    /*绘制canvas网格*/
    drawGrid:function(context, color, stepx, stepy){
        context.save();
        context.strokeStyle = color;
        context.lineWidth = 0.5;
        for(var i = stepx + 0.5; i < context.canvas.width; i += stepx){
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, context.canvas.height);
            context.stroke();
            context.closePath();
        }
        for(var i = stepy + 0.5; i < context.canvas.height; i += stepy){
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(context.canvas.width, i);
            context.stroke();
            context.closePath();
        }
        /*绘制x轴*/
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(context.canvas.width, 0);
        context.stroke();
        context.beginPath();
        context.moveTo(context.canvas.width - 10, -stepy/2);
        context.lineTo(context.canvas.width, 0);
        context.lineTo(context.canvas.width - 10, stepy/2);
        context.fill();
        context.closePath();
        /*绘制y轴*/
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, context.canvas.height);
        context.stroke();
        context.beginPath();
        context.moveTo(-stepx/2, context.canvas.height - 10);
        context.lineTo(stepx/2, context.canvas.height - 10);
        context.lineTo(0, context.canvas.height);
        context.closePath();
        context.fill();

        context.restore();
    },
    /*负片滤镜*/
    getNegativeFilmFilter:function(context, x, y, width, height){
        var imgData = context.getImageData(x, y, width, height),
            data = imgData.data;
        for(var i=0; i <= data.length - 4; i+=4){
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i +1];
            data[i + 2] = 255 - data[i +2];
        }
        return imgData;
    },
    /*黑白滤镜*/
    getBlackWhiteFilter:function(context, x, y, width, height){
        var imgData = context.getImageData(x, y, width, height),
            data = imgData.data;
        for(var i=0; i <= data.length - 4; i+=4){
            var val = (data[i] + data[i+1] + data[i+2])/3
            data[i] = data[i + 1] = data[i + 2] = val;
        }
        return imgData;
    },
    /*绘制辅助线（带坐标）*/
    assistLine:function(toCanvas, context){
        toCanvas.mousemove(function(event){
            $.myUtil.preventDefault(event);
            context.save();
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            var point = $.myUtil.getPoint(context.canvas, event),
                txt = 'x:'+point.x+',y:'+point.y;

            context.beginPath();
            context.moveTo(0, point.y);
            context.lineTo(context.canvas.width, point.y);
            context.stroke();
            context.beginPath();
            context.moveTo(point.x, 0);
            context.lineTo(point.x, context.canvas.height);
            context.stroke();

            context.textAlign = "start";
            context.textBaseline = "top";
            context.strokeText(txt, (context.canvas.width - context.measureText(txt).width), 0);

            context.restore();
        });
    },
    /*canvas像素遍历*/
    canvasEach:function(imgData, callback){
        for(var y = 0; y < imgData.height; y++){
            for(var x = 0; x < imgData.width * 4; x+=4){
                var r = imgData.data[x + y * imgData.width * 4],
                    g = imgData.data[x + y * imgData.width * 4 + 1],
                    b = imgData.data[x + y * imgData.width * 4 + 2],
                    a = imgData.data[x + y * imgData.width * 4 + 3];
                callback.call(imgData, {
                    r: r,
                    g: g,
                    b: b,
                    a: a
                });
            }
        }
    },

    /*事件绑定*/
    bind: function(element, type, handler){
        var util = $.myUtil;
        if(element.addEventListener){
            element.addEventListener(type, handler, false);
        }else if(element.attachEvent){
            element.attachEvent("on"+type, handler);
        }else{
            element["on" + type] = handler;
        }
    },
    /*解绑事件*/
    unbind: function(element, type, handler){
        if(element.removeEventListener){
            element.removeEventListener(type, handler, false);
        }else if(element.detachEvent){
            element.detachEvent("on" + type, handler);
        }else{
            element["on" + type] = null;
        }
    },

    test:function(){

    }
};
/*${}类型的字符替换*/
String.prototype.customReplace = function(from, to, type){
    from = from.toString();
    var reg = (type && (type=="g" || type=="i" || type =="m"))?new RegExp("\\${"+from+"}",type):new RegExp("\\${"+from+"}");
    var str = this.toString().replace(reg, to);
    return str;
};
window.cookieUtil = {
    get: function(name){
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;

        if(cookieStart > -1){
            var cookieEnd = document.cookie.indexOf(";", cookieStart);
            if(cookieEnd == -1){
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    /*
     * 名、值、失效日期、路径、域
     * */
    set: function(name, value, expires, path, domain, secure){
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        if(expires instanceof Date){
            cookieText += "; expires=" + expires.toGMTString();
        }
        if(path){
            cookieText += "; path=" + path;
        }
        if(domain){
            cookieText += "; domain=" + domain;
        }
        if(secure){
            cookieText += "; secure";
        }
        document.cookie = cookieText;
    },

    unset: function(name, path, domain, secure){
        this.set(name, "", new Date(0), path, domain, secure);
    }
};
/*定义跨浏览器的动画定时器*/
window.requestNextAnimationFrame =
    (
        function(){
            var originalWebkitMethod,
                wrapper = undefined,
                callback = undefined,
                geckoVersion = 0,
                userAgent = navigator.userAgent,
                index = 0,
                self = this;
            //workaround for chrome 10 bug where chrome
            //does not pass the time to the animateion function

            if(window.webkitRequestAnimationFrame){
                // define the wrapper
                wrapper = function(time){
                    if(!time) time = +new Date();
                    self.callback(time);
                }
                // make the switch
                originalWebkitMethod = window.webkitRequestAnimationFrame;

                window.webkitRequestAnimationFrame =
                    function(callback, element){
                        self.callback = callback;
                        //browser calls wrapper; wrapper calls callback
                        originalWebkitMethod(wrapper, element);
                    };
            }
            // workaround for Gecko 2.0, which has a bug in mozRequestAnimationFrame() that restricts animations to 30-40 fps
            if(window.mozRequestAnimationFrame){
                //check the Gecko version. Gecko is used by browsers
                //other than Firefox. Gecko 2.0 corresponds to
                //Firefox 4.0

                index = userAgent.indexOf('rv:');

                if(userAgent.indexOf('Gecko') != -1){
                    geckoVersion = userAgent.substr(index + 3, 3);

                    if(geckoVersion === '2.0'){
                        //Forces the return statement to fall throungh
                        //to the setTimeout() function

                        window.mozRequestAnimationFrame = undefined;
                    }
                }
            }

            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback, element){
                    var start,
                        finish;
                    window.setTimeout(function(){
                        start = + new Date();
                        callback(start);
                        finish = +new Date();

                        self.timeout = 1000 / 60 - (finish - start);
                    }, self.timeout);
                };
        }
        )();