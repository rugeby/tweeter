"use strict";
// Make sure to increase the write capacities for the follow table, follow index, and user table. 
Object.defineProperty(exports, "__esModule", { value: true });
const tweeter_shared_1 = require("tweeter-shared");
const FollowDaoFillTable_1 = require("../../../src/DAO/FollowDaoFillTable");
const UserDaoFillTable_1 = require("../../../src/DAO/UserDaoFillTable");
let mainUsername = "@ruby";
let followername = "@serpent";
let password = "123";
let imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
let firstName = "first";
let lastName = "last";
let numUsers = 10000;
let batchSize = 25;
let aliasList = Array.from({ length: numUsers }, (_, i) => followername + (i + 1));
let followDaoFillTable = new FollowDaoFillTable_1.FollowDaoFillTable();
let userDaoFillTable = new UserDaoFillTable_1.UserDaoFillTable();
console.log('setting followers');
setFollowers(0);
console.log('setting users');
setUsers(0);
// userDaoFillTable.increaseFollowersCount(mainUsername, numUsers);
function setFollowers(i) {
    if (i >= numUsers)
        return;
    else if (i % 1000 == 0) {
        console.log(i + ' followers');
    }
    let followList = aliasList.slice(i, i + batchSize);
    followDaoFillTable.createFollows(mainUsername, followList)
        .then(() => setFollowers(i + batchSize))
        .catch(err => console.log('error while setting followers: ' + err));
}
function setUsers(i) {
    if (i >= numUsers)
        return;
    else if (i % 1000 == 0) {
        console.log(i + ' users');
    }
    let userList = createUserList(i);
    userDaoFillTable.createUsers(userList, password)
        .then(() => setUsers(i + batchSize))
        .catch(err => console.log('error while setting users: ' + err));
}
function createUserList(i) {
    let users = [];
    // Ensure that we start at alias1 rather than aliaszero.
    let start = i + 1;
    let limit = start + batchSize;
    for (let j = start; j < limit; ++j) {
        let user = new tweeter_shared_1.User(firstName + j, lastName + j, followername + j, imageUrl);
        users.push(user);
    }
    return users;
}
