# promise-polyfill2 [![Build Status](https://img.shields.io/circleci/project/github/Army-U/promise-polyfill2.svg?style=flat-square)](https://circleci.com/gh/Army-U/promise-polyfill2) [![Version](https://img.shields.io/npm/v/promise-polyfill2.svg?style=flat-square)](https://www.npmjs.com/package/promise-polyfill2)

### Introduction

Yet another lightweight polyfill for Promise which is written by TypeScript, Follow the Promise/A+ specification.

### Install

```bash
$ npm i promise-polyfill2 -S
```

## Usage

```js
// In Browser
import { Promise }, polyfill from 'promise-polyfill2'
polyfill()

// In Node
require('promise-polyfill2')()
```

### License

MIT License

Copyright (c) 2017 Army-U

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.