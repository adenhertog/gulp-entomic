through = require "through2"
gutil = require "gulp-util"
PluginError = gutil.PluginError
Entomic = require "entomic"
vinylFile = require "vinyl-file"
path = require "path"
defaults = require "./config"

PLUGIN_NAME = "gulp-entomic"

gulpEntomic = (options) -> 
	setDefaults = -> 
		options = options || defaults
		options.scriptPath = options.scriptPath || defaults.scriptPath
		options.stylePath = options.stylePath || defaults.stylePath
		options.assetPath = options.assetPath || defaults.assetPath

	setDefaults()

	entomic = new Entomic(options)

	getFiles = (resources, outputDir) -> 
		result = []
		for resource in resources
			filepath = path.join options.componentPath, resource.library, resource.component || "", resource.path
			file = vinylFile.readSync filepath
			filename = path.basename resource.path
			file.path = path.join outputDir, resource.library, resource.component || "", filename
			result.push file

		return result

	stream = through.obj (file, enc, cb) -> 
		if file.isStream()
			this.emit "error", new PluginError(PLUGIN_NAME, "Streams are not supported")
			return cb()

		if file.isBuffer()
			contents = file.contents.toString "utf8"
			rendered = entomic.transform contents

			file.contents = new Buffer(rendered.html)
			
			this.push script for script in getFiles rendered.scripts, options.scriptPath
			this.push style for style in getFiles rendered.styles, options.stylePath
			this.push asset for asset in getFiles rendered.assets, options.assetPath

		this.push file

		cb()

	return stream

module.exports = gulpEntomic