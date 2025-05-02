function importSettings()
{
    const input = document.getElementById("fileInput");
    input.click();
}

function handleImport(event)
{
    const file = event.target.files[0];
    console.log(file);
    if(!file) return;

    const reader = new FileReader();
    reader.onload = (e) =>
    {
        const text = e.target.result;
        applySettings(text);
    };
    reader.readAsText(file);
}

function applySettings(text)
{
    const items = text.split("|");
    if(items.length !== 3)
    {
        alert("Invalid File!");
        return;
    }

    if(items[0] != "null") localStorage.setItem("siteTheme", items[0]);
    if(items[1] != "null") localStorage.setItem("lastVisited", items[1]);
    if(items[2] != "")
    {
        let quotes = [];
        for(let i = 0; i < items[2].length; i += 4)
        {
            const id = items[2].substring(i, i + 4);
            quotes.push(id);
        }
        const json = JSON.stringify(quotes);
        localStorage.setItem("savedQuotes", json);
    }

    alert("Successfully Imported!");
    location.reload();
}

function exportSettings()
{
    const saved = localStorage.getItem("savedQuotes");
    let json = null;
    let quotes = "|";
    if(saved !== null)
    {
        json = JSON.parse(saved);
        quotes += json.join("");
    }

    const theme = localStorage.getItem("siteTheme");
    const graph = "|" + localStorage.getItem("lastVisited");

    const blob = new Blob([theme, graph, quotes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "quotes.txt";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
}

function resetSettings()
{
    localStorage.clear();
    alert("Successfully Reset!")
    location.reload();
}