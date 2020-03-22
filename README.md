# Simple-p2p-blockchain
Its so simple dude

## Features:
- budget node discovery
- noisy ass prints
- web server visualisation of blockchain
- code stolen from everywhere
- does not do cryptocurrency
- every node is both miner and a fullnode
- 100% self-praise worthy

## Instructions:
##### Compile the go file and run it as such 
Terminal 1
```shell
go build main.go
main.exe -h <your internal ip> -p <a port of your choice>
```

Terminal 2
```shell
go build main.go
main.exe -h <your internal ip> -p <a port of your choice> <terminal1 ip + port>
```

### Example
- Terminal 1
```shell
go build main.go
main.exe -h 192.168.1.2 -p 4444
```

- Terminal 2
```shell
go build main.go
main.exe -h 192.168.1.3 -p 4445
```
