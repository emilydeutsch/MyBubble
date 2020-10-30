# Documentation for Backend

Main Server Name: http://charlieserver.eastus.cloudapp.azure.com
Test Server Name: http://52.152.158.4:8080

User route:

Handles functions for creating, finding and updating users

Path "server/route/commandName" where commandName is the name of the command you wish to run, route is the
name of the route, server is the name of the server

Response Codes: 
    200 OK
    404 Not Found
    412 Violates Preconditions

Commands:

    user Route:
        Name: newUser, Req Type: POST
        Input: A JSON object representing a user, includes a firstName, lastName and a unique email
        Modifies: Adds a new user to the MongoDB database.
        Returns: On success returns a JSON object for the new user, includes all user fields and a 
        unique ID. On failure, sends a plaintext response w/ an error message. 

        Name: findByQuery, Req Type: GET
        Input: Optionally some query, for example: ?firstName=jon&lastName=jones
        Returns: An array of JSON objects for all users that match the query. Sending no query returns
        an array of all users

        Name: addFirstConnection, Req Type: PUT
        Input: A JSON object containing a firstID and secondID field, where the IDs correspond to the
        unique _id fields of the two users we wish to create a first connection for.
        Modifies: The list of firstConnections for both users, each had the other's ID added to it.
        Returns: On success, an array of the newly updated users formatted as a JSON object. On failure,
        sends a plaintext response w/ an error message. 

        Name: getAllConnections, Req Type: GET
        Input: A JSON object containing a _id field, that is a the user id of a user in the database.
        Returns: On success, A JSON objection containing three fields: firstConnections, secondConnections, 
        thirdConnections, each array is an array of id strings corresponding to connected users on the server.
        On failure returns a plaintext response w/ an error message.

    healthStatus Route:
        Name: updateHealthStatus, ReqType: POST
        Input: A JSON object w/ an 'id' field and a boolean 'healthStatus' field.
        Modifies: Set's the user's healthStatus to 0 (immediate) and set's the healthStatus of the first,
        second and third connections of the user to 1, 2 and 3 respectively.
        Returns: On success, A JSON object of the user

        Name: pollHealthStatus, ReqType: GET
        Input: A query with containing an '_id' field. 
        Returns: On success, A JSON object containing the fields 'changed' and 'healthStatus' where 
        healthStatus is the healthStatus of the user and changed is a boolean defining whether the
        healthStatus has been changed since the last 'pollHealthStatus' or 'updateHealthStatus' request
        with this user.