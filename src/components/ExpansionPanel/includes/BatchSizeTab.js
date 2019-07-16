import React from 'react'
import { TextField } from '@material-ui/core'
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
        <TextField
            label="Batch Size"
            name="batchSize"
            className={classes.textField}
            value={props.values.batchSize}
            onChange={props.handleOnChange}
            margin="normal"
            variant="outlined"
        />
    )
}