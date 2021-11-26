const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const projects = require('../data-store');
const Promise = require('bluebird');
const should = chai.should();

chai.use(chaiHttp);

describe('http_basics', () => {

    it('Should return 404 for an invalid route', (done) => {
        chai.request(server)
            .get('/')
            .then(response => {
                response.status.should.eql(404);
                done()
            })
    });

    it('Should return a 400 if the request param is not valid - 1', done => {
        chai.request(server)
            .get('/projects/')
            .then(response => {
                response.status.should.eql(400);
                response.headers['content-type'].should.eql('application/json');
                response.body.message.should.eql('BAD REQUEST');
                done()
            })

    });

    it('Should return a 400 if the request param is not valid - 2', done => {
        chai.request(server)
            .get('/projects')
            .then(response => {
                response.status.should.eql(400);
                response.headers['content-type'].should.eql('application/json');
                response.body.message.should.eql('BAD REQUEST');
                done()
            })
    });

    it('Should return a 404 if the requested id is not present in data - 1', done => {
        chai.request(server)
            .get('/projects/5')
            .then(response => {
                response.status.should.eql(404);
                done()
            })
    });

    it('Should return a 404 if the requested id is not present in data - 2', done => {
        chai.request(server)
            .get('/projects/test')
            .then(response => {
                response.status.should.eql(404);
                done()
            })
    });

    it('Should return the correct data with status 200', done => {
        Promise
            .mapSeries([1, 2, 3], id => {
                return new Promise((resolve) => {
                    chai.request(server)
                        .get(`/projects/${id}`)
                        .then(response => {
                           resolve({id, response});
                        })
                })
            })
            .then(responses => {
                responses.forEach(({response, id}) => {
                    response.status.should.eql(200);
                    response.headers['content-type'].should.not.be.undefined;
                    response.headers['content-type'].should.eq('application/json');
                    response.body.should.eql(projects[id - 1]);
                });
                done()
            })
    })
});
