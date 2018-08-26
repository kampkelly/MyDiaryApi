import chai from 'chai';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Request from '../helpers/requests';

dotenv.config();
const { expect } = chai;
const request = new Request();
const payload = {
	email: 'coolentry@gmail.com',
	id: 1,
};
const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 6000 });
const headers = {
	token,
};

describe('Test Entries Routes', () => {
	describe('createEntry()', () => {
		it('should create an entry', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries`;
			const formData = {
				title: ' New title is here',
				description: 'New Description can be found at this location',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('Entry has been created!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('validation should fail when any form field is empty', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries`;
			const formData = {
				title: ' ',
				description: 'New Description',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries`;
			const formData = {
				name: ' ',
				body: 'New Description',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give title too short when less than 10 letters', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries`;
			const formData = {
				title: 'New',
				description: 'New Description for this blog post',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('Your title is too short, minimum 10 letters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give description too short when less than 20 letters', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries`;
			const formData = {
				title: 'The New Title Here',
				description: 'New one',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('Your description is too short, minimum 20 letters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('showAllEntries()', () => {
		it('should show all entries', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries`;
			request.getOrDelete('GET', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Retrieved');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should show all entries with limit in query params', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries?limit=4`;
			request.getOrDelete('GET', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Retrieved');
				expect(jsonObject.status).to.be.equal('Success');
				expect(jsonObject.entries).to.have.lengthOf.at.most(4);
				done();
			});
		}).timeout(30000);
	});

	describe('showOneEntries()', () => {
		it('should show one entry', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/1`;
			request.getOrDelete('GET', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Retrieved');
				expect(jsonObject.status).to.be.equal('Success');
				expect(jsonObject.entry).to.be.a('Object');
				done();
			});
		}).timeout(30000);
	});

	describe('updateEntry()', () => {
		it('validation should fail when any form field is empty', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/1`;
			const formData = {
				title: ' ',
				description: 'Cool',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give error when incorrect form data is sent', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/1`;
			const formData = {
				name: 'First Title',
				body: 'Cool',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give title too short when less than 10 letters', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/1`;
			const formData = {
				title: 'New',
				description: 'New Description for this blog post',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('Your title is too short, minimum 10 letters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give description too short when less than 20 letters', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/1`;
			const formData = {
				title: 'The New Title Here',
				description: 'New one',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.message).to.be.equal('Your description is too short, minimum 20 letters!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should update an entry', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/1`;
			const formData = {
				title: 'The New Title Here',
				description: 'This is the new description also',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('This entry has been updated!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);
	});

	describe('deleteEntry()', () => {
		it('should delete an entry', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/1`;
			request.getOrDelete('DELETE', url, headers, (error, res, body) => {
				console.log(body);
				expect(res.statusCode).to.be.equal(204);
				done();
			});
		}).timeout(30000);

		it('should show error when id doesnt exist', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/700`;
			request.getOrDelete('DELETE', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('This entry does not exist or you do not have permission to delete it!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});
});
