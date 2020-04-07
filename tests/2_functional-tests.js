/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
         
          assert.equal(res.body.issue_title, 'Title')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha')
          assert.equal(res.body.status_text, 'In QA')
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Required fields filled in',
            assigned_to: '',
            status_text: ''
          })
          .end(function(err,res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json')
          
            assert.equal(res.body.issue_title, 'Title')
            assert.equal(res.body.issue_text, 'text')
            assert.equal(res.body.created_by, 'Functional Test - Required fields filled in')
            assert.isEmpty(res.body.assigned_to)
            assert.isEmpty(res.body.status_text)
          
            done();
          })
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: '',
            issue_text: '',
            created_by: '',
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          })
          .end(function(err, res){
            assert.equal(res.text, 'Missing required fields')
         
            done();
          }) 
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({ })
          .end(function(err, res){
            assert.equal(res.text, 'Missing _id field');
          
            done();
          })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({   
            _id:'5e8cbffb7ee5f15645804a24'
          })
          .end(function(err, res){
            assert.equal(res.test, 'successfully updated');
          
            done();
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({   
            _id:'5e8cbffb7ee5f15645804a24',
            issue_title: 'issues_title updated',
            issue_text:  'issues_text updated',
            created_by:  'create_by updated',
            assigned_to: 'assigned_to updated',
            status_text: 'status_text updated'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'successfully updated');
          
            done();
          })

      });  
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({
            open: true
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.equal(res.body[0].open, true);
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
          
            done();
          })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({
            assigned_to:'test',
            open: false
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.equal(res.body[0].assigned_to , 'test');
            assert.property(res.body[0], 'open');
            assert.equal(res.body[0].open, false);
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
          
            done();
          
          })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({ })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, '_id error');
          
            done();
          })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({
            _id: '5e8cf79c73b9a013617c601f',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);;
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'success');
          
            done();
          })
      });
      
      test("inValid _id", function(done){
        chai.request(server)
          .delete('/api/issues/test')
          .send({
          _id:'5e8cb20a4001d03f875352bb',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'Error');
          
            done();
          })
      })
      
    });

});
