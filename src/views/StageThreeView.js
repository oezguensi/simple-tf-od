import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CodeSnippetCard from '../components/CardComponent'

const treeStructure = `
.
├── data
├── node_modules
├── outputs
├── public
├── records
├── servere
└── src
`

const treeStructureDescription = `
To assign the categories/labels of the bounding boxes in the annotation files, the TF OD APIs script needs a mapping. 
This mapping follows a specific structure resembling json. The file is saved with the .pbtxt extension.
`

const labelMapExample = `
$ echo $EDITOR
vim
$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'.
$ git push
Everything up-to-date
$ echo 'All
> done!'
All
done!
  `

const labelMapDescription = `
To assign the categories/labels of the bounding boxes in the annotation files, the TF OD APIs script needs a mapping. 
This mapping follows a specific structure resembling json. The file is saved with the .pbtxt extension.
`


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
}))

export default function StageThreeView(props) {
    const classes = useStyles()
    return (
        <Grid
            className={classes.root}
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={10}
        >
            <Grid item>
                <CodeSnippetCard width={500} height={600} codeHeight={350} title="Folder structure" subheader="Verify the folder structure" language="shell-session" code={treeStructure} description={treeStructureDescription} />
            </Grid>
            <Grid item>
                <CodeSnippetCard width={500} height={600} codeHeight={350} title="Shell commands" subheader="Need to be executed succesively" language="shell-session" code={labelMapExample} description={labelMapDescription} />
            </Grid>
        </Grid>
    )
}

