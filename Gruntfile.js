module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: [ 'server', 'web' ],
                    outdir: 'docs'
                }
            }
       },
        uglify: {
            javascript: {
				expand: true,
				cwd: 'web/js',
				src: ['*.js', '!*.min.js'],
				dest: 'web-dist/js'
            }
        },
		cssmin: {
			minify: {
				expand: true,
				cwd: 'web/css',
				src: ['*.css', '!*.min.css'],
				dest: 'web-dist/css'
			}
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'web',
						src: '*.html',
						dest: 'web-dist',
						filter: function (f) {
							return f.indexOf("SpecRunner") == -1;
						}
					},
					{
						expand: true,
						cwd: 'web',
						src: [ 'lib', 'fonts' ],
						dest: 'web-dist'
					}
				]
			}
		},
		jasmine: {
			web: {
				src: 'web/**/*.js',
				options: {
					specs: 'web/spec/*Spec.js',
					helpers: 'web/spec/*Helper.js'
				}
			}
		},
        clean:
            ['docs', 'web-dist']

    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['yuidoc', 'uglify', 'cssmin', 'copy']);

};
