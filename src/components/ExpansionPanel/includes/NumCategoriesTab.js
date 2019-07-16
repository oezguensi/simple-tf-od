import React from 'react'
import { Grid, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
}))

export default function NumCategoriesTab(props) {
    const classes = useStyles();
    return (
        <Grid item>
            <TextField
                label="Number of categories"
                name="numCategories"
                className={classes.textField}
                value={props.values.numCategories}
                onChange={props.handleOnChange}
                margin="normal"
                variant="outlined"
            />
        </Grid>
    )

}