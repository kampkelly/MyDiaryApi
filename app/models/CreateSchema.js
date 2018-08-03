'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();

var CreateSchema = function () {
	function CreateSchema() {
		_classCallCheck(this, CreateSchema);

		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
			this.connectionString = process.env.DATABASE_URL;
			this.pool = new _pg2.default.Pool({
				connectionString: this.connectionString
			});
		}
	}

	_createClass(CreateSchema, [{
		key: 'createDb',
		value: function createDb() {
			var _this = this;

			if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
				this.pool.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, fullName VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, dateOfBirth DATE NOT NULL, reminderTime TIME DEFAULT NULL, createdAt TIMESTAMP DEFAULT CURRENT_DATE, updatedAt TIMESTAMP DEFAULT CURRENT_DATE)', function () {
					_this.pool.query('CREATE TABLE IF NOT EXISTS entries(id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, user_id INTEGER NOT NULL REFERENCES users, "createdAt" TIMESTAMP DEFAULT CURRENT_DATE, "updatedAt" TIMESTAMP DEFAULT CURRENT_DATE)', function () {
						_this.pool.end();
					});
				});
			}
		}
	}]);

	return CreateSchema;
}();

exports.default = CreateSchema;
//# sourceMappingURL=CreateSchema.js.map
