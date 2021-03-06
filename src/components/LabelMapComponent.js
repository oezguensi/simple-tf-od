import React, { useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { POINT_CONVERSION_COMPRESSED } from 'constants';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
    },

    chip: {
        margin: theme.spacing(0.5),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    }
}))


export default function LabelMapChips(props) {

    function useOutsideAlerter(ref) {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && !outsideExceptionIds.includes(event.target.id)) {
                setSelectedChip(null)
            }
        }
        useEffect(() => {
            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        })
    }

    const wrapperRef = useRef(null)
    useOutsideAlerter(wrapperRef)

    const classes = useStyles()

    const [selectedChip, setSelectedChip] = React.useState(null)
    const [text, setText] = React.useState('')
    const outsideExceptionIds = ["add-category"]

    const handleDelete = chipIndexToDelete => () => {
        let newChipData = props.labelMapCategories.filter((_, index) => index !== chipIndexToDelete)
        props.onChange(newChipData)
    }

    const handleChange = () => event => {
        setText(event.target.value)
    }

    const handleOnSubmit = (event) => {
        event.preventDefault()
        let newChipData = [...props.labelMapCategories]
        if (selectedChip !== null) {
            newChipData[selectedChip] = text
        } else {
            newChipData = [...props.labelMapCategories, text]
        }
        setText('')

        props.onChange(newChipData)
    }

    const handleOnClick = (text, index) => () => {
        setSelectedChip(index)
        setText(text)
    }

    return (
        <Grid
            container
            item
            xs={12}
            sm={12}
            md={4}
            direction="column"
            justify="center"
            alignItems="center"

        >
            <form onSubmit={handleOnSubmit} noValidate autoComplete="off">
                <TextField
                    id="add-category"
                    label="New Category"
                    className={classes.textField}
                    value={text}
                    onChange={handleChange('name')}
                    margin="normal"
                    variant="outlined"
                />
            </form>
            <div className={classes.root}>

                {props.labelMapCategories.map((text, index) => {
                    return (
                        <Chip
                            ref={index == selectedChip ? wrapperRef : null}
                            color={selectedChip == index ? "primary" : "default"}
                            label={text}
                            onClick={handleOnClick(text, index)}
                            onDelete={handleDelete(index)}
                            className={classes.chip}
                        />
                    )
                })}

            </div>
        </Grid>
    )
}