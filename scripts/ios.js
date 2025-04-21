function checkHTMLStyle()
{
    if(!document.hasFocus()) return;

    if(window.scrollY > 100 && !setToWhite)
    {
        setToWhite = true;
        document.documentElement.style.backgroundColor = "var(--gray-1)";
    }
    else if(window.scrollY <= 100 && setToWhite)
    {
        setToWhite = false;
        document.documentElement.style.backgroundColor = "var(--colour-4)";
    }
}

let setToWhite = false;
onscroll = () => checkHTMLStyle();