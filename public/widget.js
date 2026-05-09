(function() {
  // Prevent multiple injections
  if (window.NexAgeAIWidget) return;
  
  // Find the script tag that loaded this script to get the agent ID
  const scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const agentId = scriptTag ? scriptTag.getAttribute('data-agent-id') : null;
  
  if (!agentId) {
    console.error('NexAgeAI Widget: data-agent-id attribute is missing on the script tag.');
    return;
  }

  // Get the base URL from the script tag src or default to origin
  let baseUrl = '';
  if (scriptTag && scriptTag.src) {
    const url = new URL(scriptTag.src);
    baseUrl = url.origin;
  } else {
    baseUrl = 'http://localhost:3000'; // Default for local dev
  }

  // Container
  const container = document.createElement('div');
  container.id = 'nexageai-widget-container';
  container.style.position = 'fixed';
  container.style.bottom = '24px';
  container.style.right = '24px';
  container.style.zIndex = '999999';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'flex-end';
  container.style.pointerEvents = 'none'; // Let clicks pass through when closed
  document.body.appendChild(container);

  // Iframe wrapper (hidden by default)
  const iframeWrapper = document.createElement('div');
  iframeWrapper.id = 'nexageai-iframe-wrapper';
  iframeWrapper.style.width = '380px';
  iframeWrapper.style.height = '600px';
  iframeWrapper.style.maxHeight = 'calc(100vh - 100px)';
  iframeWrapper.style.backgroundColor = '#fff';
  iframeWrapper.style.borderRadius = '16px';
  iframeWrapper.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
  iframeWrapper.style.overflow = 'hidden';
  iframeWrapper.style.marginBottom = '16px';
  iframeWrapper.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  iframeWrapper.style.transform = 'translateY(20px) scale(0.95)';
  iframeWrapper.style.opacity = '0';
  iframeWrapper.style.pointerEvents = 'none';
  iframeWrapper.style.transformOrigin = 'bottom right';
  
  // Responsive sizing for mobile
  if (window.innerWidth <= 480) {
    iframeWrapper.style.width = 'calc(100vw - 32px)';
    iframeWrapper.style.height = 'calc(100vh - 100px)';
    container.style.bottom = '16px';
    container.style.right = '16px';
  }

  // Iframe
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/widget/${agentId}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframeWrapper.appendChild(iframe);
  container.appendChild(iframeWrapper);

  // Toggle button
  const button = document.createElement('button');
  button.id = 'nexageai-widget-btn';
  button.style.width = '60px';
  button.style.height = '60px';
  button.style.borderRadius = '50%';
  button.style.backgroundColor = '#8B5CF6'; // Default color, can be updated via API
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
  button.style.cursor = 'pointer';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.pointerEvents = 'auto';
  button.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
  
  // Simple chat SVG icon
  button.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>`;
  
  button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.05)';
  });
  button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1)';
  });
  container.appendChild(button);

  // State
  let isOpen = false;

  const toggleWidget = () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframeWrapper.style.opacity = '1';
      iframeWrapper.style.transform = 'translateY(0) scale(1)';
      iframeWrapper.style.pointerEvents = 'auto';
      // Change icon to X
      button.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      iframeWrapper.style.opacity = '0';
      iframeWrapper.style.transform = 'translateY(20px) scale(0.95)';
      iframeWrapper.style.pointerEvents = 'none';
      // Change back to chat icon
      button.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>`;
    }
    
    // Notify iframe of state change
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'AGENTOS_TOGGLE', isOpen }, '*');
    }
  };

  button.addEventListener('click', toggleWidget);

  // Listen for messages from iframe (e.g., closing via iframe button)
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'AGENTOS_CLOSE' && isOpen) {
      toggleWidget();
    }
    // Could also receive agent color config to update the bubble color
  });

  // Expose API
  window.NexAgeAIWidget = {
    toggle: toggleWidget,
    open: () => { if (!isOpen) toggleWidget(); },
    close: () => { if (isOpen) toggleWidget(); }
  };
})();
