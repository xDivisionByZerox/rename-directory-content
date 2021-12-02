import { readdirSync, renameSync, statSync } from 'fs';
import { extname, isAbsolute, join, normalize } from 'path';

async function renameDirectory(directory: string) {
  directory = directory.replace(/(\/\/|\\\\)/g, '/');
  const directoryName = getLastPartOfPath(directory);
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
      const newPath = getFullFilePath(directory, `${directoryName}_${index + extension}`);

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
  const directory = process.argv[2];

  const errorText = [
    'Please provide an absolute directory that you want to rename as CLI argument.',
    'Example:',
    'npm run start "C:/users/my-user-name/pictures/cats"'
  ].join('\n');
  if (typeof directory !== 'string') {
    throw new Error(errorText);
  }

  if (!isAbsolute(directory)) {
    throw new Error(errorText);
  }

  await renameDirectory(directory);
})().catch((error) => {
  if(error instanceof Error) {
    process.stdout.write(error.message);
  } else if (typeof error === 'string') {    
    process.stdout.write(error);
  } else {
    console.log(error);
  }
});
