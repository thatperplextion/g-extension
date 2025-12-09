document.getElementById("selectData").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "activateSelection" });
    });
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "dataExtracted") {
        const resultDiv = document.getElementById("result");
        resultDiv.innerText = JSON.stringify(msg.data, null, 2);

        document.getElementById("downloadCSV").style.display = "block";
        document.getElementById("downloadJSON").style.display = "block";
        document.getElementById("copyCode").style.display = "block";

        window.data = msg.data;
    }
});

document.getElementById("downloadCSV").onclick = () => {
    const csv = window.data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: "data.csv"
    });
};

document.getElementById("downloadJSON").onclick = () => {
    const blob = new Blob([JSON.stringify(window.data, null, 2)], { type: "application/json" });
    chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: "data.json"
    });
};

document.getElementById("copyCode").onclick = () => {
    const code = `import pandas as pd\ndata = ${JSON.stringify(window.data)}\ndf = pd.DataFrame(data)\ndf`;
    navigator.clipboard.writeText(code);
    alert("DataFrame code copied!");
};
