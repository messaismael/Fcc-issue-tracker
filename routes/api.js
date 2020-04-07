/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');


const CONNECTION_STRING = process.env.DATABASE; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify : false } );

let Schema = mongoose.Schema;
let projectName = new Schema({
  issue_title: {type: String, required: true},
  issue_text:  {type: String, required: true},
  created_on:  {type: Date},
  updated_on:  {type: Date},
  created_by:  {type: String, required: true},
  assigned_to: {type: String},
  status_text: {type: String},
  open:        {type: Boolean},
  projectName: {type: String}
})

let ProjectModel = mongoose.model('ProjectModel', projectName);


module.exports = function (app) {
  

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      let filter = req.query;
      if(String(filter.open)!=='undefined' && String(filter.assigned_to)!=='undefined'){
        let projectIssues = await ProjectModel.find({projectName: project, open: filter.open, assigned_to: filter.assigned_to}).select('-projectName -__v');
        res.send(projectIssues);      
      }
      else if(String(filter.open)!=='undefined'){
        let projectIssues = await ProjectModel.find({projectName: project, open: filter.open}).select('-projectName -__v');
        res.send(projectIssues);
      }
      else if(String(filter.assigned_to)!=='undefined'){
        let projectIssues = await ProjectModel.find({projectName: project, assigned_to: filter.assigned_to}).select('-projectName -__v');
        res.send(projectIssues);
      }
      let projectIssues = await ProjectModel.find({projectName: project}).select('-projectName -__v');
      res.send(projectIssues);
    })
    
    .post(async function (req, res){
      var project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.send('Missing required fields');        
      }
      else{
        let issue = new ProjectModel({
          issue_title: req.body.issue_title,
          issue_text:  req.body.issue_text,
          created_on:  new Date(),
          updated_on:  new Date(),
          created_by:  req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
          open:        true,
          projectName: project,        
        })
        await issue.save();
        res.json(await ProjectModel.findById({_id: issue._id}).select('-projectName -__v'));
      }
    })
    
    .put(async function (req, res){
      var project = req.params.project;
      let _id = req.body._id;
      let tes =/^[0-9a-fA-F]{24}$/;
    
      if (tes.test(_id)) {
        
        let doc = await ProjectModel.findById({_id: _id}).select('-projectName -__v');
        
        if (!_id) {
          
          res.send('Missing _id field')  
        }
        else if (doc) {
          
          let updatedDoc = await ProjectModel.findOneAndUpdate({_id: _id}, 
          {
            issue_title: !req.body.issue_title?doc.issue_title:req.body.issue_title,
            issue_text:  !req.body.issue_text?doc.issue_text:req.body.issue_text,
            open:        !req.body.open?doc.open:req.body.open,
            updated_on:  new Date(),
            created_by:  !req.body.created_by?doc.created_by:req.body.created_by,
            assigned_to: !req.body.assigned_to?doc.assigned_to:req.body.assigned_to,
            status_text: !req.body.status_text?doc.status_text:req.body.status_text,
          }, {new: true})
          res.send('successfully updated');
        }
        else {
          
          res.send('could not update '+ _id);
        }
      }
      else {
        
        res.send("_id error")
      }
    })
    
    .delete(async function (req, res){
      var project = req.body.project;
      let _id = req.body._id;
      // regex of a mongoose _id 
      let tes =/^[0-9a-fA-F]{24}$/
      if (tes.test(_id)) {
        let doc = await ProjectModel.findById({_id: _id})
        if(doc){
          await ProjectModel.findOneAndRemove({_id: _id});  
          res.json({"success": "deleted "+_id});  
        }
        else{
           res.json({"Error": "Could not find "+_id});   
        }  
      }
      else {     
        res.send('_id error');               
      }
    });
};
