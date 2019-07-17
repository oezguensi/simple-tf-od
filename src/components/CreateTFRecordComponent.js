import React from 'react'
import { CircularProgress, Zoom, Fab, Dialog, Paper, Container, Grid } from '@material-ui/core'
import AlertDialogSlide from './AlertComponent'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Download } from 'mdi-material-ui'

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

export default function CreateTFRecord(props) {
	const classes = useStyles()
	const theme = useTheme()
	const initialProgress = 5

	const [loading, setLoading] = React.useState(false)
	const [alertCompleted, setAlertCompleted] = React.useState(false)
	const [progress, setProgress] = React.useState(0)

	const createLabelMap = (labelMapCategories) => {
		return labelMapCategories.map((category, index) => `"${category}": ${index + 1}`).join(', ')
	}

	const startReadingChunkedResponse = (response) => {
		var reader = response.body.getReader()
		return reader.read().then(result => processChunks(result, reader));
	}

	const processChunks = (result, reader) => {
		const outString = new TextDecoder("utf-8").decode(result.value)
		const newProgress = outString.split(" ")[1]
		if (outString.includes('% of annotations') && newProgress > initialProgress) setProgress(newProgress)

		if (!result.done) return reader.read().then(result => processChunks(result, reader));
	}

	const onChunkedResponseComplete = (result) => {
		setProgress(100)
		setTimeout(() => {
			setLoading(false)
			setAlertCompleted(true)
			console.log('Finished process!', result)
		}, 2000);
	}

	const onChunkedResponseError = (err) => {
		console.error(err)
	}

	const handleOnClick = () => {
		setLoading(true)
		setTimeout(() => {
			setProgress(initialProgress)
		}, 1000)

		fetch('http://localhost:4000/scripts/chunked', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},

			body: JSON.stringify({
				filePath: '/Users/oezguensi/Code/Other\ Projects/simple-tf-od/server/custom_create_pascal_tf_record.py',
				flags: ['--data_set=train',
					'--imgs_dir=/Users/oezguensi/Code/Other\ Projects/simple-tf-od/data/imgs',
					'--annotations_dir=/Users/oezguensi/Code/Other\ Projects/simple-tf-od/data/annotations',
					`--label_map_dict={${createLabelMap(props.labelMapCategories)}}`,
					'--out_dir=/Users/oezguensi/Code/Other\ Projects/simple-tf-od/records'],
			})
		}).then(startReadingChunkedResponse).then(onChunkedResponseComplete).catch(onChunkedResponseError)
	}

	const handleOnDialogClose = () => {
		setAlertCompleted(false)
		props.onComplete()
	}

	return (
		<div>
			<Dialog
				open={loading}
				PaperComponent={Grid}
				keepMounted
				disableBackdropClick={true}
			>
				<CircularProgress size={75} thickness={4} variant="static" value={progress} />
			</Dialog>

			{alertCompleted ?
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
						aria-label="Download"
						className={classes.fab}
						color={'primary'}
						variant="extended"
					>
						<Download className={classes.extendedIcon} />
						Download
					</Fab>
				</Zoom>}
		</div>
	)
}