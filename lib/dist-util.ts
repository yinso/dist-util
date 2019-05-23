import * as Promise from 'bluebird';
import * as fs from 'fs-extra-promise';
import * as path from 'path';

export interface RunOptions {
    distFolder ?: string;
}

export function run(options : RunOptions) : Promise<void> {
    let distFolderPath = normalizeDistFolderPath(options.distFolder);
    return fs.mkdirpAsync(distFolderPath)
        .then(() => copyPackageJson(distFolderPath))
        .then(() => copyToDistFolderIfExists('package-lock.json', distFolderPath))
        .then(() => copyToDistFolderIfExists('.npmignore', distFolderPath));
}

function normalizeDistFolderPath(distFolder : string = 'dist') {
    if (path.isAbsolute(distFolder))
        return distFolder;
    else
        return path.join(process.cwd(), distFolder);
}

function copyToDistFolderIfExists(fileName : string, distFolderPath : string) : Promise<void> {
    return fs.copyAsync(path.join(process.cwd(), fileName), path.join(distFolderPath, fileName))
        .catch((e) => {
            if (e.code === 'ENOENT') {
                return;
            }
            throw e;
        })
}

function copyPackageJson(distFolderPath : string) : Promise<void> {
    let distFolderName = path.basename(distFolderPath);
    return parsePackageJson()
        .then((packageJson) => transformPackageJson(packageJson, distFolderName))
        .then((packageJson) => JSON.stringify(packageJson, null, 2))
        .then((data) => fs.writeFileAsync(path.join(distFolderPath, 'package.json'), data, 'utf8'))
}

interface PackageJson {
    name: string;
    version: string;
    description: string;
    main: string;
    typings ?: string;
    bin ?: string | {[key: string]: string};
    scripts ?: {[key: string]: string};
    repository: {[key: string]: string};
    keywords: string[];
    author: string;
    license: string;
    bugs: {[key: string]: string};
    homepage: string;
    dependencies: {[key: string]: string};
    devDependencies: {[key: string]: string};
}

function parsePackageJson() : Promise<PackageJson> {
    let packageJsonPath = path.join(process.cwd(), 'package.json');
    return fs.readFileAsync(packageJsonPath, 'utf8')
        .then((data) => JSON.parse(data) as PackageJson)
}

function transformPackageJson(packageJson : PackageJson, distFolderName : string) : PackageJson {
    // what do we care about?
    // in main, typings, bin, and scripts, strip out distFolder if it exists...
    if (typeof(packageJson.main) === 'string') {
        packageJson.main = stripDistFolder(packageJson.main, distFolderName)
    }
    if (typeof(packageJson.typings) === 'string') {
        packageJson.typings = stripDistFolder(packageJson.typings, distFolderName)
    }
    if (typeof(packageJson.bin) === 'string') {
        packageJson.bin = stripDistFolder(packageJson.bin, distFolderName)
    } else if (packageJson.bin instanceof Object) {
        packageJson.bin = reduceDistFolder(packageJson.bin, distFolderName);
    }
    if (packageJson.scripts instanceof Object) {
        packageJson.scripts = reduceDistFolder(packageJson.scripts, distFolderName);        
    }
    return packageJson;
}

export function stripDistFolder(value : string, distFolderName : string) : string {
    return value.replace(`${distFolderName}/`, '');
}

export function reduceDistFolder(value : {[key: string]: string}, distFolderName: string) : {[key: string]: string} {
    return Object.keys(value).reduce((acc, key) => {
        acc[key] = stripDistFolder(value[key], distFolderName);
        return acc;
    }, {} as {[key: string]: string});
}
