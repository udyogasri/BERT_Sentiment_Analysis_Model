import { createTheme } from '@mui/material/styles';

export const themeOptionsList = [
  { id: 'nocturne', name: 'Nocturne (Dark)', short: '🌑 Nocturne', isDark: true },
  { id: 'deepSpace', name: 'Deep Space (Dark)', short: '🌌 Space', isDark: true },
  { id: 'sunsetGlow', name: 'Sunset Glow (Dark)', short: '🌅 Sunset', isDark: true },
  { id: 'cyberpunk', name: 'Cyberpunk (Neon)', short: '⚡ Cyber', isDark: true },
  { id: 'lightAurora', name: 'Light Aurora (Light)', short: '❄️ Aurora', isDark: false }
];

export const getThemeByName = (themeId) => {
  switch (themeId) {
    case 'nocturne':
      return createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#8f7bff', contrastText: '#061126' }, // Softer violet primary
          secondary: { main: '#00e5ff', contrastText: '#00121a' }, // Bright cyan accent
          background: {
            default: '#05060a',
            paper: '#0b1220',
          },
          success: { main: '#10b981' },
          error: { main: '#ef4444' },
          text: {
            primary: '#e9f8ff',
            secondary: '#bff2ff',
          }
        },
        typography: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          h1: { fontWeight: 800, letterSpacing: '-0.025em' },
          h6: { fontWeight: 700 }
        },
        custom: {
          gradient: 'linear-gradient(135deg, #00c2e8 0%, #9a7bff 55%, #ff86c8 100%)',
          bgRadial: 'radial-gradient(at 10% 10%, rgba(0,194,232,0.09) 0px, transparent 45%), radial-gradient(at 90% 90%, rgba(154,123,255,0.05) 0px, transparent 45%)',
          borderColor: 'rgba(154,123,255,0.16)',
          shadow: '0 12px 48px rgba(8,6,24,0.85)'
        }
      });

    case 'sunsetGlow':
      return createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#f43f5e' }, // Rose
          secondary: { main: '#fb923c' }, // Orange
          background: {
            default: '#0f051d',
            paper: '#180b2d',
          },
          success: { main: '#10b981' },
          error: { main: '#ef4444' },
          text: {
            primary: '#f8fafc',
            secondary: '#a78bfa',
          }
        },
        typography: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          h1: { fontWeight: 800, letterSpacing: '-0.025em' },
          h6: { fontWeight: 700 }
        },
        custom: {
          gradient: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)',
          bgRadial: 'radial-gradient(at 0% 0%, rgba(244, 63, 94, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.06) 0px, transparent 50%)',
          borderColor: 'rgba(167, 139, 250, 0.15)',
          shadow: '0 8px 32px rgba(244, 63, 94, 0.15)'
        }
      });

    case 'cyberpunk':
      return createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#ff007f' }, // Neon Pink
          secondary: { main: '#00f0ff' }, // Neon Cyan
          background: {
            default: '#030303',
            paper: '#0f0f12',
          },
          success: { main: '#00ff66' },
          error: { main: '#ff3333' },
          text: {
            primary: '#00f0ff',
            secondary: '#ff007f',
          }
        },
        typography: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          h1: { fontWeight: 800, letterSpacing: '0.05em' },
          h6: { fontWeight: 700 }
        },
        custom: {
          gradient: 'linear-gradient(90deg, #ff007f 0%, #00f0ff 100%)',
          bgRadial: 'radial-gradient(at 50% 0%, rgba(0, 240, 255, 0.08) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(255, 0, 127, 0.08) 0px, transparent 50%)',
          borderColor: 'rgba(0, 240, 255, 0.25)',
          shadow: '0 8px 32px rgba(0, 240, 255, 0.2)'
        }
      });

    case 'lightAurora':
      return createTheme({
        palette: {
          mode: 'light',
          primary: { main: '#0284c7' }, // Sky Blue
          secondary: { main: '#8b5cf6' }, // Violet
          background: {
            default: '#f1f5f9',
            paper: '#ffffff',
          },
          success: { main: '#10b981' },
          error: { main: '#ef4444' },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
          }
        },
        typography: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          h1: { fontWeight: 800, letterSpacing: '-0.025em' },
          h6: { fontWeight: 700 }
        },
        custom: {
          gradient: 'linear-gradient(135deg, #0284c7 0%, #8b5cf6 100%)',
          bgRadial: 'radial-gradient(at 0% 0%, rgba(2, 132, 199, 0.06) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.05) 0px, transparent 50%)',
          borderColor: 'rgba(2, 132, 199, 0.1)',
          shadow: '0 8px 32px rgba(2, 132, 199, 0.08)'
        }
      });

    case 'deepSpace':
    default:
      return createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#6366f1' }, // Indigo
          secondary: { main: '#10b981' }, // Emerald
          background: {
            default: '#0b0f19',
            paper: '#131a2e',
          },
          success: { main: '#10b981' },
          error: { main: '#ef4444' },
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
          }
        },
        typography: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          h1: { fontWeight: 800, letterSpacing: '-0.025em' },
          h6: { fontWeight: 700 }
        },
        custom: {
          gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          bgRadial: 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%)',
          borderColor: 'rgba(255, 255, 255, 0.06)',
          shadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }
      });
  }
};
