import React from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import AlertDialogSlide from './AlertComponent'

export default function RunCommand(props) {
	const [alertCompleted, setAlertCompleted] = React.useState(false)
	const [loading, setLoading] = React.useState(false)

	const handleOnClick = () => {
		setLoading(true)

		fetch('http://localhost:4000/shell', {
			method: 'POST',
			body: JSON.stringify({ command: 'ls -a' }),
			headers: { 'Content-Type': 'application/json' }
		}).then(() => {
			setAlertCompleted(true)
			setLoading(false)
		}).catch(console.error)
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
				<Button disabled={props.disabled} variant="contained" color="primary" onClick={handleOnClick}>
					Download
		  </Button>
			)
		)
	)

}