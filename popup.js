// Popup script for Web Data Frame extension

document.addEventListener('DOMContentLoaded', () => {
  const extractBtn = document.getElementById('extractBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const dataOutput = document.getElementById('dataOutput');

  let extractedData = null;

  // Extract data from the current page
  extractBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });
      
      if (response && response.data) {
        extractedData = response.data;
        displayData(extractedData);
        enableButtons();
      } else {
        showError('No data extracted');
      }
    } catch (error) {
      showError('Failed to extract data: ' + error.message);
    }
  });

  // Clear the extracted data
  clearBtn.addEventListener('click', () => {
    extractedData = null;
    dataOutput.innerHTML = '<p class="placeholder">Click "Extract Data" to begin</p>';
    disableButtons();
  });

  // Copy data to clipboard
  copyBtn.addEventListener('click', async () => {
    if (extractedData) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
        showSuccess('Copied to clipboard!');
      } catch (error) {
        showError('Failed to copy: ' + error.message);
      }
    }
  });

  // Download data as JSON file
  downloadBtn.addEventListener('click', () => {
    if (extractedData) {
      const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `web-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSuccess('Download started!');
    }
  });

  function displayData(data) {
    dataOutput.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }

  function showError(message) {
    dataOutput.innerHTML = `<p class="error">${message}</p>`;
  }

  function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  function enableButtons() {
    copyBtn.disabled = false;
    downloadBtn.disabled = false;
  }

  function disableButtons() {
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
  }
});
