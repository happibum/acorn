var fs = require("fs"), path = require("path")
var stream = require("stream")

var browserify = require("browserify")
var babel = require('babel-core')
var babelify = require("babelify").configure({loose: "all"})

process.chdir(path.resolve(__dirname, ".."))

browserify({standalone: "acorn"})
  .plugin(require('browserify-derequire'))
  .transform(babelify)
  .require("./src/index.js", {entry: true})
  .bundle()
  .on("error", function (err) { console.log("Error: " + err.message) })
  .pipe(fs.createWriteStream("dist/acorn.js"))

browserify({standalone: "acorn.loose"})
  .plugin(require('browserify-derequire'))
  .transform(babelify)
  .require("./src/loose/index.js", {entry: true})
  .bundle()
  .on("error", function (err) { console.log("Error: " + err.message) })
  .pipe(fs.createWriteStream("dist/acorn_loose.js"))

browserify({standalone: "acorn.walk"})
  .plugin(require('browserify-derequire'))
  .transform(babelify)
  .require("./src/walk/index.js", {entry: true})
  .bundle()
  .on("error", function (err) { console.log("Error: " + err.message) })
  .pipe(fs.createWriteStream("dist/walk.js"))

babel.transformFile("./src/bin/acorn.js", function (err, result) {
  if (err) return console.log("Error: " + err.message)
  fs.writeFile("bin/acorn", result.code, function (err) {
    if (err) return console.log("Error: " + err.message)

    // Make bin/acorn executable
    if (process.platform === 'win32')
      return
    var stat = fs.statSync("bin/acorn")
    var newPerm = stat.mode | parseInt('111', 8)
    fs.chmodSync("bin/acorn", newPerm)
  })
})
