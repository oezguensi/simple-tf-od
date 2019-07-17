import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { CircularProgress, Zoom, Fab } from '@material-ui/core'
import { Download } from 'mdi-material-ui'
import AlertDialogSlide from './AlertComponent'

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

export default function CreateConfigFileComponent(props) {
    const classes = useStyles()
    const theme = useTheme()

    const [alertCompleted, setAlertCompleted] = React.useState(false)
    const [loading, setLoading] = React.useState(false)


    const handleOnClick = () => {
        setLoading(true)
        fetch('http://localhost:4000/scripts/full', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                filePath: '/Users/oezguensi/Code/Other\ Projects/simple-tf-od/server/create_config.py',
                flags: [`--text=${props.configText}`],
            })
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
                </Zoom>
            )
        )
    )

}