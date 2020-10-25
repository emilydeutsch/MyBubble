# Documentation for Backend

Server Name: https://charlieserver.eastus.cloudapp.azure.com

User route:

Handles functions for creating, finding and updating users

Path "server/user/commandName" where commandName is the name of the command you wish to run 
and server is the name of the server

Commands:

    User Route:
        Name: newUser, Req Type: POST
        Input: A JSON object representing a user, includes a firstName, lastName and a unique email
        Returns: On scucess returns a JSON object for the new user, includes all user fields and a 
        unique ID. On failure, sends a plaintext response w/ an error message. 

        Name: findByQuery, Req Type: GET
        Input: Optionally some query, for example: ?firstName=jon&lastName=jones
        Returns: An array of JSON objects for all users that match the query. Sending no query returns
        an array of all users

        Name: addFirstConnection, Req Type: PUT
        Input: A JSON object containing a firstID and secondID field, where the IDs correspond to the
        unique _id fields of the two users we wish to create a first connection for.
        Returns: On success, an array of the newly updated users formatted as a JSON object. On failure,
        sends a plaintext response w/ an error message. 

        Name: getAllConnections, Req Type: GET
        Input: A JSON object containing a _id field, that is a the user id of a user in the database.
        Returns: 
