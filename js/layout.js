/**
 * Created by dongyq on 2014/8/6.
 */
$().ready(function(){
    var main = $(".main"),
        left = $(".left"),
        center = $(".center"),
        bottom = $(".bottom");
    main.width(main.width());
    main.height(main.height());
    left.width(left.width());

    center.width(
        main.width() -
            left.width() -
            parseFloat(left.css("border-left-width")) -
            parseFloat(left.css("border-right-width")) -
            parseFloat(left.css("padding-left")) -
            parseFloat(left.css("padding-right")) -
            parseFloat(left.css("margin-left")) -
            parseFloat(left.css("margin-right")) -
            parseFloat(center.css("border-left-width")) -
            parseFloat(center.css("border-right-width"))
    );
    bottom.height(
        main.height() -
            left.height() -
            parseFloat(left.css("border-top-width")) -
            parseFloat(left.css("border-bottom-width")) -
            parseFloat(left.css("padding-top")) -
            parseFloat(left.css("padding-bottom")) -
            parseFloat(left.css("margin-top")) -
            parseFloat(left.css("margin-bottom")) -
            parseFloat(bottom.css("border-top-width")) -
            parseFloat(bottom.css("border-bottom-width"))
    )
});