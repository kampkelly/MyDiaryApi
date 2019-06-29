module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks
    grunt.initConfig({
      "babel": {
	        options: {
	          sourceMap: true
	        },
	        dist: {
				files: [{
			      expand: true,
			      cwd: 'server',
			      src: ['**/*.js'],
			      dest: 'app',
			      ext: '.js'
			  }]
	        }
		},
		eslint: {
            target: ['server/**/*.js']
       	},
	   	mochaTest: {
		  test: {
		    options: {
		      reporter: 'spec',
		      require: 'babel-register'
		    },
		    src: ['app/tests/**/*.js']
		  }
		},
		watch: {
			scripts: {
				files: ["server/**/*.js"],
				tasks: ["eslint", "babel"]
			}
		}
    });

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask("default", ["eslint", "babel", "mochaTest"]);
};
