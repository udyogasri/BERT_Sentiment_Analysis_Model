import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  Paper,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  CheckCircle,
  Error,
  SentimentSatisfiedAlt,
  Refresh,
  InfoOutlined,
  Translate,
  SettingsInputComponent,
  Speed
} from '@mui/icons-material';
import { getThemeByName, themeOptionsList } from './theme';
import { InteractiveCanvas } from './InteractiveCanvas';


const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [themeName, setThemeName] = useState('nocturne');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState({ online: false, modelTrained: false, checking: true });

  const activeTheme = getThemeByName(themeName);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setApiStatus(prev => ({ ...prev, checking: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (response.ok) {
        const data = await response.json();
        setApiStatus({
          online: true,
          modelTrained: data.model_trained,
          checking: false
        });
        if (!data.model_trained) {
          setError('Model weights not found. Please run training first (python src/train.py).');
        } else {
          setError(null);
        }
      } else {
        throw new Error('API server returned error code');
      }
    } catch (err) {
      setApiStatus({
        online: false,
        modelTrained: false,
        checking: false
      });
      setError('Cannot connect to the backend server. Make sure it is running at http://localhost:8000 (uvicorn main:app --reload).');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to predict sentiment');
      }

      setResult({
        sentiment: data.sentiment,
        confidence: data.confidence,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Custom styling references from the active theme
  const custom = activeTheme.custom || {};

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <InteractiveCanvas themeId={themeName} />
      <Box
        sx={{
          backgroundColor: 'transparent',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Professional Top Navigation Bar */}
        <Box
          sx={{
            width: '100%',
            borderBottom: `1px solid ${custom.borderColor || 'rgba(255, 255, 255, 0.08)'}`,
            backdropFilter: 'blur(16px)',
            backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            py: 2.2,
            px: { xs: 2, sm: 4 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            transition: 'all 0.3s ease'
          }}
        >
          {/* Left Brand Area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SentimentSatisfiedAlt color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.01em', fontSize: '1.2rem' }}>
              BERT Analyzer
            </Typography>
          </Box>

          {/* Right iOS-style Segmented Theme Control */}
          <ToggleButtonGroup
            value={themeName}
            exclusive
            onChange={(e, val) => val && setThemeName(val)}
            size="small"
            sx={{
              backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              borderRadius: '10px',
              padding: '2px',
              border: `1px solid ${activeTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
              '& .MuiToggleButtonGroup-grouped': {
                border: 'none',
                mx: 0.25,
                '&:not(:first-of-type)': {
                  borderRadius: '8px',
                },
                '&:first-of-type': {
                  borderRadius: '8px',
                },
              }
            }}
          >
            {themeOptionsList.map(opt => (
              <ToggleButton
                key={opt.id}
                value={opt.id}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.76rem',
                  px: 1.6,
                  py: 0.3,
                  color: activeTheme.palette.text.secondary,
                  borderRadius: '8px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#ffffff',
                    color: activeTheme.palette.mode === 'dark' ? '#ffffff' : '#0f172a',
                    boxShadow: activeTheme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#ffffff',
                    }
                  },
                  '&:hover': {
                    backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              >
                {opt.short}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Header Row: Centered Logo & Title */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              mb: 4
            }}
          >
            {/* Center Heading Content */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  background: custom.gradient,
                  boxShadow: custom.shadow,
                  color: '#fff'
                }}
              >
                <SentimentSatisfiedAlt sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                sx={{
                  fontWeight: 900,
                  background: custom.gradient || 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                BERT Sentiment Analyzer
              </Typography>
            </Box>

            {/* Subtitle (centered) */}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              sx={{ maxWidth: 650, lineHeight: 1.6, mt: 1 }}
            >
              Type or paste any text below. A fine-tuned BERT transformer neural network will analyze the wording and predict positive or negative sentiment.
            </Typography>
          </Box>

          {/* Main Analyzer Card */}
          <Card
            sx={{
              borderRadius: 5,
              backdropFilter: 'blur(16px)',
              backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(19, 26, 46, 0.65)' : 'rgba(255, 255, 255, 0.75)',
              border: `1px solid ${custom.borderColor || 'rgba(255, 255, 255, 0.08)'}`,
              boxShadow: custom.shadow || '0 8px 32px rgba(0, 0, 0, 0.1)',
              p: { xs: 2, sm: 4 },
              mb: 4
            }}
          >
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              {/* API and Model Warnings */}
              {error && (
                <Alert
                  severity={!apiStatus.online ? 'error' : 'warning'}
                  action={
                    !apiStatus.online && (
                      <IconButton color="inherit" size="small" onClick={checkApiStatus} disabled={apiStatus.checking}>
                        {apiStatus.checking ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                      </IconButton>
                    )
                  }
                  sx={{ borderRadius: 3, mb: 3 }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleAnalyze} sx={{ width: '100%' }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1, display: 'block' }}
                >
                  Enter Text
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Type anything here (e.g. 'I had an absolutely wonderful time! The service was fast and everyone was incredibly friendly.')"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={!apiStatus.online || !apiStatus.modelTrained}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                      borderRadius: 3,
                      '& fieldset': { borderColor: custom.borderColor },
                      '&:hover fieldset': { borderColor: activeTheme.palette.primary.main },
                      '&.Mui-focused fieldset': { borderColor: activeTheme.palette.primary.main }
                    }
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {text.length} characters
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !text.trim() || !apiStatus.online || !apiStatus.modelTrained}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.2,
                      fontWeight: 700,
                      background: custom.gradient,
                      boxShadow: custom.shadow,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        opacity: 0.9
                      }
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1.5 }} />
                        Analyzing...
                      </Box>
                    ) : (
                      'Analyze Sentiment'
                    )}
                  </Button>
                </Box>
              </Box>

              {/* Sentiment Inference Result */}
              {result && (
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: result.sentiment === 'Positive'
                      ? (activeTheme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)')
                      : (activeTheme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)'),
                    border: `1px solid ${result.sentiment === 'Positive' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                    animation: 'fadeIn 0.3s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {result.sentiment === 'Positive' ? (
                        <>
                          <CheckCircle color="success" />
                          <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                            Positive Sentiment
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Error color="error" />
                          <Typography variant="h6" color="error.main" sx={{ fontWeight: 700 }}>
                            Negative Sentiment
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Confidence:{' '}
                      <Typography component="span" variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {(result.confidence * 100).toFixed(2)}%
                      </Typography>
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={result.confidence * 100}
                    color={result.sentiment === 'Positive' ? 'success' : 'error'}
                    sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Architecture/Pipeline Overview */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 5,
              backdropFilter: 'blur(16px)',
              backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(19, 26, 46, 0.4)' : 'rgba(255, 255, 255, 0.55)',
              border: `1px solid ${custom.borderColor || 'rgba(255, 255, 255, 0.08)'}`,
              boxShadow: 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <InfoOutlined color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                BERT Architecture & Sentiment Pipeline
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.3)' : 'rgba(255, 255, 255, 0.4)',
                    border: `1px solid ${custom.borderColor || 'rgba(255, 255, 255, 0.05)'}`,
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Translate color="primary" fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                      1. Tokenization
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Your input string is converted into WordPiece tokens. These tokens are converted into numerical IDs and attention masks with a sequence limit of 128.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.3)' : 'rgba(255, 255, 255, 0.4)',
                    border: `1px solid ${custom.borderColor || 'rgba(255, 255, 255, 0.05)'}`,
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <SettingsInputComponent color="primary" fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                      2. BERT Core
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                    The tokens pass through the 12 transformer encoder blocks of `bert-base-uncased`. The network uses self-attention to extract contextual representations.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: activeTheme.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.3)' : 'rgba(255, 255, 255, 0.4)',
                    border: `1px solid ${custom.borderColor || 'rgba(255, 255, 255, 0.05)'}`,
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Speed color="primary" fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                      3. Classification
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                    The context vector of the special `[CLS]` token is forwarded to a linear classifier, producing raw logits which are converted to probabilities by Softmax.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
