import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField'
import { FormControl, InputLabel, Select, OutlinedInput, MenuItem, Switch, FormControlLabel } from '@material-ui/core'

import CenteredTabs from './TabsComponent'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
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
  }
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

export default function ControlledExpansionPanels(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [selectedTabs, setSelectedTab] = React.useState([0, 0])
  const [outSize, setOutSize] = React.useState([300, 300])
  // const [values, setValues] = React.useState({
  //   age: '',
  //   name: 'hai',
  // });

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);


  const [checkedPretrained, setCheckedPretrained] = React.useState(true)

  const handleSwitch = name => event => {
    setCheckedPretrained(event.target.checked)
  };


  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  // function handleSelect(event) {
  //   setValues(oldValues => ({
  //     ...oldValues,
  //     [event.target.name]: event.target.value,
  //   }));
  // }


  const handleExpand = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSelectModelArchitecture = () => event => {
    props.onSelectModelArchitecture(event.target.value)
  }

  const handleChangeNumCategories = () => event => {
    props.onChangeNumCategories(event.target.value)
  }

  const handleChangeBatchSize = () => event => {
    props.onChangeBatchSize(event.target.value)
  }

  const handleChangeWidth = () => event => {
    let newSize = [...outSize]
    newSize[0] = event.target.value
    setOutSize(newSize)
  }

  const handleChangeHeight = () => event => {
    let newSize = [...outSize]
    newSize[1] = event.target.value
    setOutSize(newSize)
  }

  const handleOnTabChange = (panelIndex) => (event, index) => {
    let newSelectedTab = [...selectedTabs]
    newSelectedTab[panelIndex] = index
    setSelectedTab(newSelectedTab)
  }

  return (
    <Container maxWidth="md">
      <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleExpand('panel1')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Single Shot Detector</Typography>
          <Typography className={classes.secondaryHeading}>Configure the settings of the SSD</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <CenteredTabs selectedTab={selectedTabs[0]} onTabChange={handleOnTabChange(0)} tabTitles={["Model Architecture", "Number of categories", "Output Shape"]} />
          {selectedTabs[0] == 0 &&
            <div>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedPretrained}
                    onChange={handleSwitch('checkedPretrained')}
                    value="checkedPretrained"
                    color="primary"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                }
                label="Pretrained"
              />

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                  Model
                </InputLabel>
                <Select
                  value={props.modelArchitecture}
                  onChange={handleSelectModelArchitecture('name')}
                  input={<OutlinedInput labelWidth={labelWidth} name="age" id="outlined-age-simple" />}
                >
                  {modelArchitectures.map((model, index) => <MenuItem key={index} value={model}>{model}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
          }
          {selectedTabs[0] === 1 &&
            <TextField
              id="num-categories"
              label="Number of categories"
              className={classes.textField}
              value={props.numCategories}
              onChange={handleChangeNumCategories('name')}
              margin="normal"
              variant="outlined"
            />
          }
          {selectedTabs[0] === 2 &&
            <div>
              <TextField
                label="Output Width"
                className={classes.textField}
                value={outSize[0]}
                onChange={handleChangeWidth('name')}
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Output Height"
                className={classes.textField}
                value={outSize[1]}
                onChange={handleChangeHeight('name')}
                margin="normal"
                variant="outlined"
              />
            </div>
          }
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
          <CenteredTabs selectedTab={selectedTabs[1]} onTabChange={handleOnTabChange(1)} tabTitles={["Batch Size"]} />
          {selectedTabs[1] == 0 &&
            <TextField
              label="Batch Size"
              className={classes.textField}
              value={props.batchSize}
              onChange={handleChangeBatchSize('name')}
              margin="normal"
              variant="outlined"
            />
          }
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleExpand('panel3')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>Advanced settings</Typography>
          <Typography className={classes.secondaryHeading}>
            Filtering has been entirely disabled for whole web server
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'panel4'} onChange={handleExpand('panel4')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>Personal data</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Container>
  );
}