def main():
    print('starting ...')
    for i in range(10000000):
        i * 2
    print('middle')
    for i in range(10000000):
        i * 2
    print('middle2')
    for i in range(10000000):
        i * 2
    print('end')

if __name__ == '__main__':
    main()