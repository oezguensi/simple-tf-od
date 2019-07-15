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
    const [chipData, setChipData] = React.useState([
        { key: 0, label: 'Angular' },
        { key: 1, label: 'jQuery' },
        { key: 2, label: 'Polymer' },
        { key: 3, label: 'React' },
        { key: 4, label: 'Vue.js' },
    ])

    const [selectedChip, setSelectedChip] = React.useState(null)
    const [text, setText] = React.useState('Cat in the Hat')
    const outsideExceptionIds = ["add-category"]

    const handleDelete = chipToDelete => () => {
        setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key))
    }

    const handleChange = () => event => {
        setText(event.target.value)
    }

    const handleOnSubmit = (event) => {
        event.preventDefault()
        let newChipData = [...chipData]
        if (selectedChip) {
            newChipData[selectedChip] = { key: selectedChip, label: text }
        } else {
            newChipData = [...chipData, { key: chipData[chipData.length - 1].key + 1, label: text }]
        }
        setChipData(newChipData)
    }

    const handleOnClick = chipToEdit => () => {
        setSelectedChip(chipToEdit.key)
        setText(chipToEdit.label)
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
            {chipData.map(data => {

                return (
                    <Chip
                        ref={data.key == selectedChip ? wrapperRef : null}
                        key={data.key}
                        color={selectedChip == data.key ? "primary" : "secondary"}
                        label={data.label}
                        onClick={handleOnClick(data)}
                        onDelete={handleDelete(data)}
                        className={classes.chip}
                    />
                )
            })}
        </div>
    )
}