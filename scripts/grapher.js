const tagAlgorithms = [standardImportance, characterImportance, thematicImportance, linguisticImportance];
let selectedAlgorithm = 0;

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
                inCommon += tagAlgorithms[selectedAlgorithm][tag];
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
            resetTimer = setTimeout(() =>
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