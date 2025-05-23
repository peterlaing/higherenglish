function loadQuotes(query, ids)
{
    savedQuoteList = document.getElementById("saved-quotes");
    const quoteString = query.has("list") ? query.get("list") : null;
    const combinedIDs = [...new Set([...ids, ...savedQuotes])]

    if(combinedIDs.length !== 0) combinedIDs.forEach(id => createQuote(annotationDict[id], quoteString));
    else
    {
        const message = document.createElement("h3");
        message.textContent = "No Quotes Saved!";
        message.style = "text-align: center";
        savedQuoteList.appendChild(message);
    }
}

let savedQuoteList = null;
function createQuote(annotation, queryString)
{
    const id = annotation.id[0];
    const colour =
    id == "t" ? "green"
    : id == "h" ? "blue"
    : id == "r" ? "red"
    : "yellow";

    const translucent = queryString === null ? "" : queryString.includes(annotation.id) ? "" : " translucent";
    const bookmark = isSaved(annotation.id) ? "fa-solid" : "fa-regular";

    const html = `
    <li class="saved-quote${translucent}" draggable="true"
    ondragstart="startDragging(this);"
    ondragend="classList.remove('dragging');">
        <h6 class="identifier">${annotation.id}</h6>
        <i class="fa-solid fa-grip-lines-vertical draggable"></i>
        <nav class="story-mark ${colour}"></nav>
        <p>${parseQuote(annotation.quote)}</p>
        <button class="move-up quote-button" onclick="moveUp(parentNode);">
            <i class="fa-solid fa-arrow-up clickable"></i>
        </button>
        <button class="move-down quote-button" onclick="moveDown(parentNode);">
            <i class="fa-solid fa-arrow-down clickable"></i>
        </button>
        <button class="toggle-button quote-button" onclick="hideAnnotation(this);">
            <i class="fa-solid fa-eye-slash clickable"></i>
        </button>
        <button class="delete-button quote-button" onclick="deleteAnnotation(this);">
            <i class="${bookmark} fa-bookmark clickable"></i>
        </button>
    </li>`;

    savedQuoteList.innerHTML += html;
}



function startDragging(element){ requestAnimationFrame(() => element.classList.add('dragging')) }

const sortableList = document.getElementById("saved-quotes");
function sortList(event)
{
    const current = sortableList.querySelector(".dragging");
    const siblings = [...sortableList.querySelectorAll(".saved-quote:not(.dragging)")];
    let nextSibling = siblings.find(sibling => event.clientY <= sibling.getBoundingClientRect().top + sibling.offsetHeight * 0.5);

    if(current.nextElementSibling !== nextSibling)
    {
        sortableList.insertBefore(current, nextSibling);
        setQuotes(getSortedIDs(true, false));
    }
}

function sortNaturally()
{
    const order = ["t", "h", "r", "m"];
    [...sortableList.children].sort(function(a, b)
    {
        const aString = a.querySelector("h6").textContent[0];
        const bString = b.querySelector("h6").textContent[0];

        const aIndex = order.indexOf(aString);
        const bIndex = order.indexOf(bString);

        if(aIndex === bIndex) return aString.localeCompare(bString);
        if(aIndex === -1) return 1;
        if(bIndex === -1) return -1;
        return aIndex - bIndex;
    }).forEach(node => sortableList.appendChild(node));
    setQuotes(getSortedIDs(true, false));
}

function getSortedIDs(onlySaved, onlyVisible)
{
    let newArray = [];

    const children = sortableList.children;
    for(let i = 0; i < children.length; i++)
    {
        if(onlySaved && children[i].querySelector(".fa-bookmark").classList.contains("fa-regular")) continue;
        if(onlyVisible && children[i].classList.contains("translucent")) continue;

        const id = children[i].querySelector("h6").textContent;
        newArray.push(id);
    };

    return newArray;
}

function showAll()
{
    const children = sortableList.children;
    for(let i = 0; i < children.length; i++)
    {
        children[i].classList.remove("translucent");
        children[i].querySelector(".toggle-button").querySelector("i").classList.add("fa-eye");
        children[i].querySelector(".toggle-button").querySelector("i").classList.remove("fa-eye-slash");
    }
}

function hideAll()
{
    const children = sortableList.children;
    for(let i = 0; i < children.length; i++)
    {
        children[i].classList.add("translucent");
        children[i].querySelector(".toggle-button").querySelector("i").classList.remove("fa-eye");
        children[i].querySelector(".toggle-button").querySelector("i").classList.add("fa-eye-slash");
    }
}



function moveUp(element)
{
    if(element.previousElementSibling === null) return;
    sortableList.insertBefore(element, element.previousElementSibling);
    setQuotes(getSortedIDs(true, false));
}

function moveDown(element)
{
    if(element.nextElementSibling === null) return;
    sortableList.insertBefore(element, element.nextElementSibling.nextElementSibling);
    setQuotes(getSortedIDs(true, false));
}

function hideAnnotation(element)
{
    element.querySelector("i").classList.toggle("fa-eye");
    element.querySelector("i").classList.toggle("fa-eye-slash");
    element.parentNode.classList.toggle("translucent");
}

function deleteAnnotation(element)
{
    const classes = element.querySelector("i").classList;
    const id = element.parentNode.querySelector("h6").textContent;
    const wasSaved = classes.contains("fa-solid");

    classes.toggle("fa-solid");
    classes.toggle("fa-regular");

    if(wasSaved) unsaveQuote(id);
    else
    {
        saveQuote(id);
        setQuotes(getSortedIDs(true, false));
    }
}