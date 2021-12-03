# rename-directory-content
Rename all files in a directory based on the directory name. Build in NodeJS (because I can).

# Installation

1. Clone.
```bash
  git clone https://github.com/xDivisionByZerox/rename-directory-content.git
```

2. Install dependencies (for building the project).
```bash
  npm install
```

3. Build the project.
```bash
  npm run build
``` 

# Usage

Run the script.
```bash
  npm run start [directory-you-want-to-rename]
```

Example:
```bash
  npm run start C:/photos/highlights
```

The script will rename all files in this directory based on the directory name. In this example all files in the directory `C:/photos/highlights` will be renamed to `highlights_[index].[file-extension]`.

# Add a custom rename base name

If you don't want to rename all files in a directory based on the directory name you can provide a custom name by adding the `--name "your-custom-name"` to the CLI. Please not that if you run the script via the `npm run start` script you need to pass an extra `--` before your argument for this to work.

Example:
```bash
  npm run start -- C:/photos/highlights --name picture
```

This will rename all files in the directory `C:/photos/highlights` to `picture_[index].[file-extension]`.
