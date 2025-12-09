# Web Data Frame

A browser extension for extracting and framing data from web pages.

## Features

- **Data Extraction**: Extract structured data from any web page including:
  - Page title and URL
  - Meta information
  - Headings (H1-H6)
  - Links
  - Images
  - Main text content

- **Export Options**:
  - Copy to clipboard as JSON
  - Download as JSON file

- **Easy to Use**: Simple one-click extraction from the popup interface

## Installation

### Chrome / Edge / Brave

1. Download or clone this repository
2. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the folder containing this extension

### Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from this extension

## Usage

1. Navigate to any web page you want to extract data from
2. Click the Web Data Frame extension icon in your browser toolbar
3. Click the "Extract Data" button
4. View the extracted data in the popup
5. Use "Copy to Clipboard" or "Download JSON" to export the data

## File Structure

```
web-data-frame/
├── manifest.json      # Extension configuration
├── popup.html         # Popup UI
├── popup.js           # Popup functionality
├── content.js         # Content script for data extraction
├── background.js      # Background service worker
├── style.css          # Styles for popup and content
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # This file
```

## Permissions

This extension requires the following permissions:

- **activeTab**: To access and extract data from the current tab
- **storage**: To save settings and extraction history

## Development

### Prerequisites

- A Chromium-based browser (Chrome, Edge, Brave) or Firefox
- Basic knowledge of HTML, CSS, and JavaScript

### Making Changes

1. Edit the source files as needed
2. Reload the extension in your browser's extension page
3. Test your changes

### Adding Icons

Replace the placeholder icon paths in `manifest.json` with actual icon files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

## License

MIT License - Feel free to use and modify this extension.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Version History

- **1.0.0** - Initial release
  - Basic data extraction
  - JSON export
  - Clipboard support
#

