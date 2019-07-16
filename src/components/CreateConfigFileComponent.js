import React from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import AlertDialogSlide from './AlertComponent'

export default function CreateConfigFileComponent(props) {
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
            <CircularProgress color="primary"/>
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