# Documentation for Backend

Server Name: https://charlieserver.eastus.cloudapp.azure.com

User route:

Handles functions for creating, finding and updating users

Path "server/user/commandName" where commandName is the name of the command you wish to run 
and server is the name of the server

Commands:
    Name: newUser, Req Type: POST
    Input: A JSON object representing a user, includes a firstName, lastName and a unique email
    Returns: A JSON object for the new user, includes all user fields and a unique ID 

    Name: find, Req Type: GET
    Input: Optionally some query, for example: ?firstName=jon&lastName=jones
    Returns: An array of JSON objects for all users that match the query. Sending no query returns
    an array of all users

    Name: addFirstConnection, Req Type: PUT
    Input: A JSON object containing a firstID and secondID field, where the IDs correspond to the
    unique _id fields of the two users we wish to create a first connection for.
    Returns: An array of the newly updated users formatted as a JSON object.