let json = [];
let paragraphs = [];
const annotations = {};

async function loadAnnotations(story)
{
    paragraphs = document.getElementById("story").getElementsByTagName("p");

    const url = "/pages/annotations/" + story + ".json";
    const response = await fetch(url);
    const raw = await response.text();

    json = JSON.parse(raw);
    json.forEach(annotation =>
    {
        annotations[annotation.id] = annotation;
        addAnnotation(annotation);
    });
}

function addAnnotation(annotation)
{
    for(const paragraph of paragraphs)
    {
        const text = paragraph.innerHTML;
        const index = text.indexOf(annotation.quote);

        if(index !== -1)
        {
            const before = text.slice(0, index);
            const after = text.slice(index + annotation.quote.length);
            paragraph.innerHTML = `${before}<span class="annotation clickable" onclick="viewAnnotation('${annotation.id}', this);">${annotation.quote}</span>${after}`;
            return;
        }
    };
}

let annotationPanel = null;
let authorText = null;
let quoteText = null;
let analysisSpan = null;

function getPanelElements()
{
    annotationPanel = document.getElementById("annotation-panel");
    authorText = document.getElementById("author");
    quoteText = document.getElementById("quote");
    analysisSpan = document.getElementById("analysis");

    document.getElementById("story-division").appendChild(annotationPanel);
}

function viewAnnotation(id, element)
{
    if(annotationPanel === null) getPanelElements();

    const annotation = annotations[id];
    authorText.innerHTML = annotation.author;
    quoteText.innerHTML = `<i>${annotation.quote}</i>`;

    let html = "";
    lines = annotation.analysis.split("\n");
    for(const line of lines)
    {
        if(line.startsWith("![](")) continue;//html += `<img src='${line.slice(4, -1)}'>`;
        else html += `<p>${line}</p>`;
    }

    analysisSpan.innerHTML = html;

    const wasHidden = annotationPanel.classList.contains("hidden");
    annotationPanel.classList.remove("hidden");

    window.setTimeout(updatePanelWidth, 100);
    if(!wasHidden) window.setTimeout(updatePanelY, 0, element);
    window.setTimeout(updatePanelY, 250, element);
}

function updatePanelWidth()
{
    annotationPanel.style.width = "400px";
    annotationPanel.style.marginLeft = "8px";
}

function updatePanelY(element)
{
    const yPos = element.offsetTop;
    annotationPanel.style.top = (yPos - 208) + "px";

    const windowHeight = window.innerHeight * 0.5;
    const panelHeight = annotationPanel.offsetHeight * 0.5;
    const scrollPos = yPos - windowHeight + panelHeight;
    window.scrollTo({top: scrollPos, behavior: "smooth"});
}

function closeAnnotations()
{
    annotationPanel.style.width = "0px";
    annotationPanel.style.marginLeft = "0px";
    window.setTimeout(hideAnnotations, 200);
}

function hideAnnotations()
{
    annotationPanel.classList.add("hidden");
}