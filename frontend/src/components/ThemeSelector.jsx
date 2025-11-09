import React from 'react';
import './ThemeSelector.css';

const themes = [
  {
    id: 'vs-dark',
    name: 'Dark (Default)',
    description: 'Classic dark theme',
    preview: {
      bg: '#1e1e1e',
      editor: '#1e1e1e',
      accent: '#007acc',
      text: '#d4d4d4'
    }
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme',
    preview: {
      bg: '#ffffff',
      editor: '#ffffff',
      accent: '#0066cc',
      text: '#000000'
    }
  },
  {
    id: 'hc-black',
    name: 'High Contrast',
    description: 'High contrast dark',
    preview: {
      bg: '#000000',
      editor: '#000000',
      accent: '#ffff00',
      text: '#ffffff'
    }
  },
  {
    id: 'vs',
    name: 'Visual Studio',
    description: 'Classic VS light',
    preview: {
      bg: '#f3f3f3',
      editor: '#ffffff',
      accent: '#0066cc',
      text: '#000000'
    }
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: 'Popular dark theme',
    preview: {
      bg: '#272822',
      editor: '#272822',
      accent: '#a6e22e',
      text: '#f8f8f2'
    },
    custom: true
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Gothic dark theme',
    preview: {
      bg: '#282a36',
      editor: '#282a36',
      accent: '#bd93f9',
      text: '#f8f8f2'
    },
    custom: true
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic inspired',
    preview: {
      bg: '#2e3440',
      editor: '#2e3440',
      accent: '#88c0d0',
      text: '#d8dee9'
    },
    custom: true
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Precision colors',
    preview: {
      bg: '#002b36',
      editor: '#002b36',
      accent: '#268bd2',
      text: '#839496'
    },
    custom: true
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    description: 'GitHub style',
    preview: {
      bg: '#0d1117',
      editor: '#0d1117',
      accent: '#58a6ff',
      text: '#c9d1d9'
    },
    custom: true
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    description: 'Night in Tokyo',
    preview: {
      bg: '#1a1b26',
      editor: '#1a1b26',
      accent: '#7aa2f7',
      text: '#a9b1d6'
    },
    custom: true
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox Dark',
    description: 'Retro groove',
    preview: {
      bg: '#282828',
      editor: '#282828',
      accent: '#fe8019',
      text: '#ebdbb2'
    },
    custom: true
  },
  {
    id: 'one-dark',
    name: 'One Dark Pro',
    description: 'Atom inspired',
    preview: {
      bg: '#282c34',
      editor: '#282c34',
      accent: '#61afef',
      text: '#abb2bf'
    },
    custom: true
  }
];

const ThemeSelector = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
  if (!isOpen) return null;

  const handleThemeSelect = (themeId) => {
    onThemeChange(themeId);
    
    // For custom themes, we need to define them in Monaco
    const customThemes = {
      'monokai': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '75715E' },
          { token: 'keyword', foreground: 'F92672' },
          { token: 'string', foreground: 'E6DB74' },
          { token: 'number', foreground: 'AE81FF' },
        ],
        colors: {
          'editor.background': '#272822',
          'editor.foreground': '#F8F8F2'
        }
      },
      'dracula': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6272A4' },
          { token: 'keyword', foreground: 'FF79C6' },
          { token: 'string', foreground: 'F1FA8C' },
        ],
        colors: {
          'editor.background': '#282a36',
          'editor.foreground': '#f8f8f2'
        }
      },
      'nord': {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#2e3440',
          'editor.foreground': '#d8dee9'
        }
      },
      'solarized-dark': {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#002b36',
          'editor.foreground': '#839496'
        }
      },
      'github-dark': {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#0d1117',
          'editor.foreground': '#c9d1d9'
        }
      },
      'tokyo-night': {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1a1b26',
          'editor.foreground': '#a9b1d6'
        }
      },
      'gruvbox': {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#282828',
          'editor.foreground': '#ebdbb2'
        }
      },
      'one-dark': {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#282c34',
          'editor.foreground': '#abb2bf'
        }
      }
    };
    
    // Store custom theme definition for Monaco to use
    if (customThemes[themeId]) {
      localStorage.setItem(`customTheme_${themeId}`, JSON.stringify(customThemes[themeId]));
    }
  };

  return (
    <div className="theme-selector-overlay" onClick={onClose}>
      <div className="theme-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="theme-selector-header">
          <div>
            <h2>Choose Your Theme</h2>
            <p className="theme-subtitle">Personalize your editor experience</p>
          </div>
          <button className="theme-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="theme-selector-content">
          <div className="theme-grid">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`theme-card ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <div className="theme-preview" style={{ background: theme.preview.bg }}>
                  <div className="theme-preview-editor" style={{ background: theme.preview.editor }}>
                    <div className="theme-preview-line" style={{ background: theme.preview.accent }}></div>
                    <div className="theme-preview-line short" style={{ background: theme.preview.text, opacity: 0.6 }}></div>
                    <div className="theme-preview-line medium" style={{ background: theme.preview.accent, opacity: 0.8 }}></div>
                  </div>
                </div>
                
                <div className="theme-info">
                  <h3 className="theme-name">{theme.name}</h3>
                  <p className="theme-description">{theme.description}</p>
                </div>

                {currentTheme === theme.id && (
                  <div className="theme-checkmark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}

                <div className="theme-colors">
                  <span className="color-dot" style={{ background: theme.preview.bg }} title="Background"></span>
                  <span className="color-dot" style={{ background: theme.preview.accent }} title="Accent"></span>
                  <span className="color-dot" style={{ background: theme.preview.text }} title="Text"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="theme-selector-footer">
          <p className="theme-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Theme preference is saved locally and won't affect other users
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;