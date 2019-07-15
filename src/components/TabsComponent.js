import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
})

export default function CenteredTabs(props) {
  const classes = useStyles()

  return (
      <Tabs
        className={classes.root}
        value={props.selectedTab}
        onChange={props.onTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {props.tabTitles.map((title, index) => <Tab key={index} label={title} />)}
      </Tabs>
  )
}