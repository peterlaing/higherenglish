function showPanel(clicked)
{
    const wasHidden = annotationPanel.classList.contains("hidden");
    annotationPanel.classList.remove("hidden");

    requestAnimationFrame(() =>
    {
        if(wasHidden) annotationPanel.classList.remove("use-transition");
        annotationPanel.classList.add("opened");

        movePanel(clicked, wasHidden);
    });
}

function movePanel(clicked, predict)
{
    //header + banner + both gaps + padding
    let topArea = 100 + 224 + 32 + 24 + 16;
    setTimeout(() =>
    {
        const panelHeight = annotationPanel.offsetHeight;
        const pageHeight = storyPanel.offsetHeight;

        const yPos = centreY(clicked.offsetTop - topArea, pageHeight - panelHeight - 8);
        scrollTo({top: clicked.offsetTop - topArea, behavior: "smooth"});

        if(!predict) annotationPanel.style.top = yPos + "px";
        else
        {
            annotationPanel.classList.remove("opened");
            requestAnimationFrame(() => 
            {
                annotationPanel.classList.add("use-transition", "opened")
                annotationPanel.style.top = yPos + "px";
            });
        }
    }, analysisSpan.innerHTML.includes("<img") ? 50 : 0);
}

function centreY(yPos, max)
{
    yPos += 16; //account for top shadow
    yPos -= 54; //move a bit more within view

    if(yPos < 16) yPos = 16;
    if(yPos > max) yPos = max;

    return yPos;
}

function closeAnnotations()
{
    history.replaceState(null, '', window.location.pathname);
    if(selectedQuote !== null) selectedQuote.classList.remove("selected");

    annotationPanel.classList.remove("opened");
    setTimeout(() => annotationPanel.classList.add("hidden"), 140);
}

function copyLink()
{
    const params = new URL(window.location.href.split("?")[0]);
    params.searchParams.set("id", authorText.textContent.slice(-5).substring(0, 4));

    navigator.clipboard.writeText(params.href);
    alert("Copied link to clipboard!\n" + params.href);
}