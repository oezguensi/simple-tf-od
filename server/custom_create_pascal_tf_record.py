from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import hashlib
import io
import logging
import os
import argparse
import PIL.Image
import tensorflow as tf
import json

from lxml import etree
from os.path import join
from glob import glob

parser = argparse.ArgumentParser()
parser.add_argument('--data_set', type=str)
parser.add_argument('--imgs_dir', type=str)
parser.add_argument('--annotations_dir', type=str)
parser.add_argument('--label_map_dict', type=str)
parser.add_argument('--out_dir', type=str)
FLAGS = parser.parse_args()

def int64_feature(value):
  return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))

def int64_list_feature(value):
  return tf.train.Feature(int64_list=tf.train.Int64List(value=value))

def bytes_feature(value):
  return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))

def bytes_list_feature(value):
  return tf.train.Feature(bytes_list=tf.train.BytesList(value=value))

def float_list_feature(value):
  return tf.train.Feature(float_list=tf.train.FloatList(value=value))

def recursive_parse_xml_to_dict(xml):
  """Recursively parses XML contents to python dict.

  We assume that `object` tags are the only ones that can appear
  multiple times at the same level of a tree.

  Args:
    xml: xml tree obtained by parsing XML file contents using lxml.etree

  Returns:
    Python dictionary holding XML contents.
  """
  if not xml:
    return {xml.tag: xml.text}
  result = {}
  for child in xml:
    child_result = recursive_parse_xml_to_dict(child)
    if child.tag != 'object':
      result[child.tag] = child_result[child.tag]
    else:
      if child.tag not in result:
        result[child.tag] = []
      result[child.tag].append(child_result[child.tag])
  return {xml.tag: result}

def dict_to_tf_example(data, img_file, label_map_dict, ignore_difficult_instances=False):

    with tf.gfile.GFile(img_file, 'rb') as fid:
        encoded_jpg = fid.read()
    encoded_jpg_io = io.BytesIO(encoded_jpg)
    image = PIL.Image.open(encoded_jpg_io)
    if image.format != 'JPEG':
        raise ValueError('Image format not JPEG')
    key = hashlib.sha256(encoded_jpg).hexdigest()

    width = int(data['size']['width'])
    height = int(data['size']['height'])

    xmin = []
    ymin = []
    xmax = []
    ymax = []
    classes = []
    classes_text = []
    truncated = []
    poses = []
    difficult_obj = []
    if 'object' in data:
        for obj in data['object']:
            difficult = bool(int(obj['difficult']))
            if ignore_difficult_instances and difficult:
                continue

            difficult_obj.append(int(difficult))

            xmin.append(float(obj['bndbox']['xmin']) / width)
            ymin.append(float(obj['bndbox']['ymin']) / height)
            xmax.append(float(obj['bndbox']['xmax']) / width)
            ymax.append(float(obj['bndbox']['ymax']) / height)
            classes_text.append(obj['name'].encode('utf8'))
            classes.append(label_map_dict[obj['name']])
            truncated.append(int(obj['truncated']))
            poses.append(obj['pose'].encode('utf8'))

    example = tf.train.Example(features=tf.train.Features(feature={
        'image/height': int64_feature(height),
        'image/width': int64_feature(width),
        'image/filename': bytes_feature(data['filename'].encode('utf8')),
        'image/source_id': bytes_feature(data['filename'].encode('utf8')),
        'image/key/sha256': bytes_feature(key.encode('utf8')),
        'image/encoded': bytes_feature(encoded_jpg),
        'image/format': bytes_feature('jpeg'.encode('utf8')),
        'image/object/bbox/xmin': float_list_feature(xmin),
        'image/object/bbox/xmax': float_list_feature(xmax),
        'image/object/bbox/ymin': float_list_feature(ymin),
        'image/object/bbox/ymax': float_list_feature(ymax),
        'image/object/class/text': bytes_list_feature(classes_text),
        'image/object/class/label': int64_list_feature(classes),
        'image/object/difficult': int64_list_feature(difficult_obj),
        'image/object/truncated': int64_list_feature(truncated),
        'image/object/view': bytes_list_feature(poses),
    }))
    return example


def main():
    try:
      # print('Creating tf records ...')
      writer = tf.python_io.TFRecordWriter(join(FLAGS.out_dir, FLAGS.data_set + '.record'))
      img_files = [f for f in glob(join(FLAGS.imgs_dir, '*')) if f.endswith('jpg') or f.endswith('png')]
      annotation_files = glob(join(FLAGS.annotations_dir, '*xml'))

      for idx, (img_file, annotation_file) in enumerate(zip(img_files, annotation_files)):
          if (((idx + 1) // len(annotation_files)) * 100) % 5 == 0:
              print('Loaded {} percent of annotations'.format(((idx + 1) // len(annotation_files)) * 100))

          for i in range(10000):
            i * 2

          with tf.gfile.GFile(annotation_file, 'r') as fid:
              xml_str = fid.read()
          xml = etree.fromstring(xml_str)
          data = recursive_parse_xml_to_dict(xml)['annotation']

          label_map_dict = json.loads(FLAGS.label_map_dict)
          tf_example = dict_to_tf_example(data, img_file, label_map_dict)
          writer.write(tf_example.SerializeToString())

      # print('Finished running script: Created tf records!')
      writer.close()
    except Exception as e:
      print('Exception occured:', e)

if __name__ == '__main__':
    main()