let selecting = false;

document.addEventListener("mouseover", (e) => {
    if (selecting) e.target.classList.add("highlight");
});

document.addEventListener("mouseout", (e) => {
    if (selecting) e.target.classList.remove("highlight");
});

document.addEventListener("click", (e) => {
    if (!selecting) return;

    e.preventDefault();
    e.stopPropagation();

    let element = e.target;
    let data = [];

    if (element.tagName === "TABLE") {
        let rows = element.querySelectorAll("tr");
        rows.forEach((row) => {
            let cells = Array.from(row.querySelectorAll("th, td")).map(c => c.innerText.trim());
            data.push(cells);
        });
    } else {
        data.push([element.innerText.trim()]);
    }

    chrome.runtime.sendMessage({ action: "dataExtracted", data });
    selecting = false;
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "activateSelection") {
        selecting = true;
        alert("Click any table or text to extract data.");
    }
});
