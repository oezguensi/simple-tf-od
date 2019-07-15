import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import UploadAnnotations from './UploadAnnotationsComponent'
import ChipsArray from './LabelMapComponent'
import ControlledExpansionPanels from './ExpansionComponent'
import CreateTFRecord from './CreateTFRecordComponent'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))


export default function HorizontalNonLinearAlternativeLabelStepper() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState(new Set())
  const [skipped, setSkipped] = React.useState(new Set())
  const [labelMapCategories, setLabelMapCategories] = React.useState([])

  const steps = [{
    description: 'Create TensorFlow records',
    // content: <UploadAnnotations />,
    content: <ChipsArray onChange={setLabelMapCategories}/>,
    action: <CreateTFRecord labelMapCategories={labelMapCategories} disabled={labelMapCategories.length === 0} onComplete={handleComplete} />
  }, {
    description: 'Create train configuration file',
    content: <ControlledExpansionPanels />,
    action: <Button onClick={handleComplete} className={classes.button}>Complete</Button>
  }, {
    description: 'Start training',
    content: null,
    action: <Button disabled={!allStepsCompleted()} className={classes.button}>Start Training</Button>
  }]

  function totalSteps() {
    return 3
  }

  function skippedSteps() {
    return skipped.size
  }

  function allStepsCompleted() {
    return completed.has(0) && completed.has(1)
  }

  function isLastStep() {
    return activeStep === totalSteps() - 1
  }

  function handleNext() {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ?
        steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1

    setActiveStep(newActiveStep)
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleStep = step => () => {
    setActiveStep(step)
  }

  function handleComplete() {
    const newCompleted = new Set(completed)
    newCompleted.add(activeStep)
    setCompleted(newCompleted)

    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext()
    }
  }

  function handleReset() {
    setActiveStep(0)
    setCompleted(new Set())
    setSkipped(new Set())
  }

  function isStepComplete(step) {
    return completed.has(step)
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
          {steps.map((data, index) => {
            const stepProps = {}
            const buttonProps = {}

            return (
              <Step key={data.description} {...stepProps}>
                <StepButton
                  onClick={handleStep(index)}
                  completed={isStepComplete(index)}
                  {...buttonProps}
                >
                  {data.description}
                </StepButton>
              </Step>
            )
          })}
        </Stepper>
      </Grid>

      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
      >
          {steps[activeStep].content}

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
            {steps[activeStep].action}
          </div>
        </Grid>

    </Grid>
  )
}
