import chai from 'chai';
import dotenv from 'dotenv';
import Request from '../helpers/requests';

dotenv.config();
const { expect } = chai;
const request = new Request();

describe('Test Global Routes', () => {
	describe('visitInvalidRoute()', () => {
		it('should show not found when a user visits a mispelt address', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/no_entries`;
			const headers = {
				'Content-Type': 'application/json',
			};
			request.getOrDelete('GET', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.message).to.be.equal('Not Found! The page you are trying to access does not exist!');
				done();
			});
		}).timeout(20000);
	});
});
