# sarif-converter

[![codecov](https://codecov.io/gh/khorwood/sarif-converter/branch/main/graph/badge.svg)](https://codecov.io/gh/khorwood/sarif-converter)

> Converts output from security tools to SARIF format for GitHub Code Scanning alerts

## Supported Input Formats

- checkov.io output when using `-o json` flag

## Usage

checkov.io conversion:

```yml
- uses: khorwood/sarif-converter@main
  with:
    type: checkov
    input: ./checkov.json
    output: ./checkov.sarif
```
