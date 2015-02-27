'use strict';
module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    filename: 'scrolldiva',
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed MIT */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/<%= filename %>.js'],
        dest: 'dist/jquery.<%= filename %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/jquery.<%= filename %>.min.js'
      }
    },
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:9000/test/<%= filename %>.html']
        }
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        force: true
      },
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', /*'qunit',*/ 'prepare']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', /*'qunit'*/]
      },
      livereload: {
        options: {
          livereload: '<%= connect.server.options.livereload %>'
        },
        files: [
          'demo/*.html',
          'dist/*'
        ]
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Bump to v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin',
        //gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        //globalReplace: false,
        //prereleaseName: false,
        //regExp: false
      }
    },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9000,
          livereload: 35729,
          open: true
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('prepare', ['clean', 'concat', 'uglify']);
  grunt.registerTask('default', ['jshint', /*'connect', 'qunit',*/ 'prepare']);
  grunt.registerTask('serve', ['default', 'connect', 'watch']);
  grunt.registerTask('test', ['jshint', 'connect', /*'qunit'*/]);
};
