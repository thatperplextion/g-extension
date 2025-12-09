// Content script for Web Data Frame extension

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    const data = extractPageData();
    sendResponse({ data });
  }
  return true;
});

// Extract data from the current page
function extractPageData() {
  const data = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    meta: extractMetaData(),
    headings: extractHeadings(),
    links: extractLinks(),
    images: extractImages(),
    text: extractMainText()
  };

  return data;
}

// Extract meta information
function extractMetaData() {
  const meta = {};
  const metaTags = document.querySelectorAll('meta');
  
  metaTags.forEach(tag => {
    const name = tag.getAttribute('name') || tag.getAttribute('property');
    const content = tag.getAttribute('content');
    
    if (name && content) {
      meta[name] = content;
    }
  });

  return meta;
}

// Extract all headings
function extractHeadings() {
  const headings = [];
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headingElements.forEach(heading => {
    headings.push({
      level: heading.tagName.toLowerCase(),
      text: heading.textContent.trim()
    });
  });

  return headings;
}

// Extract all links
function extractLinks() {
  const links = [];
  const linkElements = document.querySelectorAll('a[href]');
  
  linkElements.forEach(link => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    
    if (href && text) {
      links.push({
        href: href,
        text: text.substring(0, 100)
      });
    }
  });

  // Return unique links (max 50)
  const uniqueLinks = links.filter((link, index, self) =>
    index === self.findIndex(l => l.href === link.href)
  ).slice(0, 50);

  return uniqueLinks;
}

// Extract all images
function extractImages() {
  const images = [];
  const imageElements = document.querySelectorAll('img[src]');
  
  imageElements.forEach(img => {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || '';
    
    if (src) {
      images.push({
        src: src,
        alt: alt
      });
    }
  });

  // Return max 30 images
  return images.slice(0, 30);
}

// Extract main text content
function extractMainText() {
  const body = document.body;
  const clone = body.cloneNode(true);
  
  // Remove script and style elements
  const scripts = clone.querySelectorAll('script, style, noscript');
  scripts.forEach(el => el.remove());
  
  // Get text content
  let text = clone.textContent || '';
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Return first 5000 characters
  return text.substring(0, 5000);
}

// Highlight selected elements (optional feature)
function highlightElement(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.classList.add('wdf-highlight');
  });
}

// Remove highlights
function removeHighlights() {
  const highlighted = document.querySelectorAll('.wdf-highlight');
  highlighted.forEach(el => {
    el.classList.remove('wdf-highlight');
  });
}
