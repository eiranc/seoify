module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dependencies: {
                src: [
                    '../vendor/history.init.options.js',
                    '../vendor/jquery.scrollto.min.js',
                    '../vendor/jquery.history.min.js'
                ],
                dest: '../dist/<%= pkg.name %>.vendor.lib.js'
            }
        },
        uglify: {
            options: {
                warnings: false,
                preserveComments: false,
                mangle: false,
            },
            dist: {
                files: {
                    // Minimize files in array
                    '../dist/<%= pkg.name %>.min.js': ['../src/seoify.js']
                }
            },
            vendor: {
                files: {
                    // Minimize files in array
                    '../dist/<%= pkg.name %>.vendor.lib.min.js': ['../dist/<%= pkg.name %>.vendor.lib.js']
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '../src/',
                    src: ['seoify.js'],
                    dest: '../dist/'
                }]
            },
            demo: {
                files: [{
                    expand: true,
                    cwd: '../dist/',
                    src: ['seoify.js', 'seoify.vendor.lib.js', 'seoify.vendor.lib.min.js'],
                    dest: '../demo/'
                }]
            }
        },
        watch: {
            files: ['../src/*.js'],
            tasks: ['copy'],
            options: {
                reload: true,
                interrupt: false,
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
        'concat',
        'uglify',
        'copy',
        'watch'
    ]);
};