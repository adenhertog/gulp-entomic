var Entomic, PLUGIN_NAME, PluginError, defaults, gulpEntomic, gutil, path, through, vinylFile;

through = require("through2");

gutil = require("gulp-util");

PluginError = gutil.PluginError;

Entomic = require("entomic");

vinylFile = require("vinyl-file");

path = require("path");

defaults = require("./config");

PLUGIN_NAME = "gulp-entomic";

gulpEntomic = function(options) {
  var entomic, getFiles, setDefaults, stream;
  setDefaults = function() {
    options = options || defaults;
    options.scriptPath = options.scriptPath || defaults.scriptPath;
    options.stylePath = options.stylePath || defaults.stylePath;
    return options.assetPath = options.assetPath || defaults.assetPath;
  };
  setDefaults();
  entomic = new Entomic(options);
  getFiles = function(resources, outputDir) {
    var file, filename, filepath, i, len, resource, result;
    result = [];
    for (i = 0, len = resources.length; i < len; i++) {
      resource = resources[i];
      filepath = path.join(options.componentPath, resource.library, resource.component || "", resource.path);
      file = vinylFile.readSync(filepath);
      filename = path.basename(resource.path);
      file.path = path.join(outputDir, resource.library, resource.component || "", filename);
      result.push(file);
    }
    return result;
  };
  stream = through.obj(function(file, enc, cb) {
    var asset, contents, i, j, k, len, len1, len2, ref, ref1, ref2, rendered, script, style;
    if (file.isStream()) {
      this.emit("error", new PluginError(PLUGIN_NAME, "Streams are not supported"));
      return cb();
    }
    if (file.isBuffer()) {
      contents = file.contents.toString("utf8");
      rendered = entomic.transform(contents);
      file.contents = new Buffer(rendered.html);
      ref = getFiles(rendered.scripts, options.scriptPath);
      for (i = 0, len = ref.length; i < len; i++) {
        script = ref[i];
        this.push(script);
      }
      ref1 = getFiles(rendered.styles, options.stylePath);
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        style = ref1[j];
        this.push(style);
      }
      ref2 = getFiles(rendered.assets, options.assetPath);
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        asset = ref2[k];
        this.push(asset);
      }
    }
    this.push(file);
    return cb();
  });
  return stream;
};

module.exports = gulpEntomic;
