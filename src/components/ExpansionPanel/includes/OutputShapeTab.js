import React from 'react'
import { Grid, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}))


export default function OutputShapeTab(props) {
    const classes = useStyles();
    return (
        <Grid item>
            <TextField
                label="Output Height"
                name="outHeight"
                className={classes.textField}
                value={props.values.outHeight}
                onChange={props.handleOnChange}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Output Width"
                name="outWidth"
                className={classes.textField}
                value={props.values.outWidth}
                onChange={props.handleOnChange}
                margin="normal"
                variant="outlined"
            />
        </Grid>
    )
}