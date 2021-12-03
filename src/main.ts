import { readdirSync, renameSync, statSync } from 'fs';
import { extname, isAbsolute, join, normalize } from 'path';

interface IArgs {
  directory: string;
  name?: string;
}

function getArgs(): IArgs {
  const [_nodeBin, _cwd, ...args] = process.argv;
  const nameIndex = args.indexOf('--name');
  let name: undefined | string = undefined;
  if (nameIndex > -1) {
    name = args[nameIndex + 1];
    args.splice(nameIndex, 2);
  }

  if (name !== undefined) {
    // remove invalid file name characters for windows
    // based on https://gist.github.com/doctaphred/d01d05291546186941e1b7ddc02034d3
    name = name.replace(/"|'|<|>|:|\/|\\|\||\?|\*/g, '');
  }

  const errorText = [
    'Please provide an absolute directory that you want to rename as CLI argument.',
    'Example:',
    'npm run start "C:/users/my-user-name/pictures/cats"'
  ].join('\n');
  // only argument left in array should be directory argument
  const directory = args.pop();
  if (typeof directory !== 'string') {
    throw new Error(errorText);
  }

  if (!isAbsolute(directory)) {
    throw new Error(errorText);
  }

  return { directory, name };
}

async function renameDirectory(directory: string, renameBaseName?: string) {
  directory = directory.replace(/(\/\/|\\\\)/g, '/');
  if (renameBaseName === undefined) {
    renameBaseName = getLastPartOfPath(directory);
  }

  const fileNames = readdirSync(directory);
  const indexLength = fileNames.length.toString().length;

  let renamed = 0;
  try {
    for (const fileName of fileNames) {
      const oldPath = getFullFilePath(directory, fileName);
      if (!statSync(oldPath).isFile()) {
        continue;
      }

      const index = renamed.toString().padStart(indexLength, '0');
      const extension = extname(fileName);
      const newPath = getFullFilePath(directory, `${renameBaseName}_${index + extension}`);

      renameSync(oldPath, newPath);
      renamed++;
    }
  } catch (error) {
    console.log(error);
  }

  console.log('Successfully renamed', renamed, 'of', fileNames.length);
}

function getFullFilePath(directory: string, fileName: string) {
  return normalize(join(directory, fileName));
}

function getLastPartOfPath(path: string): string {
  const pathParts = path.split('/');
  const pathName = pathParts[pathParts.length - 1];
  if (pathName === undefined) {
    throw new Error(`unable to find name of path = ${path}`);
  }

  return pathName;
}

(async () => {
  const { directory, name } = getArgs();
  await renameDirectory(directory, name);
})().catch((error) => {
  if (error instanceof Error) {
    process.stdout.write(error.message);
  } else if (typeof error === 'string') {
    process.stdout.write(error);
  } else {
    console.log(error);
  }
});
