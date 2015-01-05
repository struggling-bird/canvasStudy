/**
 * Created by dongyq on 2014/8/11.
 */
$().ready(function(){
    $(".left ul li").click(function(){
        $(this).addClass("on").siblings().removeClass("on");
    });
});