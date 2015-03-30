# gulp-entomic
***Gulp plugin for the Entomic templating engine***

## Usage

```js
var entomic = require('gulp-entomic');

gulp.task('entomic', function(){
	gulp.src('./src/**/*.html')
		.pipe(entomic())
		.pipe(gulp.dest('./dist'));
});
```

### constructor(options)

#### options.componentPath

Folder path where entomic components are located.

Type: `String`  
Default: `node_modules`  

#### options.stylePath

Output path to place styles.

Type: `String`  
Default: `style`  

#### options.scriptPath

Output path to place scripts.

Type: `String`  
Default: `script`  

#### options.assetPath

Output path to place assets.

Type: `String`  
Default: `asset`  