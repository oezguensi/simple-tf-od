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
import ControlledExpansionPanels from './ExpansionComponent'
import CreateTFRecord from './CreateTFRecordComponent'
import CodeSnippetCard from './CardComponent'


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

const pascalVOCExample = `<annotation>
	<folder>my_folder</folder>
	<filename>my_filename</filename>
	<path>my_filepath</path>
        <source>
            <database>Unknown</database>
        </source>
        <size>
            <width>image_width</width>
            <height>image_height</height>
            <!--3 if RGB-->
            <depth>image_num_channels</depth>
        </size>
        <segmented>0</segmented>
        <!--Each bounding box is a <object>-->        
	<object>
		<name>category_of_object</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>x1</xmin>
			<ymin>y1</ymin>
			<xmax>x2</xmax>
			<ymax>y2</ymax>
		</bndbox>
	</object>
	<object>
		<name>other_category_of_object</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>x1</xmin>
			<ymin>y1</ymin>
			<xmax>x2</xmax>
			<ymax>y2</ymax>
		</bndbox>
	</object>
</annotation>
`

const pascalVOCDescription = `
The PASCAL Visual Object Classes Format is a standardized XML format. 
The TensorFlow Object Detection API has a built-in function that transforms annotation files in this specific format 
to the necessary TF Record file format. LabelImg can automatically create annotations in this format.
`

const labelMapExample = `item {
  id: 1
  name: 'first_category'
}

item {
  id: 2
  name: 'second_category'
}

item {
  id: 3
  name: 'third_category'
}
`

const labelMapDescription = `
To assign the categories/labels of the bounding boxes in the annotation files, the TF OD APIs script needs a mapping. 
This mapping follows a specific structure resembling json. The file is saved with the .pbtxt extension.
`

export default function HorizontalNonLinearAlternativeLabelStepper() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState(new Set())
  const [skipped, setSkipped] = React.useState(new Set())
  const [labelMapCategories, setLabelMapCategories] = React.useState([])

  const steps = [{
    stepperTitle: 'Create TensorFlow records',
    // content: <UploadAnnotations />,
    header: "h3. Heading",
    description: "h4. Heading",
    content: <div>
      <Grid
        className={classes.root}
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={10}
      >
        <Grid item>
          <CodeSnippetCard title="XML" subheader="PASCAL VOC Format" language="xml" code={pascalVOCExample} description={pascalVOCDescription} />
        </Grid>
        <Grid item>
          <CodeSnippetCard title="LabelMap" subheader=".pbtxt" language="json" code={labelMapExample} description={labelMapDescription} />
        </Grid>
      </Grid>
      <Typography variant="h6" component="p">
        Down below you can create the necessary TF Record files. For that you need to specify all categories of your objects. Also be sure that your annotation files have the correct format and are in the correct folder.
      </Typography>
      <LabelMapChips labelMapCategories={labelMapCategories} onChange={setLabelMapCategories} />
    </div>,
    action: <CreateTFRecord labelMapCategories={labelMapCategories} disabled={labelMapCategories.length === 0} onComplete={handleComplete} />
  }, {
    stepperTitle: 'Create train configuration file',
    header: "h3. Heading",
    description: "h4. Heading",
    content: <ControlledExpansionPanels />,
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
              <Step key={data.stepperTitle} {...stepProps}>
                <StepButton
                  onClick={handleStep(index)}
                  completed={isStepComplete(index)}
                  {...buttonProps}
                >
                  {data.stepperTitle}
                </StepButton>
              </Step>
            )
          })}
        </Stepper>
      </Grid>

      <Typography variant="h3" component="h2">{steps[activeStep].header}</Typography>
      <Typography variant="h5" component="h4">{steps[activeStep].description}</Typography>

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
