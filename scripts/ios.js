function checkHTMLStyle()
{
    if(window.scrollY > 100 && !setToWhite)
    {
        setToWhite = true;
        document.documentElement.style.backgroundColor = "var(--gray-2)";
    }
    else if(window.scrollY <= 100 && setToWhite)
    {
        setToWhite = false;
        document.documentElement.style.backgroundColor = "var(--colour-4)";
    }
}

let setToWhite = false;
onscroll = () => checkHTMLStyle();