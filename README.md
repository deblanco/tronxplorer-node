# tronxplorer-node


To run this side of the project following requirements need to be fullfilled:
```
OS: Linux or unix derivatives
Node.js >= 8 LTS
MongoDB 4 and one user Read-Write
```

## Installation steps:

Clone Github project
```
$ git clone git@github.com:deblanco/tronxplorer-node.git; cd tronxplorer-node
```

Install dependencies 
```
$ npm install
```

Rename ```.env.example``` and fill ```.env``` file with your parameters: Mongo host, user, password, Tron node
```
$ mv .env.example .env; vi .env
```

Run project (we recommend [pm2](https://github.com/Unitech/pm2) to manage node processes)
```
$ npm run start
$ npm run blockchain
```

### Solidity nodes (TEST)

```
#soliditynode = {
#  ip.list = [
#    "39.105.66.80:50051",
#    "47.254.39.153:50051",
#    "47.89.244.227 :50051",
#  ]
#}
```