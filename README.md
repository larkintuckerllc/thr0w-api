README v0.0.1 / 01 APRIL 2016

# Thr0w API

## Introduction

The Thr0w Project is about building inexpensive and manageable interactive (or
not) video walls using commodity hardware, web technologies, and open source
software. The key to this solution is having one computer behind each screen
networked to a single computer acting as a server. With this design, the
splitting and synchronization of content is accomplished through software.

This repository provides the project's Thr0w (Node.js) API for the project's
required Thr0w Server implementation available at:

https://github.com/larkintuckerllc/thr0w-server

## Installation

```
npm install thr0w-api
```

## Usage

TODO

The API reference is available at:

http://rawgit.com/larkintuckerllc/thr0w-api/master/doc/index.html

## Contributing

Submit bug or enhancement requests using the Github *Issues* feature. Submit
bug fixes or enhancements as pull requests. Specifically, follow GitHub's
document *Contributing to Open Source on GitHub*.

<https://guides.github.com/activities/contributing-to-open-source/>

The JavaScript is to pass JSHint with the default configuration (with the
*node* environment). The JavaScript is to pass JSCS with the Google preset.

* <http://jshint.com/>
* <http://jscs.info/>

The JavaScript is to comply with the following style guide.

* Use named functions instead of passing an anonymous function in as a callback.
* Define functions in the scope where they are used.
* Place functions declarations at the end of the scope; rely on hoisting.

The exposed JavaScript classes (or objects) are to be documented using YUIDoc.

http://yui.github.io/yuidoc/

## Credits

TODO

## Contact

General questions and comments can be directed to <mailto:john@larkintuckerllc.com>.

## License

This project is licensed under GNU General Public License.
