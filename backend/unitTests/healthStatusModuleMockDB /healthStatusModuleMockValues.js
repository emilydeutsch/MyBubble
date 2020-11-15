let userBasic = {
    "firstConnections": [],
    "temporaryConnections": [],
    "healthStatus": 4,
    "healthStatusOnLastCheck": 4,
    "creationDate": "2020-10-29T00:30:18.000Z",
    "_id": "5f9a0e132ed12012457c43f5",
    "firstName": "Kaguya",
    "lastName": "Shinomiya",
    "email": "kaguyashinomiya@gmail.com",
    "__v": 0
}

let userSameFirstName = {
    "firstConnections": [],
    "temporaryConnections": [],
    "healthStatus": 4,
    "healthStatusOnLastCheck": 4,
    "creationDate": "2020-10-29T00:30:18.000Z",
    "_id": "5f9a0e152ed12012457c43f9",
    "firstName": "Kaguya",
    "lastName": "Hime",
    "email": "princessKaguya@gmail.com",
    "__v": 0
}

let connectedUserA = {
    "firstConnections": ["5f9a0e152ed12012457c43f9"],
    "temporaryConnections": [],
    "healthStatus": 4,
    "healthStatusOnLastCheck": 4,
    "creationDate": "2020-10-29T00:30:18.000Z",
    "_id": "5f9a0e132ed12012457c43f5",
    "firstName": "Kaguya",
    "lastName": "Shinomiya",
    "email": "kaguyashinomiya@gmail.com",
    "__v": 0
}

let connectedUserB = {
    "firstConnections": ["5f9a0e132ed12012457c43f5"],
    "temporaryConnections": [],
    "healthStatus": 4,
    "healthStatusOnLastCheck": 4,
    "creationDate": "2020-10-29T00:30:18.000Z",
    "_id": "5f9a0e152ed12012457c43f9",
    "firstName": "Kaguya",
    "lastName": "Hime",
    "email": "princessKaguya@gmail.com",
    "__v": 0
}

let unconnectedUserA = {
    "firstConnections": [],
    "temporaryConnections": [],
    "healthStatus": 4,
    "healthStatusOnLastCheck": 4,
    "creationDate": "2020-10-29T00:30:18.000Z",
    "_id": "5f9a0e132ed12012457c43f5",
    "firstName": "Kaguya",
    "lastName": "Shinomiya",
    "email": "kaguyashinomiya@gmail.com",
    "__v": 0
}

let unconnectedUserB = {
    "firstConnections": [],
    "temporaryConnections": [],
    "healthStatus": 4,
    "healthStatusOnLastCheck": 4,
    "creationDate": "2020-10-29T00:30:18.000Z",
    "_id": "5f9a0e152ed12012457c43f9",
    "firstName": "Kaguya",
    "lastName": "Hime",
    "email": "princessKaguya@gmail.com",
    "__v": 0
}



let connectionsBasic = {
    firstConnections: [
        "5f9a0df42ed12012457c43f4",
        "5f9a0e5b2ed12012457c43f6",
        "5f9a0e882ed12012457c43f8",
        "5f9a0ea92ed12012457c43f9"
    ],
    secondConnections: [
        "5f9a0dd32ed12012457c43f3",
        "5f9a0e6c2ed12012457c43f7",
        "5f9a0eba2ed12012457c43fa",
        "5f9a0ed72ed12012457c43fb"
    ],
    thirdConnections: [
        "5f9a0da52ed12012457c43f1",
        "5f9a0dc22ed12012457c43f2",
        "5f9a0efd2ed12012457c43fd",
        "5f9a0ee82ed12012457c43fc"
    ]
}

module.exports = 
{   userBasic, 
    userSameFirstName, 
    connectionsBasic,
    connectedUserA,
    connectedUserB,
    unconnectedUserA,
    unconnectedUserB,
}