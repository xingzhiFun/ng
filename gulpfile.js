var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var open = require("open");

var app = {
	srcPath:"./src/",//源代码目录
	devPath:"./build/",//开发环境整合之后的目录
	prdPath:"./dist/"//生产部署的目录
}

//拷贝文件至 开发环境目录&生产目录
gulp.task("lib",function () {
	gulp.src("./bower_components/**/*.js")//深度遍历目录下的js文件
		.pipe(gulp.dest(app.devPath + "vendor"))
		.pipe(gulp.dest(app.prdPath + "vendor"))
		.pipe($.connect.reload())
})
gulp.task("html",function () {
	gulp.src(app.srcPath + '**/*.html')
  		.pipe(gulp.dest(app.devPath))
  		.pipe(gulp.dest(app.prdPath))
		.pipe($.connect.reload())
})
gulp.task("json",function () {
	gulp.src(app.srcPath + 'data/**/*.json')
  		.pipe(gulp.dest(app.devPath + "data"))
  		.pipe(gulp.dest(app.prdPath + "data"))
		.pipe($.connect.reload())
})
gulp.task("less",function () {
	gulp.src(app.srcPath + "css/index.less")//唯一使用的less文件
		.pipe($.less())//编译less
		.pipe(gulp.dest(app.devPath + "css"))//拷贝至开发环境目录
		.pipe($.cssmin()) //压缩后 拷贝 至 生产目录
		.pipe(gulp.dest(app.prdPath + "css"))
		.pipe($.connect.reload())
})
gulp.task("js",function () {
	gulp.src(app.srcPath + "js/**/*.js")
		.pipe($.concat("index.js"))
		.pipe(gulp.dest(app.devPath + "js"))
		.pipe($.uglify())
		.pipe(gulp.dest(app.prdPath + "js"))
		.pipe($.connect.reload())
})
gulp.task("image",function () {
	gulp.src(app.srcPath + "images/**/*")
		.pipe(gulp.dest(app.devPath + "images"))
//		.pipe($.imagemin())
		.pipe(gulp.dest(app.prdPath + "images"))
		.pipe($.connect.reload())
})

//清除 开发环境目录&生产目录
gulp.task("clean",function () {
	gulp.src([app.devPath,app.prdPath])
		.pipe($.clean())
})

//任务整合
gulp.task("build",["lib","html","json","less","js","image"])

//编写服务 监听
gulp.task("watch",function () {
	$.connect.server({
		root:[app.devPath],//开始读取路径
		livereload:true, //自动刷新浏览器(IE不支持)
		port:3000 //默认端口
	});
	open('http://localhost:3000');//默认打开此链接

	//监听以下文件，自动执行对应任务 构建
	gulp.watch('bower_components/**/*', ['lib']);
	gulp.watch(app.srcPath + '**/*.html', ['html']);
	gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
	gulp.watch(app.srcPath + 'css/**/*.less', ['less']);
	gulp.watch(app.srcPath + 'js/**/*.js', ['js']);
	gulp.watch(app.srcPath + 'image/**/*', ['image']);
	//ps:若监听到以上文件有变化，对应任务自动执行，但未刷新浏览器
	//在每个任务后面加上'.pipe($.connect.reload())'通知浏览器刷新界面
})

gulp.task("default",["watch","build"])