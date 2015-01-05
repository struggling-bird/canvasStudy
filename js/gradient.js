/**
 * Created by dyq on 2014/9/23.
 */
$().ready(function(){
    var toCanvas = $("#toCanvas"),
        util = $.myUtil,
        canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        point1 = {
            x:200,
            y:50,
            r:20
        },
        point2 = {
            x:200,
            y:200,
            r:50
        },
        colorStops = [],
        currentColorIndex = 0,
        bgColor = "black";

    draw();

    $("input").change(function(event){
        var value = parseFloat(this.value);
        switch (this.id){
            case "x1":
                point1.x = value;
                break;
            case "y1":
                point1.y = value;
                break;
            case "r1":
                point1.r = value;
                break;
            case "x2":
                point2.x = value;
                break;
            case "y2":
                point2.y = value;
                break;
            case "r2":
                point2.r = value;
                break;
            case "opacity":/*透明度*/
                colorStops[currentColorIndex].a = value;
                var rgb = colorStops[currentColorIndex];
                $($(".color")[currentColorIndex]).css("background-color", 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')')
                break;
            case "showBorder":/*是否显示辅助圆*/
                break;
        }
        draw();
    });

    /*颜色选择器*/
    $(".add").click(function(){
        $(".colorStops").append('<span class="color"></span>');
        colorStops.push({
            r:0,
            g:0,
            b:0,
            a:1
        });
        currentColorIndex = $(".color").length - 1;
        var a = $(".colorStops .color").last().colpick({
            layout:'full',
            submit:0,
            colorScheme:'dark',
            onChange:function(hsb,hex,rgb,el,bySetColor) {
                rgb.a = parseFloat($("#opacity").val());
                currentColorIndex = $(el).prevAll().length;
                colorStops[currentColorIndex] = rgb;
                $(el).css("background-color",'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')');
                draw();
            },
            onShow: function(){
                currentColorIndex = $(this).prevAll().length;
                $("#opacity").val(colorStops[currentColorIndex].a);
            }
        }).click();
    });
    /*背景色选择器*/
    $("#bgColor").colpick({
        layout:'full',
        submit:0,
        colorScheme:'dark',
        onChange:function(hsb,hex,rgb,el,bySetColor) {
            $(el).css("background-color",'rgb('+rgb.r+','+rgb.g+','+rgb.b+')');
            bgColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
            draw();
        }
    });
    function draw(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawBg();
        context.beginPath();
        var gradient = context.createRadialGradient(point1.x, point1.y, point1.r, point2.x, point2.y, point2.r);

        for(var i=0; i<colorStops.length; i++){
            var color = colorStops[i],
                offset = 1/colorStops.length * i;
            gradient.addColorStop(offset, 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')');
        }
        context.fillStyle = gradient;
        context.rect(0, 0, context.canvas.width, context.canvas.height);
        context.fill();
        context.closePath();

        if($("#showBorder").attr("checked")){
            help();
        }
    }
    function drawBg(){
        context.beginPath();
        context.fillStyle = bgColor;
        context.rect(0, 0, context.canvas.width, context.canvas.height);
        context.fill();
        context.closePath();
    }
    function help(){
        context.beginPath();
        context.strokeStyle = "red";
        context.arc(point1.x, point1.y, point1.r, 0, util.getRadian(360));
        context.stroke();
        context.closePath();
        context.beginPath();
        context.arc(point2.x, point2.y, point2.r, 0, util.getRadian(360));
        context.stroke();
        context.closePath();
    }
});