// Background service worker for Web Data Frame extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Web Data Frame extension installed');
    
    // Set default settings
    chrome.storage.local.set({
      settings: {
        autoExtract: false,
        maxLinks: 50,
        maxImages: 30,
        maxTextLength: 5000
      }
    });
  } else if (details.reason === 'update') {
    console.log('Web Data Frame extension updated');
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getSettings':
      chrome.storage.local.get('settings', (result) => {
        sendResponse({ settings: result.settings });
      });
      return true;

    case 'saveSettings':
      chrome.storage.local.set({ settings: request.settings }, () => {
        sendResponse({ success: true });
      });
      return true;

    case 'saveData':
      saveExtractedData(request.data);
      sendResponse({ success: true });
      return true;

    case 'getHistory':
      chrome.storage.local.get('history', (result) => {
        sendResponse({ history: result.history || [] });
      });
      return true;

    default:
      sendResponse({ error: 'Unknown action' });
      return false;
  }
});

// Save extracted data to history
function saveExtractedData(data) {
  chrome.storage.local.get('history', (result) => {
    const history = result.history || [];
    
    history.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      url: data.url,
      title: data.title,
      data: data
    });

    // Keep only last 100 entries
    if (history.length > 100) {
      history.pop();
    }

    chrome.storage.local.set({ history });
  });
}

// Handle keyboard shortcuts (if defined in manifest)
chrome.commands?.onCommand?.addListener((command) => {
  if (command === 'extract-data') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extractData' });
      }
    });
  }
});

// Context menu for right-click extraction
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus?.create({
    id: 'extractSelection',
    title: 'Extract with Web Data Frame',
    contexts: ['selection', 'page']
  });
});

chrome.contextMenus?.onClicked?.addListener((info, tab) => {
  if (info.menuItemId === 'extractSelection') {
    chrome.tabs.sendMessage(tab.id, { 
      action: 'extractData',
      selection: info.selectionText 
    });
  }
});
