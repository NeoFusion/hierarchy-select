module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: 'dist',
            docs: 'docs/dist'
        },
        uglify: {
            build: {
                files: {
                    'dist/hierarchy-select.min.js': 'src/hierarchy-select.js'
                }
            }
        },
        sass: {
            options: {
                outputStyle: 'compressed'
            },
            build: {
                files: {
                    'dist/hierarchy-select.min.css': 'src/hierarchy-select.scss'
                }
            }
        },
        copy: {
            docs: {
                expand: true,
                cwd: 'dist',
                src: '**',
                dest: 'docs/dist/'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['clean', 'uglify', 'sass', 'copy']);
};
