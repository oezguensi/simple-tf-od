import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import './App.css';
import HorizontalCustomStepper from './components/StepperComponent'
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, Divider } from '@material-ui/core';
import red from '@material-ui/core/colors/red';

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  palette: {
    type: 'dark',
    background: {
      default: "#252525"
    },
    primary: red,
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HorizontalCustomStepper></HorizontalCustomStepper>
      </ThemeProvider>
    </div>
  );
}

export default App;