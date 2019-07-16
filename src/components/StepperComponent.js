import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';

import UploadAnnotations from './UploadAnnotationsComponent'
import LabelMapChips from './LabelMapComponent'
import ControlledExpansionPanels from './ExpansionPanel/ExpansionComponent'
import CreateTFRecord from './CreateTFRecordComponent'
import CodeSnippetCard from './CardComponent'
import StageOneView from '../views/StageOneView'
import StageTwoView from '../views/StageTwoView'

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
  link: {
    textDecoration: "none"
  }
}))

export default function HorizontalNonLinearAlternativeLabelStepper(props) {
  const classes = useStyles()
  const [completed, setCompleted] = React.useState(new Set())
  const [skipped, setSkipped] = React.useState(new Set())
  const [labelMapCategories, setLabelMapCategories] = React.useState([])
  
  const [modelArchitecture, setModelArchitecture] = React.useState("ssd_mobilenet_v1_coco")
  const [numCategories, setNumCategories] = React.useState(labelMapCategories.length)
  const [outWidth, setOutWidth] = React.useState(300)
  const [outHeight, setOutHeight] = React.useState(300)
  const [batchSize, setBatchSize] = React.useState(24)
  const [optimizer, setOptimizer] = React.useState("rms_prop_optimizer")
  const [pretrained, setPretrained] = React.useState(false)

  const steps = [{
    stepperTitle: 'Create TensorFlow records',
    // content: <UploadAnnotations />,
    header: "h3. Heading",
    description: "h4. Heading",
    content: <StageOneView labelMapCategories={labelMapCategories} onChange={setLabelMapCategories}/>,
    action: <CreateTFRecord labelMapCategories={labelMapCategories} disabled={labelMapCategories.length === 0} onComplete={handleComplete} />
  }, {
    stepperTitle: 'Create train configuration file',
    header: "h3. Heading",
    description: "h4. Heading",
    content: <StageTwoView numCategories={labelMapCategories.length}/>,
    action: <Button onClick={handleComplete} className={classes.button}>Complete</Button>
  }, {
    stepperTitle: 'Start training',
    header: "h3. Heading",
    description: "h4. Heading",
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
    return parseInt(props.match.params.id) === totalSteps()
  }

  function handleNext() {
    nextPath(`/steps/${(parseInt(props.match.params.id) % totalSteps()) + 1}`)
  }

  function handleBack() {
    nextPath(`/steps/${parseInt(props.match.params.id) - 1}`)
  }

  function nextPath(path) {
    props.history.push(path);
  }

  const handleStep = step => () => {
    nextPath(`/steps/${step}`)
  }

  function handleComplete() {
    const newCompleted = new Set(completed)
    newCompleted.add(parseInt(props.match.params.id))
    setCompleted(newCompleted)

    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext()
    }
  }

  function handleReset() {
    nextPath(`/steps/1`)
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
        <Stepper alternativeLabel nonLinear activeStep={parseInt(props.match.params.id) - 1}>
          {steps.map((data, index) => {
            const stepProps = {}
            const buttonProps = {}

            return (

              <Step key={data.stepperTitle} {...stepProps}>
                <StepButton
                  onClick={handleStep(index + 1)}
                  completed={isStepComplete(index + 1)}
                  {...buttonProps}
                >
                  {data.stepperTitle}
                </StepButton>
              </Step>
            )
          })}
        </Stepper>
      </Grid>

      <Typography variant="h3" component="h2">{steps[parseInt(props.match.params.id) - 1].header}</Typography>
      <Typography variant="h5" component="h4">{steps[parseInt(props.match.params.id) - 1].description}</Typography>

      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
      >
        {steps[parseInt(props.match.params.id) - 1].content}

        <div>
          <Button disabled={parseInt(props.match.params.id) - 1 === 0} onClick={handleBack} className={classes.button}>
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
          {steps[parseInt(props.match.params.id) - 1].action}
        </div>
      </Grid>

    </Grid>
  )
}
