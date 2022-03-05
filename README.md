# Solverdle

This is a silly wordle solver that helps me play the game with my kids.

There's two ways to use it:

- [Visit the react app on GitHub Pages](https://kara-ryli.github.io/solverdle/)
- Use the command-line tool

## Command-line usage

The command line is a little wonky, but it works:

```sh
./bin/solve \
  -b c=0:o=0:a=0:e=1:t=0:u=0 \
  -y e=0,2:n=1,4:r=4 \
  -g r=1:i=2:n=3:e=4
```

Where:

- `-b` for black squares, a colon-separated list of key-value pairs, where the key is the letter and the value is the number of yellow or green squares that contain the letter
- `-y` for yellow squares, a colon-separated list of key-value pairs, where the key is the letter and the value is a comma-separated list of zero-based indices
- `-g` for green squares, a colon-separated list of key-value pairs, where the key is the letter and the value is a comma-separated list of zero-based indices
