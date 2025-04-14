function saveQuote(id)
{
    savedQuotes.push(id);
    const quotesJSON = JSON.stringify(savedQuotes);
    localStorage.setItem("savedQuotes", quotesJSON);
}

function unsaveQuote(id)
{
    const index = savedQuotes.indexOf(id);
    if(index === -1) return;

    savedQuotes.splice(index, 1);
    const quotesJSON = JSON.stringify(savedQuotes);
    localStorage.setItem("savedQuotes", quotesJSON);
}

function isSaved(id)
{
    return savedQuotes.includes(id);
}

let savedQuotes = [];
const storedValues = localStorage.getItem("savedQuotes");
if(storedValues !== null) savedQuotes = JSON.parse(storedValues);