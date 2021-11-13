# vint shipping rules

## What?

This repository contains source for _Vinted, UAB_ homework assignment.
The full details of the assignment can cant be viewed [here](backend-homework-assignment.md)

### tl;dr

It's an (CLI) application that read input file, serializes it, applies bushiness (shipping) rules to each line and outputs it standard output.

## How?

### Running the program

There are couple options to run the program:

- [Using `node.js` command.](#using-nodejs-command)
- [Using `ts-node` command.](#using-ts-node-or-npm)
- [Using `npm` run script command.](#using-ts-node-or-npm). This (`npm run start`) method does not allow running custom scripts (simply).
- [Using `binary executable` with files attacked to this repository or build from source](#using-binary)
- [Running tests](#running-tests)

#### Prerequisites for nodejs

The application was developed and tested using node.js version 12.
Make sure you have it on your system with `node --version` command.
Also npm should be present (`npm --version`).

One can install binaries from [official website](https://nodejs.org/en/download/).

#### Using nodejs

See if [node.js prerequisites](#prerequisites-for-nodejs) are fulfilled to continue with this
method.

##### Installing the dependencies

To install dependencies (for building and testing the source) use `npm i`

#### Building the application

Build the application by issuing `npm run build` command.
If should see two lines of text in your terminal/console/shell. Proceed to [Running the application](#running-the-application)
If you see more - bad luck. The build didn't get trough. Follow the red errors and try again.

#### Running the application

##### Defaults

To run application with default values for inputs issue -

```
node build/init.js
```

Output should appear - it's the result of working program.

##### Different file

To run application with non default values (eg. to provide new input file)
issue command

```
node build/init.js path/to/file
```

The file should be placed in the root folder of the project.
It's possible that it works with paths relative to system (key word - possible).

#### Using ts-node or npm

Using ts-node allows to skip traspaling step (from .ts to .js) and enables features as debugging with breakpoints etc.
To continue see if [node.js prerequisites](#prerequisites-for-nodejs) are fulfilled to continue with this
method. [dependencies should be installed](#installing-the-dependencies) as well.

#### Running the application

##### Defaults

To run application with default values for inputs issue -

```
ts-node build/init.js
```

or

```
npm run start
```

if fails - try [running node](using-nodejs)

##### Different file

```
ts-node build/init.js path/to/file
```

#### Using binary

One can download binary release from github releases.
They ar unsigned so macOS could be a problem - unless you sign them with your keys using platform tools (batteries not included here).
Windows executable (and others) works by executing it from command line

```
./vint-shipping-rules-(linux,macos,win.exe) (/path/to/file)
```

##### Building binary package yourself

To continue see if [node.js prerequisites](#prerequisites-for-nodejs) are fulfilled to continue with this
method. [dependencies should be installed](#installing-the-dependencies) as well.
Then run `npm run package` and look for the contents inside bin folder. Again macOS and maybe linux user has to do more to use the binary - sign it with developer keys or `chamod +x` (haven't tested it yet).

#### Running tests

Where are they running?
To continue see if [node.js prerequisites](#prerequisites-for-nodejs) are fulfilled to continue with this
method. [dependencies should be installed](#installing-the-dependencies) as well.
Then run

```
npm run test
```

### Developing the application further

If by any chance someone wants to develop it further - fear no more. It's possible. You can do it. Nike.

#### High level application source design choices

Application source is written using objective programming patterns and principles such as SOLID (some means dependency injection), DRY (means reusable code) and KISS (no not kiss).
With a banana you get the whole jungle.

Oh. and it's written in TypeScript and using node.js as runtime.

That would set you off for the -

#### _FOLDER STRUCTURE_

So each class has it's own tiny folder. It doesn't mean there could be more or less folders in the `./src`
inside every little folder one can find even smaller folder called `tests` where tests files lives.

#### shared folder

(It's only between us(classes)) so there are some coupling that you cannot live without. Most of the class-files that are shared between other class-files lives there.

#### rules folder

Should contain rulers but it's kinda also controllers. Here the class-files responsible for applying rules on the inputs resides.

#### repository folder

The most dynamic of them all in terms of memory. Some say they remember when Pigeon post system was still a thing. Class-files contains memory and it's manipulation methods.
Everyone here is singleton.

#### enum folder

Tenants in this folder doesn't change a lot.

#### decorators folders

The most innovative ones. Efficiency. Development time savings. Reusable. Factory Methods?

### Class types

Here we will cover some shared class-objects responsibilities.

#### VintShippingRules class

The main entry class that abstracts the file handling, provides defaults, takes care for the sequence of how `Shipment` takes care of the inputs and outputs to the world.

#### Shipment class

The working horse that orchestrates the data pipeline and has the methods to decide what's the output gonna be and how it will look.

#### ShippingCostRule class

The one that's abstract. And for the sanity All shipment rules (controllers) must implement it so they can be decorated with `@ShippingRule`

#### ShippingRulesStorage class

Stores all decorated `@ShippingRule(s)`. Also dependency injection manager. Also a singleton.

### Adding new shipping rule

See [Adding new shipping rule](src/rules/adding-new-shippment-rule.md)

## Why?

```

```
