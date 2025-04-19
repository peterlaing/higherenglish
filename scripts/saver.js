function saveQuote(id)
{
    savedQuotes.push(id);
    updateQuotes();
}

function unsaveQuote(id)
{
    const index = savedQuotes.indexOf(id);
    if(index === -1) return;

    savedQuotes.splice(index, 1);
    updateQuotes();
}

function setQuotes(newList)
{
    savedQuotes = newList;
    updateQuotes();
}

function updateQuotes()
{
    const quotesJSON = JSON.stringify(savedQuotes);
    localStorage.setItem("savedQuotes", quotesJSON);
}

function isSaved(id)
{
    return savedQuotes.includes(id);
}

const blockedPunctuation = [",", ".", ":"];
function parseQuote(quote)
{
    quote = quote.trim();
    if(blockedPunctuation.includes(quote[quote.length - 1]))
        quote = quote.slice(0, quote.length - 1);

    return quote;
}

let savedQuotes = [];
const storedValues = localStorage.getItem("savedQuotes");
if(storedValues !== null) savedQuotes = JSON.parse(storedValues);