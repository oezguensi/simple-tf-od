import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, InputLabel, Select, FormControlLabel, Switch, OutlinedInput, MenuItem } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    formControl: {
        marginTop: theme.spacing(2),
        margin: theme.spacing(1),
        minWidth: 250,
    },
}))

const modelArchitectures = [
    "ssd_mobilenet_v1_coco",
    "ssd_mobilenet_v1_0.75_depth_coco",
    "ssd_mobilenet_v1_quantized_coco",
    "ssd_mobilenet_v1_0.75_depth_quantized_coco",
    "ssd_mobilenet_v1_ppn_coco",
    "ssd_mobilenet_v1_fpn_coco",
    "ssd_resnet_50_fpn_coco",
    "ssd_mobilenet_v2_coco",
    "ssd_mobilenet_v2_quantized_coco",
    "ssdlite_mobilenet_v2_coco",
    "ssd_inception_v2_coco"]

export default function ModelArchitectureTab(props) {
    const classes = useStyles()

    return (
        <Grid
            item
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
        >
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={props.inputLabel} htmlFor="outlined-age-simple">
                    Model
                  </InputLabel>
                <Select
                    value={props.values.modelArchitecture}
                    name="modelArchitecture"
                    onChange={props.handleOnChange}
                    input={<OutlinedInput labelWidth={props.labelWidth} name="age" id="outlined-age-simple" />}
                >
                    {modelArchitectures.map((model, index) => <MenuItem key={index} value={model}>{model}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControlLabel
                control={
                    <Switch
                        checked={props.values.pretrained}
                        name="pretrained"
                        onChange={props.handleOnSwitch}
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                }
                label="Pretrained"
            />
        </Grid>
    )
}