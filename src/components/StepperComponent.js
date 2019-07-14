import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import CreateTFRecord from './CreateTFRecordComponent'
import ControlledExpansionPanels from './ExpansionComponent'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Create TensorFlow records', 'Create Label Map', 'Create train configuration file', 'Start training'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return {
        component: <CreateTFRecord />,
        completeText: 'Create file'
      };
    case 1:
      return {
        component: <div></div>,
        completeText: 'Create file'
      };
    case 2:
      return {
        component: <ControlledExpansionPanels />,
        completeText: 'Create file'
      };
    case 3:
      return {
        component: <div></div>,
        completeText: 'Help'
      };
    default:
      return {
        component: <div></div>,
        completeText: 'Unknown'
      };
  }
}

export default function HorizontalCustomStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  function totalSteps() {
    return getSteps().length;
  }

  function skippedSteps() {
    return skipped.size;
  }

  function completedSteps() {
    return completed.size;
  }

  function allStepsCompleted() {
    return completedSteps() === totalSteps() - skippedSteps();
  }

  function isLastStep() {
    return activeStep === totalSteps() - 1;
  }

  function handleNext() {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed
        // find the first step that has been completed
        steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  const handleStep = step => () => {
    setActiveStep(step);
  };

  function handleComplete() {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);

    /**
     * Sigh... it would be much nicer to replace the following if conditional with
     * `if (!this.allStepsComplete())` however state is not set when we do this,
     * thus we have to resort to not being very DRY.
     */
    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext();
    }
  }

  function handleReset() {
    setActiveStep(0);
    setCompleted(new Set());
    setSkipped(new Set());
  }

  function isStepSkipped(step) {
    return skipped.has(step);
  }

  function isStepComplete(step) {
    return completed.has(step);
  }

  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
    >
      <Grid item>
        <Stepper alternativeLabel nonLinear activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const buttonProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepButton
                  onClick={handleStep(index)}
                  completed={isStepComplete(index)}
                  {...buttonProps}
                >
                  {label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </Grid>



      {allStepsCompleted() ? (
        <div>
          <Typography className={classes.instructions}>
            All steps completed - you&apos;re finished
            </Typography>
          <Button onClick={handleReset}>Reset</Button>
        </div>
      ) : (
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
          >
            <div>{getStepContent(activeStep).component}</div>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
                  </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
                  </Button>
              {activeStep !== steps.length &&
                <Button variant="contained" color="primary" onClick={handleComplete}>
                  {completedSteps() === totalSteps() - 1 ? 'Finish' : getStepContent(activeStep).completeText}
                </Button>
              }
            </div>
          </Grid>
        )}


    </Grid>
  );
}