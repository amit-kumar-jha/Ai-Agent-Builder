const fs = require('fs');
const path = require('path');

// Helper to replace text in file
function replaceInFile(filePath, searchStr, replaceStr) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchStr)) {
      content = content.replace(searchStr, replaceStr);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  } catch (err) {
    console.error(`Error updating ${filePath}`, err);
  }
}

// Update page.tsx
const pageFile = path.join(__dirname, 'src/app/page.tsx');
replaceInFile(pageFile, 
  `<div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>`, 
  `<div className="nav-links" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>`
);
replaceInFile(pageFile, 
  `<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>`, 
  `<div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>`
);
replaceInFile(pageFile, 
  `<section style={{ paddingTop: '160px', paddingBottom: '100px', paddingLeft: '48px', paddingRight: '48px', position: 'relative' }}>`, 
  `<section className="hero-section" style={{ paddingTop: '160px', paddingBottom: '100px', paddingLeft: '48px', paddingRight: '48px', position: 'relative' }}>`
);
replaceInFile(pageFile, 
  `<div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '60px' }}>`, 
  `<div className="hero-container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '60px' }}>`
);
replaceInFile(pageFile, 
  `<h1 style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px', color: 'var(--text-primary)' }}>`, 
  `<h1 className="hero-title" style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px', color: 'var(--text-primary)' }}>`
);
replaceInFile(pageFile, 
  `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>`, 
  `<div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>`
);
replaceInFile(pageFile, 
  `<div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>`, 
  `<div className="footer-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>`
);
replaceInFile(pageFile, 
  `<div style={{ display: 'flex', height: '500px' }}>`, 
  `<div className="mock-app-body" style={{ display: 'flex', height: '500px' }}>`
);
replaceInFile(pageFile, 
  `<div style={{ width: '240px', borderRight: '1px solid var(--border-primary)', padding: '24px', background: 'var(--bg-secondary)' }}>`, 
  `<div className="mock-sidebar" style={{ width: '240px', borderRight: '1px solid var(--border-primary)', padding: '24px', background: 'var(--bg-secondary)' }}>`
);
replaceInFile(pageFile, 
  `<div style={{ flex: 1, padding: '40px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '24px' }}>`, 
  `<div className="mock-main" style={{ flex: 1, padding: '40px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '24px' }}>`
);

// Update dashboard layout
const dashboardLayoutFile = path.join(__dirname, 'src/app/dashboard/layout.tsx');
replaceInFile(dashboardLayoutFile,
  `<header style={{ height: '64px', minHeight: '64px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', zIndex: 30 }}>`,
  `<header className="dashboard-header" style={{ height: '64px', minHeight: '64px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', zIndex: 30 }}>`
);

// Add CSS to globals.css
const cssContent = \`

/* Responsive Design Overrides */
@media (max-width: 1024px) {
  .hero-container {
    flex-direction: column !important;
    text-align: center !important;
    gap: 40px !important;
  }
  .hero-title {
    font-size: 48px !important;
  }
  .features-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .footer-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 16px 20px !important;
  }
  .nav-links {
    display: none !important;
  }
  .hero-section {
    padding: 120px 20px 60px 20px !important;
  }
  .hero-title {
    font-size: 36px !important;
  }
  .hero-subtitle {
    margin-left: auto !important;
    margin-right: auto !important;
  }
  .hero-buttons {
    justify-content: center !important;
    flex-direction: column !important;
  }
  .hero-buttons button {
    width: 100% !important;
    justify-content: center !important;
  }
  .features-grid {
    grid-template-columns: 1fr !important;
  }
  .footer-grid {
    grid-template-columns: 1fr !important;
    text-align: center !important;
  }
  .footer-grid > div {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }
  .mock-app-body {
    flex-direction: column !important;
    height: auto !important;
  }
  .mock-sidebar {
    width: 100% !important;
    border-right: none !important;
    border-bottom: 1px solid var(--border-primary) !important;
  }
  .mock-main {
    padding: 24px !important;
  }
  
  /* Dashboard Responsive */
  .app-layout {
    flex-direction: column !important;
  }
  .sidebar {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    top: auto !important;
    height: 60px !important;
    width: 100% !important;
    flex-direction: row !important;
    z-index: 100 !important;
    border-right: none !important;
    border-top: 1px solid var(--border-primary) !important;
    background: var(--bg-card) !important;
    backdrop-filter: blur(10px) !important;
    padding: 0 !important;
  }
  .sidebar > div:first-child, .sidebar > div:last-child {
    display: none !important; /* Hide workspace switcher and user profile on mobile bottom nav */
  }
  .sidebar nav {
    flex-direction: row !important;
    padding: 0 10px !important;
    overflow-x: auto !important;
    align-items: center !important;
    gap: 8px !important;
  }
  .sidebar nav a div {
    flex-direction: column !important;
    gap: 4px !important;
    padding: 8px !important;
  }
  .sidebar nav a div span {
    font-size: 10px !important;
  }
  .main-content {
    padding-bottom: 60px !important; /* Make room for bottom nav */
  }
  .dashboard-header {
    flex-wrap: wrap !important;
    height: auto !important;
    padding: 12px 16px !important;
    gap: 12px !important;
  }
  .dashboard-header > div:last-child {
    width: 100% !important;
    justify-content: space-between !important;
  }
  .page-content {
    padding: 16px !important;
  }
  
  /* Agent Builder Mobile */
  .builder-layout {
    flex-direction: column !important;
  }
  .builder-sidebar {
    width: 100% !important;
    height: auto !important;
    border-right: none !important;
    border-bottom: 1px solid var(--border-primary) !important;
  }
  .builder-main {
    height: auto !important;
    min-height: 500px !important;
  }
  
  /* Integrations Grid */
  .integrations-grid {
    grid-template-columns: 1fr !important;
  }
  .integrations-modal {
    width: 100% !important;
  }
}
\`;

const globalsCssFile = path.join(__dirname, 'src/app/globals.css');
try {
  fs.appendFileSync(globalsCssFile, cssContent);
  console.log('Appended responsive CSS to globals.css');
} catch (err) {
  console.error('Error updating globals.css', err);
}

// Update builder layout
const builderFile = path.join(__dirname, 'src/app/dashboard/agents/[agentId]/builder/page.tsx');
replaceInFile(builderFile,
  \`<div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>\`,
  \`<div className="builder-layout" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>\`
);
replaceInFile(builderFile,
  \`<div style={{ width: '400px', borderRight: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', overflowY: 'auto' }}>\`,
  \`<div className="builder-sidebar" style={{ width: '400px', borderRight: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', overflowY: 'auto' }}>\`
);
replaceInFile(builderFile,
  \`<div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>\`,
  \`<div className="builder-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>\`
);

// Update integrations
const integrationsFile = path.join(__dirname, 'src/app/dashboard/integrations/page.tsx');
replaceInFile(integrationsFile,
  \`<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>\`,
  \`<div className="integrations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>\`
);
replaceInFile(integrationsFile,
  \`<div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '600px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s ease' }}>\`,
  \`<div className="integrations-modal" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '600px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s ease' }}>\`
);

