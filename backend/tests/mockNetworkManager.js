const fakeDB = require('./fakedb.js');

const mockGetAllConnections = jest.fn();
const mockUpdateHealthStatuses = jest.fn();

mockGetAllConnections.mockResolvedValue({
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
});

mockUpdateHealthStatuses.mockResolvedValue(3);

