# Pratham 2.0

## Host App

### teachers

Next JS, run:

```sh
nx dev teachers --port=3001 --verbose
```

### admin

Next JS, run:

```sh
nx dev admin-app-repo --port=3002 --verbose
```

##

## Micro Frontend List

### authentication

Next JS, run:

```sh
nx dev authentication --port=4101 --verbose
```

basePath : `http://localhost:4101/authentication/`
Port : `4101`

### scp-teacher-repo

Next JS, run:

```sh
nx dev scp-teacher-repo --port=4102 --verbose
```

basePath : `http://localhost:4102/scp-teacher-repo/`
Port : `4102`

### youthNet

Next JS, run:

```sh
nx dev youthNet --port=4103 --verbose
```

basePath : `http://localhost:4103/youthnet/`
Port : `4103`

### workspace

Next JS, run:

```sh
nx dev workspace --port=4104 --verbose
```

basePath : `http://localhost:4104/workspace/`
Port : `4104`

##

## NX Command

### View Nx Graph

` nx graph`

### Build All Project

`npx nx run-many --target=build --all`

### Install NX Globally

`npm install -g nx`

## Notes

## use shared library in any project

```sh
import { SharedLib } from '@shared-lib';
```
