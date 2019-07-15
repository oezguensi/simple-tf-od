import React from 'react';
import Highlight from 'react-highlight'

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardTextOutline, ClipboardCheck } from 'mdi-material-ui'

export default function CodeSnippetCard(props) {
    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1,
        },
        paper: {

        },
        card: {
            width: props.width,
            height: props.height,
        },
        codeSnippet: {
            height: props.codeHeight
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        icon: {
            fontSize: 24
        },
    }));

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [copied, setCopied] = React.useState(false)

    const handleOnCopy = () => {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    function handleExpandClick() {
        setExpanded(!expanded);
    }

    return (
        <Card className={classes.card}>
            <CardHeader
                action={
                    <CopyToClipboard onCopy={handleOnCopy} text={props.code}>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                        >
                            <Grid item>
                                <Fade
                                    mountOnEnter unmountOnExit
                                    in={copied}
                                    {...(copied ? { timeout: 1500 } : {})}
                                    {...(!copied ? { timeout: 1000 } : {})}
                                >
                                    <Typography component="div">Copied to clipboard!</Typography>
                                </Fade>
                            </Grid>
                            <Grid item>
                                <IconButton aria-label="Settings">
                                    {copied ? <ClipboardCheck className={classes.icon} /> : <ClipboardTextOutline className={classes.icon} />}
                                </IconButton>
                            </Grid>
                        </Grid>
                    </CopyToClipboard>

                }
                title={props.title}
                subheader={props.subheader}
            />
            <Highlight language={props.language} className={classes.codeSnippet}>
                {props.code}
            </Highlight>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.description}
                </Typography>
            </CardContent>
        </Card>
    );
}