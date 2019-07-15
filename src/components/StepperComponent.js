import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';

import UploadAnnotations from './UploadAnnotationsComponent'
import LabelMapChips from './LabelMapComponent'
import ControlledExpansionPanels from './ExpansionComponent'
import CreateTFRecord from './CreateTFRecordComponent'
import CodeSnippetCard from './CardComponent'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  link: {
    textDecoration: "none"
  }
}))



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

const getConfig = (modelArchitecture, pretrained, numCategories, outWidth, outHeight, batchSize, optimizer) => {
  return `model {
  ssd {
    num_classes: ${numCategories}
    box_coder {
      faster_rcnn_box_coder {
        y_scale: 10.0
        x_scale: 10.0
        height_scale: 5.0
        width_scale: 5.0
      }
    }
    matcher {
      argmax_matcher {
        matched_threshold: 0.5
        unmatched_threshold: 0.5
        ignore_thresholds: false
        negatives_lower_than_unmatched: true
        force_match_for_each_row: true
      }
    }
    similarity_calculator {
      iou_similarity {
      }
    }
    anchor_generator {
      ssd_anchor_generator {
        num_layers: 6
        min_scale: 0.2
        max_scale: 0.95
        aspect_ratios: 1.0
        aspect_ratios: 2.0
        aspect_ratios: 0.5
        aspect_ratios: 3.0
        aspect_ratios: 0.3333
      }
    }
    image_resizer {
      fixed_shape_resizer {
        height: ${outHeight}
        width: ${outWidth}
      }
    }
    box_predictor {
      convolutional_box_predictor {
        min_depth: 0
        max_depth: 0
        num_layers_before_predictor: 0
        use_dropout: false
        dropout_keep_probability: 0.8
        kernel_size: 1
        box_code_size: 4
        apply_sigmoid_to_scores: false
        conv_hyperparams {
          activation: RELU_6,
          regularizer {
            l2_regularizer {
              weight: 0.00004
            }
          }
          initializer {
            truncated_normal_initializer {
              stddev: 0.03
              mean: 0.0
            }
          }
          batch_norm {
            train: true,
            scale: true,
            center: true,
            decay: 0.9997,
            epsilon: 0.001,
          }
        }
      }
    }
    feature_extractor {
      type: ${modelArchitecture}
      min_depth: 16
      depth_multiplier: 1.0
      conv_hyperparams {
        activation: RELU_6,
        regularizer {
          l2_regularizer {
            weight: 0.00004
          }
        }
        initializer {
          truncated_normal_initializer {
            stddev: 0.03
            mean: 0.0
          }
        }
        batch_norm {
          train: true,
          scale: true,
          center: true,
          decay: 0.9997,
          epsilon: 0.001,
        }
      }
    }
    loss {
      classification_loss {
        weighted_sigmoid {
        }
      }
      localization_loss {
        weighted_smooth_l1 {
        }
      }
      hard_example_miner {
        num_hard_examples: 3000
        iou_threshold: 0.99
        loss_type: CLASSIFICATION
        max_negatives_per_positive: 3
        min_negatives_per_image: 3
      }
      classification_weight: 1.0
      localization_weight: 1.0
    }
    normalize_loss_by_num_matches: true
    post_processing {
      batch_non_max_suppression {
        score_threshold: 1e-8
        iou_threshold: 0.6
        max_detections_per_class: 100
        max_total_detections: 100
      }
      score_converter: SIGMOID
    }
  }
}

train_config: {
  batch_size: ${batchSize}
  optimizer {
    ${optimizer}: {
      learning_rate: {
        exponential_decay_learning_rate {
          initial_learning_rate: 0.004
          decay_steps: 800720
          decay_factor: 0.95
        }
      }
      momentum_optimizer_value: 0.9
      decay: 0.9
      epsilon: 1.0
    }
  }
  ${pretrained ? 
  `
  fine_tune_checkpoint: "PATH_TO_BE_CONFIGURED/model.ckpt"
  fine_tune_checkpoint_type:  "detection"
  `
  : ``}
  # Note: The below line limits the training process to 200K steps, which we
  # empirically found to be sufficient enough to train the pets dataset. This
  # effectively bypasses the learning rate schedule (the learning rate will
  # never decay). Remove the below line to train indefinitely.
  num_steps: 200000
  data_augmentation_options {
    random_horizontal_flip {
    }
  }
  data_augmentation_options {
    ssd_random_crop {
    }
  }
}

train_input_reader: {
  tf_record_input_reader {
    input_path: "PATH_TO_BE_CONFIGURED/mscoco_train.record-?????-of-00100"
  }
  label_map_path: "PATH_TO_BE_CONFIGURED/mscoco_label_map.pbtxt"
}

eval_config: {
  num_examples: 8000
  # Note: The below line limits the evaluation process to 10 evaluations.
  # Remove the below line to evaluate indefinitely.
  max_evals: 10
}

eval_input_reader: {
  tf_record_input_reader {
    input_path: "PATH_TO_BE_CONFIGURED/mscoco_val.record-?????-of-00010"
  }
  label_map_path: "PATH_TO_BE_CONFIGURED/mscoco_label_map.pbtxt"
  shuffle: false
  num_readers: 1
}
`
}

