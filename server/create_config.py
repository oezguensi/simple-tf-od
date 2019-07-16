import argparse
import json

parser = argparse.ArgumentParser()
parser.add_argument('--text', type=str)
FLAGS = parser.parse_args()

def main():
    with open('train.config', 'w') as f:
        f.writelines(FLAGS.text)


if __name__ == '__main__':
    main()