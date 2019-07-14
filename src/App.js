import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import './App.css';
import HorizontalCustomStepper from './components/StepperComponent'

import { createMuiTheme, Divider } from '@material-ui/core';

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <HorizontalCustomStepper></HorizontalCustomStepper>
      </ThemeProvider>
    </div>
  );
}

export default App;