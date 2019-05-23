# `dist-util` - A simple tool to publish npm packages from the "dist" folder.

`dist-util` basically does the following:

* copy `package.json` to the dist folder, and strip and dist folder reference from `main`, `typings`, `bin`, and `scripts`.
* copy `package-lock.json` (if exists) to the dist folder.
* copy `.npmignore` (if exists) to the dist folder.

`dist-util` assumes the following:

* You have a compilation process to "compile" / "transform" files from your src folders into your dist folders.
* In the source package.json, you refer to dist folder for development.
* `dist-util` doesn't care whether you test from the src folders or the dist folders.

## Install

```
npm install -g dist-util
```

## Usage

In the root of the package you want to publish, run:

```
dist-util [-d|--dist-folder <the name fo the "dist" folder>]
```

## Usual Workflow

* Develop in the root folder.
* Compile into the dist folder.
* `npm link` from the dist folder.
* Run `dist-util` when ready.
* cd dist folder and npm publish.
