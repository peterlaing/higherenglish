let annotationPanel = null;
let authorText = null;
let quoteText = null;
let analysisSpan = null;
let tagList = null;
let saveButton = null;
let bookmarkIcon = null;
let storyPanel = null;

function getPanelElements()
{
    annotationPanel = document.getElementById("annotation-panel");
    authorText = document.getElementById("author");
    quoteText = document.getElementById("quote");
    analysisSpan = document.getElementById("analysis");
    tagList = document.getElementById("theme-list");
    saveButton = document.getElementById("save");
    bookmarkIcon = document.getElementById("bookmark");
    storyPanel = document.getElementById("story");

    document.getElementById("story-division").appendChild(annotationPanel);
}

let selectedQuote = null;
function viewAnnotation(id, clicked)
{
    if(annotationPanel === null) getPanelElements();

    const annotation = annotations[id];
    authorText.innerHTML = `${annotation.author} [${id}]`;
    quoteText.innerHTML = `<cite>${annotation.quote}</cite>`;
    analysisSpan.innerHTML = getAnalysisHTML(annotation.analysis);
    saveButton.setAttribute("onclick", `saveAnnotation("${id}");`);
    fixTagList(annotation);
    updateBookmark(id);

    if(selectedQuote !== null) selectedQuote.classList.remove("selected");
    selectedQuote = clicked;

    clicked.classList.add("selected");
    showPanel(clicked);
}

function getAnalysisHTML(analysis)
{
    let html = "";
    const lines = analysis.split("\n");
    for(const line of lines)
    {
        if(line.startsWith("![](")) html += `<img src='/annotations/images/${line.slice(4, -1)}'>`;
        else html += `<p>${line}</p>`;
    }
    return html;
}

function fixTagList(annotation)
{
    tagList.innerHTML = "";
    for(let tag of annotation.tags)
        tagList.innerHTML +=`<a href="/pages/other/search.html?q=%${tag}" class="theme-search">${tag}</a>`;
}

function updateBookmark(id)
{
    bookmarkIcon.classList.add(isSaved(id) ? "fa-solid" : "fa-regular");
    bookmarkIcon.classList.remove(isSaved(id) ? "fa-regular" : "fa-solid");
}

function saveAnnotation(id)
{
    if(isSaved(id)) unsaveQuote(id);
    else saveQuote(id);
    updateBookmark(id);
}