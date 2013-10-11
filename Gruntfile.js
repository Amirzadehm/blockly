var path = require('path');

var config = {};

var APPS = [
  'maze',
  'turtle'
];

config.clean = {
  all: ['build', 'dist']
};

config.copy = {
  src: {
    files: [
      {
        expand: true,
        cwd: 'src/',
        src: ['**/*.js'],
        dest: 'build/js'
      }
    ]
  },
  browserified: {
    files: [
      {
        expand: true,
        cwd: 'build/browserified',
        src: ['**/*.js'],
        dest: 'dist/js'
      }
    ]
  },
  package: {
    files: [
      {
        src: ['package.json'],
        dest: 'dist/'
      }
    ]
  },
  static: {
    files: [
      {
        expand: true,
        cwd: 'static/',
        src: ['**'],
        dest: 'dist/media'
      },
      {
        expand: true,
        cwd: 'lib/blockly/media',
        src: ['**'],
        //TODO: Would be preferrable to separate Blockly media.
        dest: 'dist/media'
      }
    ]
  }
};

config.sass = {
  all: {
    files: {
      'dist/css/common.css': 'style/common.scss'
    }
  }
};
APPS.forEach(function(app) {
  var src = 'style/' + app + '/style.scss';
  var dest = 'dist/css/' + app + '.css';
  config.sass.all.files[dest] = src;
});

config.messages = {
  all: {
    locales: ['en_us'],
    srcBase: 'i18n',
    destBase: 'build'
  }
};

config.ejs = {
  all: {
    srcBase: 'src',
    destBase: 'build/js'
  }
};

config.browserify = {};
APPS.forEach(function(app) {
  var src = 'build/js/' + app + '/main.js';
  var dest = 'build/browserified/' + app + '.js';
  var files = {};
  files[dest] = [src];
  config.browserify[app] = {
    files: files
  };
});

config.concat = {
  vendor: {
    src: [
      'lib/blockly/blockly_compressed.js',
      'lib/blockly/blocks_compressed.js',
      'lib/blockly/javascript_compressed.js',
      'lib/blockly/en.js'
    ],
    dest: 'dist/js/vendor.js'
  }
};

config.express = {
  server: {
    options: {
      port: 8000,
      bases: path.resolve(__dirname, 'dist'),
      server: path.resolve(__dirname, './src/dev/server.js'),
      livereload: true
    }
  }
};

config.watch = {
  js: {
    files: ['src/**/*.js'],
    tasks: ['copy:src', 'browserify', 'copy:browserified']
  },
  style: {
    files: ['style/**/*.scss', 'style/**/*.sass'],
    tasks: ['sass']
  },
  content: {
    files: ['static/**/*'],
    tasks: ['copy']
  },
  vendor_js: {
    files: ['lib/**/*.js'],
    tasks: ['concat:vendor']
  },
  ejs: {
    files: ['src/**/*.ejs'],
    tasks: ['ejs', 'browserify', 'copy:browserified']
  },
  messages: {
    files: ['i18n/**/*.json'],
    tasks: ['messages', 'browserify', 'copy:browserified']
  },
  dist: {
    files: ['dist/**/*'],
    options: {
      livereload: true
    }
  }
};

config.jshint = {
  options: {
    node: true,
    browser: true,
    globals: {
      Blockly: true,
      //TODO: Eliminate the globals below here.
      BlocklyApps: true,
      Maze: true,
      Turtle: true,
    }
  },
  all: [
    'Gruntfile.js',
    'tasks/**/*.js',
    'src/**/*.js',
    'test/**/*.js'
  ]
};

config.release = {
  options: {
    folder: 'dist',
    tagName: 'v<%= version %>',
  }
};

module.exports = function(grunt) {

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-release');

  grunt.loadTasks('tasks');

  grunt.registerTask('build', [
    'messages',
    'copy:src',
    'ejs',
    'browserify',
    'copy:browserified',
    'copy:package',
    'copy:static',
    'concat',
    'sass'
  ]);

  grunt.registerTask('dev', ['express:server', 'watch']);

  grunt.registerTask('default', ['clean:all', 'build']);

};
