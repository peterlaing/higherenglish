function showPanel(clicked)
{
    const wasHidden = annotationPanel.classList.contains("hidden");
    annotationPanel.classList.remove("hidden");

    window.requestAnimationFrame(() =>
    {
        if(wasHidden) annotationPanel.classList.remove("use-transition");
        annotationPanel.classList.add("opened");

        getPageVars(clicked, wasHidden);
    });
}

function getPageVars(clicked, predict)
{
    //header + banner + both gaps + padding
    let topArea = 100 + 224 + 32 + 24 + 16;
    let yPos = clicked.offsetTop - topArea;

    let panelHeight = predict ? 0 : annotationPanel.offsetHeight;
    let pageHeight = predict ? 0 : storyPanel.offsetHeight;

    if(!predict) movePanel(yPos, panelHeight, pageHeight);
    else window.requestAnimationFrame(() =>
    {
        panelHeight = annotationPanel.offsetHeight;
        pageHeight = storyPanel.offsetHeight;

        annotationPanel.classList.remove("opened");
        window.requestAnimationFrame(() => 
        {
            annotationPanel.classList.add("use-transition", "opened")
            movePanel(yPos, panelHeight, pageHeight);
        });
    });
}

function movePanel(yPos, panelHeight, pageHeight)
{
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
    history.replaceState(null, '', window.location.pathname);
    if(selectedQuote !== null) selectedQuote.classList.remove("selected");

    annotationPanel.classList.remove("opened");
    window.setTimeout(() => annotationPanel.classList.add("hidden"), 120);
}

function copyLink()
{
    const params = new URL(window.location.href.split("?")[0]);
    params.searchParams.set("id", authorText.textContent.slice(-5).substring(0, 4));

    navigator.clipboard.writeText(params.href);
    alert("Copied link to clipboard!\n" + params.href);
}