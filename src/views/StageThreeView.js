import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CodeSnippetCard from '../components/CardComponent'


const commandsText = `
$ git clone https://github.com/tensorflow/models.git
$ protoc object_detection/protos/*.proto --python_out=.
$ export PYTHONPATH=$PYTHONPATH:\`pwd\`:\`pwd\`/slim
$ export CUDA_VISIBLE_DEVICES=x
$ python legacy/train.py 
    --logtostderr 
    --train_dir=training 
    --pipeline_config_path=training/train_config.config > logs 2>&1 &
`

const commandsDescription = `
Finally we can start training the Object Detector. For that it is necessary to run a couple commands in the terminal. 
By clicking on the button these commands will be executed as a child process.
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
            <Grid item xs={12} sm={6}>
                <CodeSnippetCard height={600} title="Shell commands" subheader="Need to be executed succesively" language="shell-session" code={commandsText} description={commandsDescription} copy={true}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <CodeSnippetCard height={600} title="Output" language="shell-session" code={""}/>
            </Grid>

        </Grid>
    )
}

