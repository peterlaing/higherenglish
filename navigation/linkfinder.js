function isHypothesisLoaded()
{
    const sidebar = document.querySelector("hypothesis-highlight");
    return sidebar != null;
}

function attemptLinking(tries)
{
    if(tries > 8) return;

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
                const yPos = annotation.getBoundingClientRect().top;
                const offset = window.scrollY - window.innerHeight / 2;
                window.scrollTo({top: yPos + offset, behavior: "smooth"});
                return;
            }
        }
    }
}

window.setTimeout(() => attemptLinking(0), 1000);