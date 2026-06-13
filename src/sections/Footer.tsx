import { footerConfig } from '../config';

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="footer"
      style={{
        backgroundColor: '#050508',
        position: 'relative',
        zIndex: 2,
        padding: '80px 24px 40px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Top Area */}
        <div>
          <p
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: '24px',
              fontWeight: 500,
              color: '#e0e0e8',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            {footerConfig.brandName}
          </p>
          {footerConfig.brandTaglineLines.map((line) => (
            <p
              key={line}
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#8b8b9a',
                marginTop: '4px',
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Navigation Columns */}
        <div
          style={{
            display: 'flex',
            gap: '80px',
            marginTop: '48px',
            flexWrap: 'wrap',
          }}
        >
          {footerConfig.columns.map((column) => (
            <div key={column.heading}>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#00d4ff',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                {column.heading}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {column.links.map((link) => (
                  <li key={link.label} style={{ marginBottom: '6px' }}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '13px',
                        fontWeight: 400,
                        color: '#8b8b9a',
                        textDecoration: 'none',
                        lineHeight: 2.2,
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLAnchorElement).style.color = '#e0e0e8';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLAnchorElement).style.color = '#8b8b9a';
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            marginTop: '60px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(0, 212, 255, 0.06)',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              color: '#4a4a5a',
            }}
          >
            {footerConfig.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
