module.exports = function(grunt) {

	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	  
	  jshint: {
	    all: ['src/*.js']
	  },
	  
	  uglify: {
	    build: {
	      files: {
	        'build/quizlib.<%= pkg.version %>.min.js': ['build/quizlib.<%= pkg.version %>.js']
	      }
	    }
	  },
	  
	  clean: {
	    build: ['build/']
	  },
	  
	  copy: {
	    main: {
	      files: [
	        {src: 'src/quizlib.js', dest: 'build/quizlib.<%= pkg.version %>.js'},
	        {src: 'src/quizlib.css', dest: 'build/quizlib.css'}
	      ]
	    }
	  },

	  cssmin: {
	    target: {
		  files: [{
		    expand: true,
		    cwd: 'build',
		    src: ['*.css', '!*.min.css'],
		    dest: 'build',
		    ext: '.min.css'
		  }]
	    }
	  },
	  
	  yuidoc: {
	    compile: {
	      name: '<%= pkg.name %>',
          description: '<%= pkg.description %>',
          version: '<%= pkg.version %>',
          url: '<%= pkg.homepage %>',
          options: {
            paths: 'src/',
            outdir: 'docs'
          }
	    }
	  },
	});
	
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	
	grunt.registerTask('default', ['clean', 'jshint', 'copy', 'uglify', 'cssmin', 'yuidoc']);
};
