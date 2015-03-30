entomic = require "../"
should = require "should"
gutil = require "gulp-util"
fs = require "fs"
path = require "path"
stream = require "stream"
require "mocha"

createFile = (filepath, contents) -> 
	base = path.dirname filepath
	return new gutil.File
		path: filepath
		base: base
		cwd: path.dirname base
		contents: contents

describe "gulp-entomic", -> 
	describe "entomic()", -> 
		before -> 
			this.testData = (expected, newPath, done) ->
				return (newFile) -> 
					this.expected = expected
					this.newPath = newPath

					should.exist newFile
					should.exist newFile.path
					should.exist newFile.relative
					should.exist newFile.contents
					newFile.path.should.equal this.path
					newFile.relative.should.equal path.basename(this.newPath)
					String(newFile.contents).should.equal this.expected

					if done and !expected.length then done.call this


		xit "should transform a basic HTML file", (done) -> 
			filepath = "/test/basic.html"
			contents = new Buffer '''<html>
		<body>
			<contact-details>
				<phone>123</phone>
			</contact-details>
		</body>
	</html>'''

			expected = '''<html>
	<body>
		<div class="contact-details"><div class="phone">123</div></div>
	</body>
</html>'''
			opts = { componentPath: "test" }
			entomic(opts)
				.on "error", done
				.on "data", this.testData(expected, path.normalize("/test/basic.html"), done)
				.write(createFile(filepath, contents))