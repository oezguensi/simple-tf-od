import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import { Divider, Grid } from '@material-ui/core'

import CenteredTabs from '../TabsComponent'
import ModelArchitectureTab from './includes/ModelArchitectureTab'
import NumCategoriesTab from './includes/NumCategoriesTab'
import OutputShapeTab from './includes/OutputShapeTab'
import BatchSizeTab from './includes/BatchSizeTab'
import OptimizerTab from './includes/OptimizerTab'

const useStyles = makeStyles(theme => ({
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
}))


export default function ControlledExpansionPanels(props) {
  const classes = useStyles();
  const inputLabel = React.useRef(null);
  const [expanded, setExpanded] = React.useState(0);
  const [selectedTabs, setSelectedTab] = React.useState([0, 0])
  const [labelWidth, setLabelWidth] = React.useState(0);

  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const getPanelData = () => {
    return [
      {
        heading: "Single Shot Detector",
        secondaryHeading: "Configure the settings of the SSD",
        tabTitles: ["Model Architecture", "Number of categories", "Output Shape"],
        tabContents: [
          <ModelArchitectureTab values={props.values} handleOnChange={props.handleOnChange} handleOnSwitch={props.handleOnSwitch}
            inputLabel={inputLabel}
            labelWidth={labelWidth}
          />,
          <NumCategoriesTab values={props.values} handleOnChange={props.handleOnChange} />,
          <OutputShapeTab values={props.values} handleOnChange={props.handleOnChange} />
        ]
      },
      {
        heading: "Train configurations",
        secondaryHeading: "Set different parameters for training",
        tabTitles: ["Batch Size", "Optimizer"],
        tabContents: [
          <BatchSizeTab values={props.values} handleOnChange={props.handleOnChange} />,
          <OptimizerTab values={props.values} inputLabel={inputLabel} labelWidth={labelWidth} />
        ]
      }
    ]
  }

  const handleExpand = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }

  const handleOnTabChange = (panelIndex) => (event, index) => {
    let newSelectedTab = [...selectedTabs]
    newSelectedTab[panelIndex] = index
    setSelectedTab(newSelectedTab)
  }

  return (
    <Grid item xs={12} sm={6}>
      {getPanelData().map((data, index) => {
        return (
          <ExpansionPanel key={index} expanded={expanded === index} onChange={handleExpand(index)}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>{data.heading}</Typography>
              <Typography className={classes.secondaryHeading}>{data.secondaryHeading}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
              >
                <Grid item>
                  <CenteredTabs selectedTab={selectedTabs[index]} onTabChange={handleOnTabChange(index)} tabTitles={data.tabTitles} />
                </Grid>
                <Divider />
                {data.tabContents[selectedTabs[index]]}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })}
    </Grid>
  )
}