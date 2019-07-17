import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CodeSnippetCard from '../components/CardComponent'
import LabelMapChips from '../components/LabelMapComponent'


const pascalVOCExample = `<annotation>
	<folder>my_folder</folder>
	<filename>my_filename</filename>
	<path>my_filepath</path>
        <source>
            <database>Unknown</database>
        </source>
        <size>
            <width>image_width</width>
            <height>image_height</height>
            <!--3 if RGB-->
            <depth>image_num_channels</depth>
        </size>
        <segmented>0</segmented>
        <!--Each bounding box is a <object>-->        
	<object>
		<name>category_of_object</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>x1</xmin>
			<ymin>y1</ymin>
			<xmax>x2</xmax>
			<ymax>y2</ymax>
		</bndbox>
	</object>
	<object>
		<name>other_category_of_object</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>x1</xmin>
			<ymin>y1</ymin>
			<xmax>x2</xmax>
			<ymax>y2</ymax>
		</bndbox>
	</object>
</annotation>
`

const pascalVOCDescription = `
The PASCAL Visual Object Classes Format is a standardized XML format. 
The TensorFlow Object Detection API has a built-in function that transforms annotation files in this specific format 
to the necessary TF Record file format. LabelImg can automatically create annotations in this format.
`

const labelMapExample = `item {
    id: 1
    name: 'first_category'
  }
  
  item {
    id: 2
    name: 'second_category'
  }
  
  item {
    id: 3
    name: 'third_category'
  }
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

export default function StageOneView(props) {
    const classes = useStyles()
    return (
        <Grid
            className={classes.root}
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={10}
        >
            <Grid item xs={12} sm={6} md={4}>
                <CodeSnippetCard height={600} title="XML" subheader="PASCAL VOC Format" language="xml" code={pascalVOCExample} description={pascalVOCDescription} copy={true}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CodeSnippetCard height={600} title="LabelMap" subheader=".pbtxt" language="json" code={labelMapExample} description={labelMapDescription} copy={true}/>
            </Grid>

            {/* <Typography variant="h6" component="p">
                Down below you can create the necessary TF Record files. For that you need to specify all categories of your objects. Also be sure that your annotation files have the correct format and are in the correct folder.
            </Typography> */}

            <LabelMapChips labelMapCategories={props.labelMapCategories} onChange={props.onChange} />

        </Grid>
    )
}