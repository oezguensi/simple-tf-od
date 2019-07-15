import React, { useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'


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


export default function ChipsArray() {

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
    const [chipData, setChipData] = React.useState([])

    const [selectedChip, setSelectedChip] = React.useState(null)
    const [text, setText] = React.useState('Cat in the Hat')
    const outsideExceptionIds = ["add-category"]

    const handleDelete = chipIndexToDelete => () => {
        setChipData(chips => chips.filter((_, index) => index !== chipIndexToDelete))
    }

    const handleChange = () => event => {
        setText(event.target.value)
    }

    const handleOnSubmit = (event) => {
        event.preventDefault()
        let newChipData = [...chipData]
        if (selectedChip !== null) {
            newChipData[selectedChip] = text
        } else {
            newChipData = [...chipData, text]
        }
        setChipData(newChipData)
    }

    const handleOnClick = (text, index) => () => {
        setSelectedChip(index)
        setText(text)
    }

    return (
        <div className={classes.root}>
            <form onSubmit={handleOnSubmit} noValidate autoComplete="off">
                <TextField
                    id="add-category"
                    label="New Category"
                    className={classes.textField}
                    value={text}
                    placeholder="Placeholder"
                    onChange={handleChange('name')}
                    margin="normal"
                    variant="outlined"
                />
            </form>
            {chipData.map((text, index) => {
                return (
                    <Chip
                        ref={index == selectedChip ? wrapperRef : null}
                        key={index}
                        color={selectedChip == index ? "primary" : "secondary"}
                        label={text}
                        onClick={handleOnClick(text, index)}
                        onDelete={handleDelete(index)}
                        className={classes.chip}
                    />
                )
            })}
        </div>
    )
}