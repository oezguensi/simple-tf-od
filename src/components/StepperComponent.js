// import React from 'react'
// import { makeStyles } from '@material-ui/core/styles'
// import Stepper from '@material-ui/core/Stepper'
// import Step from '@material-ui/core/Step'
// import StepButton from '@material-ui/core/StepButton'
// import Button from '@material-ui/core/Button'
// import Grid from '@material-ui/core/Grid'

// import UploadAnnotations from './UploadAnnotationsComponent'
// import ControlledExpansionPanels from './ExpansionComponent'
// import CreateTFRecord from './CreateTFRecordComponent'

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//   },
//   button: {
//     marginRight: theme.spacing(1),
//   },
//   instructions: {
//     marginTop: theme.spacing(1),
//     marginBottom: theme.spacing(1),
//   },
// }))

// function getSteps() {
//   return ['Create TensorFlow records', 'Create train configuration file', 'Start training']
// }

// export default function HorizontalCustomStepper() {
//   const classes = useStyles()
//   const [activeStep, setActiveStep] = React.useState(0)
//   const [completed, setCompleted] = React.useState(new Set())
//   const [skipped, setSkipped] = React.useState(new Set())
//   const steps = getSteps()

//   function handleNext() {
//     setActiveStep(activeStep + 1)
//   }

//   function handleBack() {
//     setActiveStep(prevActiveStep => prevActiveStep - 1)
//   }

//   const handleStep = step => () => {
//     setActiveStep(step)
//   }

//   function isStepSkipped(step) {
//     return skipped.has(step)
//   }

//   function isStepComplete(step) {
//     return completed.has(step)
//   }

//   return (
//     <Grid
//       className={classes.root}
//       container
//       direction="column"
//       justify="flex-start"
//       alignItems="stretch"
//     >
//       <Grid item>
//         <Stepper alternativeLabel nonLinear activeStep={activeStep}>
//           {steps.map((label, index) => {
//             const stepProps = {}
//             const buttonProps = {}
//             if (isStepSkipped(index)) {
//               stepProps.completed = false
//             }
//             return (
//               <Step key={label} {...stepProps}>
//                 <StepButton
//                   onClick={handleStep(index)}
//                   completed={isStepComplete(index)}
//                   {...buttonProps}
//                 >
//                   {label}
//                 </StepButton>
//               </Step>
//             )
//           })}
//         </Stepper>
//       </Grid>

//       <Grid
//         container
//         direction="column"
//         justify="space-between"
//         alignItems="center"
//       >
//         {(() => {
//           switch (activeStep) {
//             case 0:
//               return <UploadAnnotations />
//             case 1:
//               return <ControlledExpansionPanels />
//             case 2:
//               return null
//             default:
//               return null
//           }
//         })()}

//         <div>
//           <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
//             Back
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleNext}
//             className={classes.button}
//           >
//             Next
//           </Button>
//           {(() => {
//             switch (activeStep) {
//               case 0:
//                 return <CreateTFRecord onClick={handleNext} />
//               case 1:
//                 return null
//               case 2:
//                 return null
//               default:
//                 return null
//             }
//           })()}
//         </div>
//       </Grid>
//     </Grid>
//   )
// }





import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import UploadAnnotations from './UploadAnnotationsComponent'
import ControlledExpansionPanels from './ExpansionComponent'
import CreateTFRecord from './CreateTFRecordComponent'

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
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
  const steps = [{
    description: 'Select campaign settings',
    content: <UploadAnnotations />,
    action: <CreateTFRecord onComplete={handleComplete} />
  }, {
    description: 'Create an ad group',
    content: <ControlledExpansionPanels />,
    action: <Button onClick={handleComplete} className={classes.button}>Complete</Button>
  }, {
    description: 'Create an ad',
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
