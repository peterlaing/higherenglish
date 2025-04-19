const tagImportance =
{
    //General Techniques
    "Characterisation": 0.6,
    "Context":          0.6,
    "Exposition":       0.6,
    "Imagery":          0.6,

    //Characters
    "Thin Woman":    0.9,
    "Fat Woman":     0.9,
    "Elder":         1.0,
    "Mr Jackson":    0.9,
    "Mrs Jackson":   0.9,
    "The Factor":    1.0,
    "Youths":        1.0,
    "Murdo":         0.9,
    "Mary":          0.9,
    "Mother":        0.9,
    "Son":           0.9,

    //Key Themes
    "Apartheid":     1.0,
    "Belonging":     1.0,
    "Community":     1.0,
    "Conformity":    1.0,
    "Identity":      1.0,
    "Impact of War": 1.0,
    "Isolation":     1.0,
    "Judgement":     1.0,
    "Misery":        1.0,
    "Monotony":      1.0,
    "Nostalgia":     1.0,
    "Permanence":    1.0,
    "Poverty":       1.0,
    "Prejudice":     1.0,
    "Rurality":      1.0,
    "Sacrifice":     1.0,
    "Status":        1.0,
    "Urban Life":    1.0,
    "Village Life":  1.0,
    "Wealth":        1.0,

    //Secondary Themes
    "Agreement":     1.0,
    "Change":        1.0,
    "Concealment":   1.0,
    "Contentment":   1.0,
    "Denial":        1.0,
    "Exclusion":     1.0,
    "Family":        1.0,
    "Gossiping":     1.0,
    "Hatred":        1.0,
    "Illness":       1.0,
    "Modernisation": 1.0,
    "Neighbours":    1.0,
    "Paranoia":      1.0,
    "Racism":        1.0,
    "Religion":      1.0,
    "Supernatural":  1.0,
    "Upbringing":    1.0,
    "Violence":      1.0,

    //Traits
    "Awareness":     1.1,
    "Arrogance":     1.1,
    "Avoidance":     1.1,
    "Incompetence":  1.1,
    "Delicacy":      1.1,
    "Greed":         1.1,
    "Ignorance":     1.1,
    "Jealousy":      1.1,
    "Naivety":       1.1,
    "Reluctance":    1.1,
    "Selfishness":   1.1,
    "Unkindness":    1.1,

    //Simple Techniques
    "Contrast":        1.2,
    "Conflict":        1.2,
    "Listing":         1.3,
    "Metaphor":        1.1,
    "Repetition":      1.2,
    "Reference":       1.1,
    "Simile":          1.1,
    "Word Choice":     0.9,

    //Better Techniques
    "Anonymity":           1.5,
    "Character Arc":       1.3,
    "Irony":               1.5,
    "Mockery":             1.4,
    "Narrative":           1.4,
    "Rule of Three":       1.4,
    "Rhetorical Question": 1.3,
    "Sentence Structure":  1.3,
    "Tension":             1.3,
    "Tone":                1.3,

    //Advanced Techniques
    "Anticlimax":          1.7,
    "Colloquialism":       1.8,
    "Colour":              1.8,
    "Hyperbole":           1.6,
    "Juxtaposition":       1.6,
    "Motif":               1.5,
    "Pathetic Fallacy":    1.8,
    "Personification":     1.7,
    "Polysyndeton":        1.9,
    "Symbolism":           1.6
};

function chooseNodes()
{
    let closeness = [];
    annotationList.forEach(annotation =>
    {
        if(annotation.id === focus.id) return;

        let inCommon = 0;
        annotation.tags.forEach(tag =>
        {
            if(focus.tags.includes(tag))
                inCommon += tagImportance[tag];
        });

        closeness.push([annotation, inCommon]);
    });

    closeness.sort((a, b) => b[1] - a[1]);

    let chosenNodes = [];
    let min = 100;
    let max = 0;

    for(let i = 0; i <= 10; i++)
    {
        chosenNodes.push(closeness[i]);
        if(chosenNodes[i][1] < min) min = chosenNodes[i][1];
        if(chosenNodes[i][1] > max) max = chosenNodes[i][1];
    }

    chosenNodes.forEach(node => node[1] = 1 + 0.5 * (node[1] - min) / (max - min));
    chosenNodes.sort((a, b) => a[0].quote.localeCompare(b[0].quote));
    chosenNodes.push([focus, 10]);
    return chosenNodes;
}

function colourOf(annotation)
{
    return annotation.id[0] == "t" ? "green"
    : annotation.id[0] == "h" ? "blue"
    : annotation.id[0] == "r" ? "red"
    : "yellow";
}

function overrideZIndex(element)
{
    graphContainer.querySelectorAll(".node").forEach(node => node.style.zIndex = 1);
    element.style.zIndex = 3;
}

let graphElements = null;
const graphContainer = document.getElementById("graph");
function generateGraph(nodes)
{
    let nodeData = [];
    let nodePairs = [];

    graphContainer.innerHTML = "";
    for(let i = 0; i < nodes.length; i++)
    {
        const newElement = document.createElement("div");
        newElement.classList.add("node", "fading", colourOf(nodes[i][0]));

        if(nodes[i][0] == focus) 
        {
            newElement.id = "central-node";
            centralNode = newElement;
        }
        else newElement.setAttribute("onclick", "tryUpdateGraph(this);" );

        let resetTimer = null;
        newElement.addEventListener("mouseenter", () =>
        {
            if(resetTimer)
            {
                clearTimeout(resetTimer);
                resetTimer = null;
            }
            overrideZIndex(newElement)
        });
        newElement.addEventListener("mouseleave", () => 
        {
            resetTimer = window.setTimeout(() =>
            {
                newElement.style.zIndex = 1;
                resetTimer = null;
            }, 300);
        });

        newElement.innerHTML = `
        <div class="dot"></div>
        <p>${nodes[i][0].id}</p>
        <div class="tooltip"><p>${parseQuote(nodes[i][0].quote)}</p></div>`;

        graphContainer.appendChild(newElement);
        nodePairs.push([nodes[i], newElement]);
    }

    nodePairs.forEach(pair =>
    {
        const element = pair[1];
        if(element === centralNode) return;

        const line = document.createElement("div");
        line.classList.add("edge", "fading");
        graphContainer.appendChild(line);
        nodeData.push([pair[0], element, line]);
    });

    return nodeData;
}

