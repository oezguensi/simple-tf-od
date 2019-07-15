import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import './App.css';
import HorizontalCustomStepper from './components/StepperComponent'
import Home from './pages/Home'
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, Divider } from '@material-ui/core';
import red from '@material-ui/core/colors/red';

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";


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
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/steps/:id" component={HorizontalCustomStepper} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;