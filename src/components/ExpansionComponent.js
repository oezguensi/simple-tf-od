import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField'
import { FormControl, InputLabel, Select, OutlinedInput, MenuItem, Switch, FormControlLabel, Divider, Grid } from '@material-ui/core'

import CenteredTabs from './TabsComponent'

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 900
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  formControl: {
    marginTop: theme.spacing(2),
    margin: theme.spacing(1),
    minWidth: 250,
  },
}));

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

const optimizers = [
  "rms_prop_optimizer",
  "momentum_optimizer",
  "adam_optimizer"
]

export default function ControlledExpansionPanels(props) {
  const classes = useStyles();
  const inputLabel = React.useRef(null);
  const [expanded, setExpanded] = React.useState('panel1');
  const [selectedTabs, setSelectedTab] = React.useState([0, 0])
  const [labelWidth, setLabelWidth] = React.useState(0);

  // const [checkedPretrained, setCheckedPretrained] = React.useState(true)



  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  // function handleSelect(event) {
  //   setValues(oldValues => ({
  //     ...oldValues,
  //     [event.target.name]: event.target.value,
  //   }));
  // }

  // const info = {
  //   "batchSize": props.onChangeBatchSize,
  //   "numCategories": props.onChangeNumCategories,
  //   "modelArchitecture": props.onSelectModelArchitecture,
  //   "pretrained": props.onSwitchPretrained,
  //   "optimizer": props.onSelectOptimizer,
  //   "outWidth": props.onChangeOutWidth,
  //   "outHeight": props.onChangeOutHeight
  // }





  // const handleChange = () => event => {
  //   info[event.target.name](event.target.value)
  // }

  // const handleSwitch = () => event => {
  //   info[event.target.name](event.target.checked)
  // }

  const handleExpand = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }

  const handleOnTabChange = (panelIndex) => (event, index) => {
    let newSelectedTab = [...selectedTabs]
    newSelectedTab[panelIndex] = index
    setSelectedTab(newSelectedTab)
  }

  return (
    <Container fixed className={classes.root}>
      <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleExpand('panel1')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Single Shot Detector</Typography>
          <Typography className={classes.secondaryHeading}>Configure the settings of the SSD</Typography>
        </ExpansionPanelSummary>
        {/* <Divider /> */}
        <ExpansionPanelDetails>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="stretch"
          >
            <Grid item>
              <CenteredTabs selectedTab={selectedTabs[0]} onTabChange={handleOnTabChange(0)} tabTitles={["Model Architecture", "Number of categories", "Output Shape"]} />
            </Grid>
            <Divider />
            {selectedTabs[0] == 0 &&
              <Grid item>


                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                    Model
                  </InputLabel>
                  <Select
                    value={props.values.modelArchitecture}
                    name="modelArchitecture"
                    onChange={props.handleOnChange}
                    input={<OutlinedInput labelWidth={labelWidth} name="age" id="outlined-age-simple" />}
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
            }
            {selectedTabs[0] === 1 &&
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
            }
            {selectedTabs[0] === 2 &&
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
            }
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleExpand('panel2')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Train configurations</Typography>
          <Typography className={classes.secondaryHeading}>
            Set different parameters for training
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <CenteredTabs selectedTab={selectedTabs[1]} onTabChange={handleOnTabChange(1)} tabTitles={["Batch Size", "Optimizer"]} />
          {selectedTabs[1] == 0 &&
            <TextField
              label="Batch Size"
              name="batchSize"
              className={classes.textField}
              value={props.values.batchSize}
              onChange={props.handleOnChange}
              margin="normal"
              variant="outlined"
            />
          }
          {selectedTabs[1] == 1 &&
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                Model
            </InputLabel>
              <Select
                value={props.values.optimizer}
                name="optimizer"
                onChange={props.handleOnChange}
                input={<OutlinedInput labelWidth={labelWidth} name="age" id="outlined-age-simple" />}
              >
                {optimizers.map((optimizer, index) => <MenuItem key={index} value={optimizer}>{optimizer}</MenuItem>)}
              </Select>
            </FormControl>
          }
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Container>
  );
}