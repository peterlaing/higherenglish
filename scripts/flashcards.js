const form = document.getElementById("settings");
function generateURL()
{
    const params = new URL(window.location.href.split("?")[0]);

    const clueChar = form["clue"].value[0].toLowerCase();
    const answerChar = form["answer"].value[0].toLowerCase();
    params.searchParams.set("type", clueChar + answerChar);

    let options = "";
    if(form["shuffle"].checked) options += "s";
    if(form["repeat"].checked) options += "r";
    if(form["timed"].checked) options += "t";
    if(form["hidden"].checked) options += "h";
    params.searchParams.set("opts", options);

    const quotes = getSortedIDs(false, true);
    params.searchParams.set("list", quotes.join(""));
    return params.href;
}

function startFlashcards()
{
    window.location = generateURL();
}

function shareSet()
{
    const url = generateURL();
    navigator.clipboard.writeText(url);
    alert("Copied link to clipboard!\n" + url);
}

function parseType(character)
{
    return character == "q" ? "Quote"
    : character == "a" ? "Analysis"
    : character == "t" ? "Tags"
    : "Identifier";
}

function updateForm()
{
    form["clue"].value = parseType(typeString[0]);
    form["answer"].value = parseType(typeString[1]);

    form["shuffle"].checked = optionString.includes("s");
    form["repeat"].checked = optionString.includes("r");
    form["timed"].checked = optionString.includes("t");
    form["hidden"].checked = optionString.includes("h");
}





let ids = [];
let order = [];
let index = -1;
let typeString = "";
let optionString = "";

function setOrder()
{
    for(let i = 0; i < ids.length; i++)
        order.push(i);

    if(optionString.includes("s"))
    {
        let shuffleIndex = order.length;
        while(shuffleIndex !== 0)
        {
            let randomIndex = Math.floor(Math.random() * shuffleIndex);
            shuffleIndex--;

            let tempValue = order[shuffleIndex];
            order[shuffleIndex] = order[randomIndex];
            order[randomIndex] = tempValue;
        }
    }
    toNext();
}

function toNext()
{
    const oldIndex = index;
    index += 1;

    if(index >= ids.length)
    {
        const loop = optionString.includes("r");
        index = loop ? 0 : index - 1;
    }

    if(index !== oldIndex)
    {
        flashcard.classList.remove("flipped");
        refreshCard(index);
    }
}

function toPrevious()
{
    const oldIndex = index;
    index -= 1;

    if(index < 0)
    {
        const loop = optionString.includes("r");
        index = loop ? ids.length - 1 : 0;
    }

    if(index !== oldIndex)
    {
        flashcard.classList.remove("flipped");
        refreshCard(index);
    }
}

function parseAnalysis(analysis)
{
    let html = "";
    const lines = analysis.split("\n");
    for(const line of lines)
    {
        if(line.startsWith("![](")) continue;
        else html += `<p>${line}</p>`;
    }
    return html;
}

function getProperty(annotation, character)
{
    return character == "q" ? parseQuote(annotation.quote)
    : character == "a" ? parseAnalysis(annotation.analysis)
    : character == "t" ? annotation.tags.join(", ")
    : annotation.id;
}

let currentTimer = null;
function cancelTimers()
{
    if(currentTimer !== null)
    {
        clearTimeout(currentTimer);
        currentTimer = null;
    }
    if(activeLoader !== null)
    {
        clearTimeout(activeLoader);
        activeLoader = null;
    }
}

const flashcard = document.getElementById("flashcard");
const counter = document.getElementById("counter");
const clue = document.getElementById("clue");
const answer = document.getElementById("answer");
function refreshCard(index)
{
    cancelTimers();

    flashcard.classList.remove("fade-in");
    flashcard.classList.add("fade-out");
    setTimeout(() =>
    {
        const annotation = annotationDict[ids[order[index]]];
        counter.innerHTML = `${index + 1}/${ids.length}`;
        answer.innerHTML = getProperty(annotation, typeString[1]);

        const clueText = getProperty(annotation, typeString[0]);
        if(optionString.includes("h")) setTimeout(() => loadClueSlowly(clueText, 0.0), 0);
        else
        {
            clue.innerHTML = clueText;
            if(optionString.includes("t"))
                currentTimer = setTimeout(() => toNext(), 3000);
        }

        flashcard.classList.remove("t");
        flashcard.classList.remove("h");
        flashcard.classList.remove("r");
        flashcard.classList.remove("m");
        flashcard.classList.add(annotation.id[0]);

        flashcard.classList.add("fade-in");
        flashcard.classList.remove("fade-out");
    }, 100);
}

let activeLoader = null;
const speed = 0.25;
function loadClueSlowly(clueText, stage)
{
    if(stage >= 1)
    {
        clue.innerHTML = clueText;
        activeLoader = null;
        if(optionString.includes("t"))
            currentTimer = setTimeout(() => toNext(), 1000);
        return;
    }

    revealedPart = clueText.substring(0, stage * clueText.length);
    clue.innerHTML = revealedPart;

    activeLoader = setTimeout(() => loadClueSlowly(clueText, stage + 0.01 * speed), 10);
}

function loadFlashcards(query)
{
    typeString = query.get("type");
    optionString = query.get("opts");
    updateForm();

    const listString = query.get("list");
    for(let i = 0; i < listString.length; i += 4)
        ids.push(listString.substring(i, i + 4));

    setOrder();
}

loadAnnotations(() =>
{
    const query = new URLSearchParams(window.location.search);
    if(query.has("list") && query.get("list").length !== 0) loadFlashcards(query);
    loadQuotes(query, ids);
});