export default function HorizontalNonLinearAlternativeLabelStepper(props) {
  const classes = useStyles()
  const [completed, setCompleted] = React.useState(new Set())
  const [skipped, setSkipped] = React.useState(new Set())
  const [labelMapCategories, setLabelMapCategories] = React.useState([])
  
  const [modelArchitecture, setModelArchitecture] = React.useState("ssd_mobilenet_v1_coco")
  const [numCategories, setNumCategories] = React.useState(labelMapCategories.length)
  const [outWidth, setOutWidth] = React.useState(300)
  const [outHeight, setOutHeight] = React.useState(300)
  const [batchSize, setBatchSize] = React.useState(24)
  const [optimizer, setOptimizer] = React.useState("rms_prop_optimizer")
  const [pretrained, setPretrained] = React.useState(false)

  const steps = [{
    stepperTitle: 'Create TensorFlow records',
    // content: <UploadAnnotations />,
    header: "h3. Heading",
    description: "h4. Heading",
    content: <div>
      <Grid
        className={classes.root}
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={10}
      >
        <Grid item>
          <CodeSnippetCard width={500} height={550} title="XML" subheader="PASCAL VOC Format" language="xml" code={pascalVOCExample} description={pascalVOCDescription} />
        </Grid>
        <Grid item>
          <CodeSnippetCard width={500} height={550} title="LabelMap" subheader=".pbtxt" language="json" code={labelMapExample} description={labelMapDescription} />
        </Grid>
      </Grid>
      <Typography variant="h6" component="p">
        Down below you can create the necessary TF Record files. For that you need to specify all categories of your objects. Also be sure that your annotation files have the correct format and are in the correct folder.
      </Typography>
      <LabelMapChips labelMapCategories={labelMapCategories} onChange={setLabelMapCategories} />
    </div>,
    action: <CreateTFRecord labelMapCategories={labelMapCategories} disabled={labelMapCategories.length === 0} onComplete={handleComplete} />
  }, {
    stepperTitle: 'Create train configuration file',
    header: "h3. Heading",
    description: "h4. Heading",
    content: <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <CodeSnippetCard
          width={800}
          height={750}
          codeHeight={600}
          title="Configuration for Training"
          subheader="JSON Format"
          language="json"
          code={getConfig(modelArchitecture, pretrained, numCategories, outWidth, outHeight, batchSize, optimizer)}
          description={pascalVOCDescription}
        />
      </Grid>
      <Grid item>
        <ControlledExpansionPanels
          modelArchitecture={modelArchitecture}
          onSelectModelArchitecture={setModelArchitecture}
          pretrained={pretrained}
          onSwitchPretrained={setPretrained}
          numCategories={numCategories}
          onChangeNumCategories={setNumCategories}
          outWidth={outWidth}
          onChangeOutWidth={setOutWidth}
          outHeight={outHeight}
          onChangeOutHeight={setOutHeight}
          batchSize={batchSize}
          onChangeBatchSize={setBatchSize}
          optimizer={optimizer}
          onSelectOptimizer={setOptimizer}
        />
      </Grid>
    </Grid>,
    action: <Button onClick={handleComplete} className={classes.button}>Complete</Button>
  }, {
    stepperTitle: 'Start training',
    header: "h3. Heading",
    description: "h4. Heading",
    content: null,
    action: <Button disabled={!allStepsCompleted()} className={classes.button}>Start Training</Button>
  }]

  function totalSteps() {
    return 3
  }

  function skippedSteps() {
    return skipped.size
  }

  function allStepsCompleted() {
    return completed.has(0) && completed.has(1)
  }

  function isLastStep() {
    return parseInt(props.match.params.id) === totalSteps()
  }

  function handleNext() {
    nextPath(`/steps/${(parseInt(props.match.params.id) % totalSteps()) + 1}`)
  }

  function handleBack() {
    nextPath(`/steps/${parseInt(props.match.params.id) - 1}`)
  }

  function nextPath(path) {
    props.history.push(path);
  }

  const handleStep = step => () => {
    nextPath(`/steps/${step}`)
  }

  function handleComplete() {
    const newCompleted = new Set(completed)
    newCompleted.add(parseInt(props.match.params.id))
    setCompleted(newCompleted)

    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext()
    }
  }

  function handleReset() {
    nextPath(`/steps/1`)
    setCompleted(new Set())
    setSkipped(new Set())
  }

  function isStepComplete(step) {
    return completed.has(step)
  }


  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
    >
      <Grid item>
        <Stepper alternativeLabel nonLinear activeStep={parseInt(props.match.params.id) - 1}>
          {steps.map((data, index) => {
            const stepProps = {}
            const buttonProps = {}

            return (

              <Step key={data.stepperTitle} {...stepProps}>
                <StepButton
                  onClick={handleStep(index + 1)}
                  completed={isStepComplete(index + 1)}
                  {...buttonProps}
                >
                  {data.stepperTitle}
                </StepButton>
              </Step>

            )
          })}
        </Stepper>
      </Grid>

      <Typography variant="h3" component="h2">{steps[parseInt(props.match.params.id) - 1].header}</Typography>
      <Typography variant="h5" component="h4">{steps[parseInt(props.match.params.id) - 1].description}</Typography>

      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
      >
        {steps[parseInt(props.match.params.id) - 1].content}

        <div>
          <Button disabled={parseInt(props.match.params.id) - 1 === 0} onClick={handleBack} className={classes.button}>
            Back
                </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
          >
            Next
            </Button>
          {steps[parseInt(props.match.params.id) - 1].action}
        </div>
      </Grid>

    </Grid>
  )
}
