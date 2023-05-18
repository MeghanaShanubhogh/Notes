'use strict';
const dynamoDB = require("aws-sdk/clients/dynamodb");
const documentCLient = new dynamoDB.DocumentClient(
  {region:"us-east-2",
  maxRetries: 3,
  httpOptions:{
    timeout:5000
  }});
const notes_table = process.env.NOTES_TABLE_NAME;

const send = (statusCode,body)=>{
  return {statusCode,
  body: JSON.stringify(body)}
};
module.exports.createNote = async (event,context,callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let data = JSON.parse(event.body);
  try{
    var params = {
      TableName : notes_table,
      Item: {
        notesId:data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: "attribute_not_exists(notesId)"
    };
    await documentCLient.put(params).promise();
    callback(null,send(201,data));
  }
  catch(err)
  {
    callback(null,send(500,err.message));
  }
};

module.exports.updateNote = async (event,context,callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let data = JSON.parse(event.body);
  let notes_id = event.pathParameters.id;
  try{
    var params = {
      TableName : notes_table,
      Key: { notesId:notes_id },
        UpdateExpression: 'set #title = :title, #body = :body',
        ExpressionAttributeNames: {'#title' : 'title', '#body':'body'},
        ExpressionAttributeValues: {
            ':title' : data.title,
            ':body' : data.body
          },
      ConditionExpression: "attribute_exists(notesId)"
    };
    await documentCLient.update(params).promise();
    callback(null,send(202,data));
  }
  catch(err)
  {
    callback(null,send(500,err.message));
  }
};

module.exports.deleteNote = async (event,context,callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let notes_id = event.pathParameters.id;
  let data = "deleted "+notes_id;
  try{
    var params = {
      TableName : notes_table,
      Key: { notesId:notes_id},
      ConditionExpression: "attribute_exists(notesId)"
    };
    
    await documentCLient.delete(params).promise();
    callback(null,send(203,data));
  }
  catch(err)
  {
    callback(null,send(500,err.message))
  }
};

module.exports.getAllNotes = async (event,context,callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try{
        var params={
            TableName:notes_table
        };
        let data = await documentCLient.scan(params).promise();
        callback(null,send(200,data));
  }
  catch(err)
  {
    callback(null,send(500,err.message))
  }
};