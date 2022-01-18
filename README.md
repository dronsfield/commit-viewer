# Commit Viewer

For jogging your memory before standup.

View past commits across multiple repositories via some nicely formatted HTML.

## Installation

```
npm install && npm install -g .
```


## Example usage

```
commit-viewer -r "~/foo,~/bar" -t "2 weeks" -a "dronsfield"
```

## Options

| Option | Description |
| --- | --- |
| -repos, -r |             A comma-separated list of repository paths to show commits from. |
| -author, -a |            A git user to filter commits from. |
| -time, -t |              A time span dictating how far back to look for commits. Uses the moment library to parse, accepts values such as "4 days", "2 weeks", "3 months", etc. |
| -colors, -c |            A comma-separated list of color hex values to use for text. Each repo (if multiple) will use different color text for the sake of clarity. |
| -background, -bg, -b |   A color hex value for the background. |
| -port, -p |              Port to serve the generated HTML on. |
