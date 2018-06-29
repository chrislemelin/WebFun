const CHAR_DELAY = 100;


function makeTitles()
{
    $(".gallery-img-text").each(
        function()
        {
            var chars = this.innerText.split('');
            $(this).empty();
            for(var i = 0; i < chars.length; i++)
            {
                $(this).append("<span class='title-span'>"+chars[i]+"</span>");
            }
        }
    )

    $(".gallery-img-container").each(
        function()
        {
            $(this).mouseenter(()=> handleMouseEnter(this));
            $(this).mouseleave(()=> handleMouseLeave(this));

        }
    )

}


function handleMouseEnter(element)
{
    var spanContainer = $(element).find('.gallery-img-text');
    spanContainer.children().each(
        function(index)
        {
            setTimeout(
                ()=> $(this).css("top","50px"), index * CHAR_DELAY
            )
        }
    )
}

function handleMouseLeave(element)
{
    var spanContainer = $(element).find('.gallery-img-text');
    spanContainer.children().each(
        function(index)
        {
            setTimeout(
                ()=> $(this).css("top","0px"), index * CHAR_DELAY
            )
        }
    )
}

function init()
{
    makeTitles();
}


window.onload = init;