function connectEdges(scale)
{
    const centreRect = centralNode.getBoundingClientRect();

    graphElements.forEach(data =>
    {
        const element = data[1];
        const edge = data[2];

        const rect = element.getBoundingClientRect();
        const dx = centreRect.left - rect.left;
        const dy = centreRect.top - rect.top;

        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        edge.style.width = 8 * Math.sqrt(scale) + "px";
        edge.style.height = length + "px";
        edge.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle + 90}deg)`;
    });
}

let centralNode = document.getElementById("central-node");
function renderGraph()
{
    const chosenNodes = chooseNodes();

    if(graphElements !== null)
    {
        centralNode.classList.add("fading");
        graphElements.forEach(data =>
        {
            data[1].style.left = "calc(50% - 64px)";
            data[1].style.top = "calc(50% - 32px)";
            data[1].classList.add("fading");
            data[2].classList.add("fading");
        });
    }

    setTimeout(() =>
    {
        graphElements = generateGraph(chosenNodes);

        requestAnimationFrame(() =>
        {
            centralNode.classList.remove("fading");
            requestAnimationFrame(() =>
            {
                centralNode.style.transition = "scale 0.3s, opacity 0.3s, top 0.3s, left 0.3s";
            });

            graphElements.forEach(data =>
            {
                const left = data[1].style.left;
                const top = data[1].style.top;

                data[1].style.left = "calc(50% - 64px)";
                data[1].style.top = "calc(50% - 32px)";

                requestAnimationFrame(() =>
                {
                    data[1].style.left = left;
                    data[1].style.top = top;
                    data[1].style.transition = "scale var(--anim-time), box-shadow var(--anim-time), opacity 0.3s, top 0.3s, left 0.3s";
                    data[1].classList.remove("fading");
                    data[2].classList.remove("fading");
                });
            });
        });

        redrawGraph();
    }, graphElements !== null ? 300 : 0);
}

function redrawGraph()
{
    const scale = graphContainer.offsetWidth / 1140;
    const sqrtScale = Math.sqrt(scale);

    const ratio = graphContainer.offsetWidth / graphContainer.offsetHeight;
    const smaller = Math.min(graphContainer.offsetWidth, graphContainer.offsetHeight) * 0.5;
    centralNode.style.scale = sqrtScale;

    const centreX = (graphContainer.offsetWidth - 128) * 0.5;
    const centreY = (graphContainer.offsetHeight - 64) * 0.5;

    centralNode.style.left = centreX + "px";
    centralNode.style.top = centreY + "px";

    const angleStep = 360 / (graphElements.length);
    let currentAngle = 0;
    graphElements.forEach(data =>
    {
        const annotation = data[0];
        const element = data[1];

        element.style.scale = sqrtScale;
        if(centralNode.id !== element.id)
        {
            const radius = (smaller - 60 * scale) / annotation[1] * scale;
            const x = centreX + radius * Math.cos(currentAngle * Math.PI / 180) * Math.sqrt(2 * ratio / scale);
            const y = centreY + radius * Math.sin(currentAngle * Math.PI / 180) * Math.sqrt(2 / ratio / scale);

            element.style.left = x + "px";
            element.style.top = y + "px";
            currentAngle += angleStep;
        }
    });

    connectEdges(scale);
}

let tappedElement = null;
function tryUpdateGraph(element)
{
    //if on a touchscreen/mobile device
    if("ontouchstart" in window)
    {
        if(tappedElement === element)
        {
            tappedElement = null;
            updateGraph(element);
        }
        else
        {
            tappedElement = element;
            setTimeout(() => 
            {
                //if it's still the same one (nothing else has been pressed)
                if(tappedElement === element) tappedElement = null;
            }, 800);

            document.querySelectorAll(".node.hover").forEach(node => node.classList.remove("hover"));
            element.classList.add("hover");
        }
    }
    else updateGraph(element);
}

function updateGraph(element)
{
    const id = element.querySelector("p").textContent;
    history.replaceState(null, "", `?id=${id}`);
    localStorage.setItem("lastVisited", id);

    focus = annotationList.find(node => node.id == id);
    renderGraph();
}

let focus = null;
function setFocus(id)
{
    focus = annotationDict[id];
    history.replaceState(null, "", `?id=${id}`);
}

loadAnnotations(() =>
{
    const query = new URLSearchParams(window.location.search);
    if(query.has("id")) setFocus(query.get("id"));
    else
    {
        const previousPage = localStorage.getItem("lastVisited");
        if(previousPage !== null) setFocus(previousPage);
        else setFocus(annotationList[0].id);
    }
    renderGraph();
});

onresize = () => redrawGraph();
if("ontouchstart" in window)
{
    document.addEventListener("touchstart", (event) =>
    {
        if(!event.target.closest(".node"))
        {
            tappedElement = null;
            document.querySelectorAll(".node.hover").forEach(node => node.classList.remove("hover"));
        }
    });
}