import React from 'react'
import { FormControl, InputLabel, Select, OutlinedInput, MenuItem, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    formControl: {
        marginTop: theme.spacing(2),
        margin: theme.spacing(1),
        minWidth: 250,
    },
}))


const optimizers = [
    "rms_prop_optimizer",
    "momentum_optimizer",
    "adam_optimizer"
]

export default function OutputShapeTab(props) {
    const classes = useStyles();
    return (
        <Grid item>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={props.inputLabel} htmlFor="outlined-age-simple">
                    Model
            </InputLabel>
                <Select
                    value={props.values.optimizer}
                    name="optimizer"
                    onChange={props.handleOnChange}
                    input={<OutlinedInput labelWidth={props.labelWidth} name="age" id="outlined-age-simple" />}
                >
                    {optimizers.map((optimizer, index) => <MenuItem key={index} value={optimizer}>{optimizer}</MenuItem>)}
                </Select>
            </FormControl>
        </Grid>
    )
}