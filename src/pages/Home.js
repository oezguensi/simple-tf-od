import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Medium, GithubCircle, LinkedinBox } from 'mdi-material-ui'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { StepContent, StepButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    icon: {
        fontSize: 30
    },
    link: {
        textDecoration: "none"
    }
}));

export default function Home(props) {
    const classes = useStyles();

  function nextPath(path) {
    props.history.push(path);
  }

  const handleStep = step => () => {
    nextPath(`/steps/${step}`)
  }

  const handleClick = step => () => {
    nextPath(`/steps/${step}`)
  }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={4} className={classes.image} />
            <Grid item xs={12} sm={8} md={8} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h4">
                        Welcome
                    </Typography>
                    <Typography component="p" variant="body1">
                        The world of Deep Learning is amazing and yet complicated.
                        Understanding its subtleties can be satisfying on its own.
                        But for many the result are important.
                        And even though I disencourage diving into the matter without proper knowledge I would like to encourage the use of Deep Learning in the industry.
                        Thanks to the amazing community and great minds there are solutions for many problems publicly available.
                        So is the TensorFlow Object Detection API, that facilitates training a model to detect objects in images. This app makes it even simpler to dive into the algorithm.
                    </Typography>
                    <Stepper orientation="vertical" activeStep={2}>
                        <Step completed={false} active={true}>
                            <StepButton
                                onClick={handleStep(1)}
                            >
                                test
                            </StepButton>
                            
                            <StepContent>Test</StepContent>
                        </Step>
                        <Step completed={false} active={true}>
                            <StepButton
                                onClick={handleStep(2)}
                            >
                                sadfsadfsd
                            </StepButton>
                            
                            <StepContent>Test</StepContent>
                        </Step>
                        <Step completed={false} active={true}>
                            <StepButton
                                onClick={handleStep(3)}
                            >
                                test
                            </StepButton>
                            
                            <StepContent>Test</StepContent>
                        </Step>
                    </Stepper>

                    <Button onClick={handleClick(1)}>Start</Button>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Box mt={5}>
                            <Typography variant="body1" color="textSecondary" align="center">
                                {'Built with love by Sinan Özgün'}
                            </Typography>
                        </Box>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={3}
                        >
                            <Grid item>
                                <MuiLink color="inherit" href="https://github.com/oezguensi">
                                    <GithubCircle className={classes.icon} />
                                </MuiLink>
                            </Grid>
                            <Grid item>
                                <MuiLink color="inherit" href="https://medium.com/@sinan.oezguen">
                                    <Medium className={classes.icon} />
                                </MuiLink>
                            </Grid>
                            <Grid item>
                                <MuiLink color="inherit" href="https://www.linkedin.com/in/sinan-özgün-16b24b137/">
                                    <LinkedinBox className={classes.icon} />
                                </MuiLink>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}