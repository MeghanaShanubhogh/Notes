/*let { CognitoJwtVerifier } = require("aws-jwt-verify");
const verifier = CognitoJwtVerifier.create({
    userPoolId:"us-east-2_Fc2QQBmWM",
    tokenUse:"id",
    clientId:"13p5mlu3blc4obn8p1l0jku3n0"
});*/

const generatePolicy = (principalId,effect,resource) =>{
    let authResponse = {};
    authResponse.principalId = principalId;
    if(effect && resource)
    {
        let policyDocument = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": effect,
                    "Action": "execute-api:Invoke",
                    "Resource": resource
                }
            ]
        };
        authResponse.policyDocument = policyDocument;
        //context is more info from user like email id we can use to send to database etc
        authResponse.context = {
            foo:"bar"
        };
        console.log(JSON.stringify(authResponse)); // we can check this is cloudWatch
    }
return authResponse;

};
module.exports.handler = async(event, context,callback)=>{
    //lambda authorizser code
    let token = event.authorizationToken;
    /*console.log(token);
    try{
        let payload = await verifier.verify(token).promise();
        console.log(JSON.stringify(payload));
        callback(null,generatePolicy("user","Allow",event.methodArn));
    }
    catch(err)
    {
        callback("error unknwon Token");
    }*/
    //we match string value allow and deny
    
    //if allowing we need to return IAM policy
    switch(token)
    {
        case "Allow": callback(null,generatePolicy("user","Allow",event.methodArn));
                        break;
        case "Deny": callback(null,generatePolicy("user","Deny",event.methodArn));
                        break;
        default: callback("error unknwon Token");
    }
};