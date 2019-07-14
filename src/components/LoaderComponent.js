import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

export default function CircularStaticLoader(props) {
    return (
        <CircularProgress variant="static" value={props.progress} />
    )
}