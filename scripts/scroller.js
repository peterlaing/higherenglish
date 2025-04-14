function showPanel(clicked)
{
    const wasHidden = annotationPanel.classList.contains("hidden");
    annotationPanel.classList.remove("hidden");

    window.requestAnimationFrame(() =>
    {
        if(wasHidden) annotationPanel.style.transition = "none";
        annotationPanel.style.width = "400px";
        annotationPanel.style.marginLeft = "8px";

        getPageVars(clicked, wasHidden);
    });
}

function getPageVars(clicked, predict)
{
    //header + banner + both gaps + padding
    let topArea = 100 + 224 + 32 + 24 + 16;
    let yPos = clicked.offsetTop - topArea;

    let panelHeight = 0;
    let pageHeight = 0;
    window.requestAnimationFrame(() =>
    {
        window.requestAnimationFrame(() =>
        {
            panelHeight = annotationPanel.offsetHeight;
            pageHeight = storyPanel.offsetHeight;
            movePanel(predict, yPos, panelHeight, pageHeight)
        });
    });
}

function movePanel(predict, yPos, panelHeight, pageHeight)
{
    if(predict)
    {
        annotationPanel.style.width = "0px";
        annotationPanel.style.marginLeft = "0px";
        window.requestAnimationFrame(() =>
        {
            annotationPanel.style.transition = "top 0.4s ease-in-out, width var(--anim-time), margin-left var(--anim-time)";
            annotationPanel.style.width = "400px";
            annotationPanel.style.marginLeft = "8px";
        });
    }

    yPos += 16; //account for top shadow
    yPos -= 54; //move a bit more within view

    const max = pageHeight - panelHeight - 8;
    if(yPos < 16) yPos = 16;
    if(yPos > max) yPos = max;

    annotationPanel.style.top = yPos + "px";
    window.scrollTo({top: yPos, behavior: "smooth"});
}

function closeAnnotations()
{
    /*event.preventDefault();
    history.pushState(null, '', window.location.pathname);*/
    if(selectedQuote !== null) selectedQuote.classList.remove("selected");

    annotationPanel.style.width = "0px";
    annotationPanel.style.marginLeft = "0px";
    window.setTimeout(() => annotationPanel.classList.add("hidden"), 120);
}