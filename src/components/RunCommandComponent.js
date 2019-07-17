import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AlertDialogSlide from './AlertComponent'
import { CircularProgress, Zoom, Fab } from '@material-ui/core'
import { Check } from 'mdi-material-ui'

const useStyles = makeStyles(theme => ({
	fab: {
		position: 'absolute',
		bottom: theme.spacing(5),
		right: theme.spacing(7),
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
}))

export default function RunCommand(props) {
	const classes = useStyles()
	const theme = useTheme()

	const [alertCompleted, setAlertCompleted] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [remainingCommands, setRemainingCommands] = React.useState(props.commands)

	const startReadingChunkedResponse = (response) => {
		var reader = response.body.getReader()
		return reader.read().then(result => processChunks(result, reader))
	}

	const processChunks = (result, reader) => {
		console.log(result)
		console.log(new TextDecoder("utf-8").decode(result.value))
		if (!result.done) {
			return reader.read().then(result => processChunks(result, reader))
		}
	}

	const onChunkedResponseComplete = result => {
		setTimeout(() => {
			setLoading(false)
			setAlertCompleted(true)
			console.log('Finished process!', result)
		}, 2000)
	}

	const onChunkedResponseError = err => {
		console.error(err)
	}

	const makeRequest = command => {
		fetch('http://localhost:4000/shell', {
			method: 'POST',
			body: JSON.stringify(command),
			headers: { 'Content-Type': 'application/json' }
		}).then(startReadingChunkedResponse).then(onChunkedResponseComplete).catch(onChunkedResponseError)
	}

	const handleOnClick = () => {
		setLoading(true)
		props.commands.forEach(command => {
			makeRequest(command)
		})
	}

	const handleOnDialogClose = () => {
		setAlertCompleted(false)
		props.onComplete()
	}

	return (
		(loading ?
			<CircularProgress color="primary" />
			:
			(alertCompleted ?
				<AlertDialogSlide onDialogClose={handleOnDialogClose} />
				:
				<Zoom
					in={parseInt(props.match.params.id) - 1 === props.index}
					timeout={props.transitionDuration}
					style={{
						transitionDelay: `${parseInt(props.match.params.id) - 1 === props.index ? props.transitionDuration.exit : 0}ms`,
					}}
					unmountOnExit
				>
					<Fab
						onClick={handleOnClick}
						disabled={props.disabled}
						aria-label="Start training"
						className={classes.fab}
						color='primary'
						variant="extended"
					>
						<Check className={classes.extendedIcon} />
						Start training
					</Fab>
				</Zoom>
			)
		)
	)
}