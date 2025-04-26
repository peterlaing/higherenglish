function checkHTMLStyle()
{
    if(!document.hasFocus()) return;

    if(window.scrollY > 100 && !setToWhite)
    {
        setToWhite = true;
        document.documentElement.style.backgroundColor = "var(--background-colour)";
    }
    else if(window.scrollY <= 100 && setToWhite)
    {
        setToWhite = false;
        document.documentElement.style.backgroundColor = "var(--header-dark)";
    }
}

let setToWhite = false;
onscroll = () => checkHTMLStyle();