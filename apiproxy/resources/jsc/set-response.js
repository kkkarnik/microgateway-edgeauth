// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

 //prepare response object
 
 var jws = {
    token: context.getVariable('jwtmessage')
 };
 
 if (context.getVariable('grant_type') === 'client_credentials' || context.getVariable('grant_type') === 'password') {
    if (context.getVariable("scp")) {
     jws.scope = context.getVariable("scp");
    }
    
    jws.access_token = context.getVariable('jwtmessage');
    jws.token_type   = "bearer";
    try {
      jws.expires_in   = parseInt(context.getVariable("token_expiry"));
    } catch (err) {}
    
    
    //if refresh token exists, add it to response
    if (context.getVariable('grant_type') === "password") {
        jws.refresh_token            = context.getVariable("oauthv2accesstoken.AccessTokenRequest.refresh_token");
        try {
         jws.refresh_token_expires_in = parseInt(context.getVariable("oauthv2accesstoken.AccessTokenRequest.refresh_token_expires_in"));
        } catch (err) {}
        jws.refresh_token_issued_at  = context.getVariable("oauthv2accesstoken.AccessTokenRequest.refresh_token_issued_at") ; 
        jws.refresh_token_status     = context.getVariable("oauthv2accesstoken.AccessTokenRequest.refresh_token_status"); 
    }
 }
 
 
 //send response
 context.setVariable("response.header.Content-Type","application/json");
 context.setVariable("response.header.Cache-Control","no-store");
 context.setVariable("response.header.Pragma","no-cache");
 context.setVariable("response.content", JSON.stringify(jws));

