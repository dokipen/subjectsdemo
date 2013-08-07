/*
 * This file defines a bunch of premade tasks for you to use.
 * If you'd like to add your own tasks, you should add them to the `config`
 * object in your `Gruntfile.js` instead of here.
 * */

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};
var template = require('grunt').template;

module.exports = {
  config: {

    // Watch tasks
    // ------------------
    watch: {
      emberTemplates: {
        files: [
          'app/**/*.hbs',
          'app/**/*.handlebars'
        ],
        spawn: true,
        tasks: ['emberTemplates']
      },
      coffee: {
        files: ['app/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },

      // copy ALL the things! it's /tmp, so uncompiled assets being copied
      // doesn't really matter too much.
      assets: {
        files: ['assets/**/*'],
        tasks: ['copy:dev']
      },

      html: {
        files: ['app/**/*.html'],
        tasks: ['copy:dev']
      },

      less: {
        files: ['assets/styles/**/*.less'],
        tasks: ['less:dev']
      },

      livereload: {
        files: [
          'app/*.html',
          '{tmp,app}/assets/{,*/}*.css',
          '{tmp,app}/{,*/}*.js',
          'assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      },
      neuter: {
        files: [
          'test/**/*.js',
          'app/**/*.js'
        ],
        tasks: ['neuter', 'copy:dev']
      }
    },

    // Server tasks
    // ------------------
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'tmp')
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },

    // Opens your web browser when you start a server
    // ------------------
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },

    // Dist
    // ------------------
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'tmp',
            'dist/*',
            '!dist/.git*'
          ]
        }]
      },
      server: 'tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/**/*.js',
        'test/**/*.js'
      ]
    },

    // Testing
    // ------------------
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },
    jasmine: {
      all: {
        /*src: '',*/
        options: {
          specs: 'test/spec/{,*/}*.js'
        }
      }
    },

    // Asset building
    // ------------------
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/scripts',
          src: '{,*/}*.coffee',
          dest: 'tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: 'tmp/spec',
          ext: '.js'
        }]
      }
    },

    less: {
      dev: {
        files: [{
          expand: true,
          cwd: "assets/styles",
          src: ["**/*.less"],
          dest: "tmp/assets/styles",
          ext: ".css"
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: "assets/styles",
          src: ["**/*.less"],
          dest: "dist/assets/styles",
          ext: ".css"
        }],
        options: {
          yuicompress: true
        }
      }
    },

    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: "assets/styles",
          src: ["**/*.scss", "**/*.sass"],
          dest: "tmp/assets/styles",
          ext: ".css"
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: "assets/styles",
          src: ["**/*.scss", "**/*.sass"],
          dest: "dist/assets/styles",
          ext: ".css"
        }],
        options: {
          style: "compress"
        }
      }
    },

    // Revisioning
    // ------------------
    rev: {
      dist: {
        files: {
          src: [
            'dist/scripts/{,*/}*.js',
            'dist/styles/{,*/}*.css',
            'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            'dist/styles/fonts/*'
          ]
        }
      }
    },

    // Usemin
    // ------------------
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist'
      }
    },
    usemin: {
      html: ['dist/{,*/}*.html'],
      css: ['dist/styles/{,*/}*.css'],
      options: {
        dirs: ['dist']
      }
    },

    // Image minification
    // ------------------
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: 'dist/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/images',
          src: '{,*/}*.svg',
          dest: 'dist/images'
        }]
      }
    },

    // CSS & HTML minification
    // ------------------
    cssmin: {
      dist: {
        files: {
          'dist/styles/main.css': [
            'assets/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app',
          src: '*.html',
          dest: 'dist'
        }]
      }
    },

    // Ember-specific tasks
    // ------------------
    emberTemplates: {
      options: {
        // this is a little more huge and inelegant than I wanted

        // here are the rules:
        // "app/application.handlebars" => "application"
        // "app/modules/my_module/index.handlebars" => "my_module"
        // "app/modules/my_module/foo.handlebars" => "my_module/foo"
        // "app/templates/foo.handlebars" => "foo"
        // "foo/wat" => "foo/wat"
        templateName: function (sourceFile) {
          var prefixRegex = new RegExp("(?:app/modules/|app/templates/|app/)(.*)");
          var filename, match;

          if ((match = sourceFile.match(prefixRegex)) && (filename = match[1])) {
            var inModule = new RegExp("app/modules/").test(sourceFile);
            if (inModule) {
              // name w/o extension
              var name = filename.match(/.*(?=\/)(.*)(?:.*)$/)[1].slice(1);

              // find containing folder. somewhat inelegant, but man, regexes...
              var folders = filename.match(/(.*?)\//g);
              var folder = folders[folders.length - 1];
              var moduleName = folder.slice(0, folder.length-1);

              // app/modules/my_module/index.handlebars => "my_module"
              if (name === "index") {
                return moduleName;
              }
            }
            return filename;
          }
          return sourceFile;
        }
      },
      dev: {
        files: {
          'tmp/app/compiled-templates.js': [
            'app/**/*.hbs',
            'app/**/*.handlebars'
          ]
        }
      }
    },

    neuter: {
      app: {
        options: {
          filepathTransform: function(filepath){ return template.process('app/') + filepath; },
          includeSourceMap: true
        },
        src: 'app/app.js',
        dest: 'tmp/app/app.js'
      },
      test: {
        options: {
          filepathTransform: function(filepath){ return template.process('test/') + filepath; },
          includeSourceMap: true
        },
        src: 'test/main.js',
        dest: 'tmp/spec/spec.js'
      }
    },

    copy: {
      dev: {
        files: [
          { dest: 'tmp/index.html', src: ['app/index.html'] },
          { expand: true, dest: 'tmp/', src: ['assets/**'] },

          // copy uncompiled app js to /tmp for debugging (source maps)
          { expand: true, dest: 'tmp/app', src: ['app/**'] },

          { expand: true, dest: 'tmp/', src: ['components/**'] }
        ]
      },
      test: {
        files: [
          { dest: 'tmp/index.html', src: ['test/index.html'] }
        ]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'dist',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'assets/images/{,*/}*.{webp,gif}',
            'assets/styles/fonts/*'
          ]
        }]
      }
    }

  }
};
