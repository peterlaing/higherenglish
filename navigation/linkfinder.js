function isHypothesisLoaded()
{
    const sidebar = document.querySelector("hypothesis-highlight");
    return sidebar != null;
}

function attemptLinking(tries)
{
    if(tries > 5) return;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const targetText = params.get("text");

    if(targetText)
    {
        if(!isHypothesisLoaded())
        {
            window.setTimeout(() => attemptLinking(tries + 1), 400);
            return;
        }

        const annotations = document.querySelectorAll("hypothesis-highlight");
        for(const annotation of annotations)
        {
            if(annotation.innerHTML.includes(targetText))
            {
                annotation.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }
    }
}

window.setTimeout(() => attemptLinking(0), 1000);