import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import CreateTFRecord from './CreateTFRecordComponent'
import CreateConfigFileComponent from './CreateConfigFileComponent'
import StageOneView from '../views/StageOneView'
import StageTwoView from '../views/StageTwoView'
import StageThreeView from '../views/StageThreeView'
import RunCommand from './RunCommandComponent'

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
	},

	fab: {
		position: 'absolute',
		bottom: theme.spacing(5),
		right: theme.spacing(7),
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
}))

export default function HorizontalNonLinearAlternativeLabelStepper(props) {
	const classes = useStyles()
	const theme = useTheme()

	const [completed, setCompleted] = React.useState(new Set())
	const [skipped, setSkipped] = React.useState(new Set())
	const [labelMapCategories, setLabelMapCategories] = React.useState([])
	const [configText, setConfigText] = React.useState("")

	const transitionDuration = {
		enter: theme.transitions.duration.enteringScreen,
		exit: theme.transitions.duration.leavingScreen,
	}

	const steps = [{
		stepperTitle: 'Create TensorFlow records',
		// content: <UploadAnnotations />,
		header: "h3. Heading",
		description: "h4. Heading",
		content: <StageOneView labelMapCategories={labelMapCategories} onChange={setLabelMapCategories} />,
		action: <CreateTFRecord
			index={0}
			match={props.match}
			transitionDuration={transitionDuration}
			labelMapCategories={labelMapCategories}
			// disabled={labelMapCategories.length === 0}
			disabled={true}
			onComplete={handleComplete}
		/>
	}, {
		stepperTitle: 'Create train configuration file',
		header: "h3. Heading",
		description: "h4. Heading",
		content: <StageTwoView numCategories={labelMapCategories.length} configText={configText} onChange={setConfigText} />,
		action: <CreateConfigFileComponent
			index={1}
			match={props.match}
			transitionDuration={transitionDuration}
			disabled={false}
			configText={configText}
			onComplete={handleComplete}
		/>
	}, {
		stepperTitle: 'Start training',
		header: "h3. Heading",
		description: "h4. Heading",
		content: <StageThreeView />,
		action: <RunCommand
			index={2}
			match={props.match}
			transitionDuration={transitionDuration}
			disabled={!allStepsCompleted()}
			onComplete={handleComplete}
		/>
	}]

	function totalSteps() {
		return 3
	}

	function skippedSteps() {
		return skipped.size
	}

	function allStepsCompleted() {
		return completed.has(1) && completed.has(2)
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



				{/* {fabs.map((fab, index) => (
					<Zoom
						key={index}
						in={parseInt(props.match.params.id) - 1 === index}
						timeout={transitionDuration}
						style={{
							transitionDelay: `${parseInt(props.match.params.id) - 1 === index ? transitionDuration.exit : 0}ms`,
						}}
						unmountOnExit
					>
						<Fab disabled={fab.disable} aria-label={fab.label} className={fab.className} color={fab.color} variant="extended">
							{fab.icon}
							{fab.label}
						</Fab>
					</Zoom>
				))} */}

				<div>
					{/* <Button disabled={parseInt(props.match.params.id) - 1 === 0} onClick={handleBack} className={classes.button}>
						Back
					</Button>
					<Button
						variant="outlined"
						color="default"
						onClick={handleNext}
						className={classes.button}
					>
						Next
					</Button> */}
					{steps[parseInt(props.match.params.id) - 1].action}
				</div>
			</Grid>

		</Grid>
	)
}



