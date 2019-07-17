import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function AlertDialogSlide(props) {
    const [open, setOpen] = React.useState(true)

    const handleClose = complete => () => {
        if (complete) {
            props.onDialogClose()
        }
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onBackdropClick={handleClose(false)}
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Let Google help apps determine location. This means sending anonymous location data to
                    Google, even when no apps are running.
          </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose(false)} color="primary">
                    Disagree
          </Button>
                <Button onClick={handleClose(true)} color="primary">
                    Agree
          </Button>
            </DialogActions>
        </Dialog>
    )
}