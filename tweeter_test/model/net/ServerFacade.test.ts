// import { AuthToken, GetAuthTokenandUserRequest, LoadMoreCyberHumanRequest, RegisterRequest, User, loadMoreItemsRequest } from "tweeter-shared";
// import { ServerFacade } from "../../../src/model/net/ServerFacade";
// import "isomorphic-fetch";

// describe('ServerFacade integration tests', () => {
//   let serverFacade: ServerFacade;

//   serverFacade = new ServerFacade();


//   const PageSize = 20
//   test('Register', async () => {
//     const registerRequest = new RegisterRequest('Allen', 'Anderson', '@allen', 'password', 'https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png');
//     const response = await serverFacade.register(registerRequest);
//     let thisUser = response.user;
//     expect(response.success).toBe(true);
//     expect(thisUser.alias).toBe(registerRequest.alias);
//     expect(thisUser.firstName).toBe(registerRequest.firstName);
//     expect(thisUser.lastName).toBe(registerRequest.lastName);
//     expect(thisUser.imageUrl).toBe(registerRequest.userImageBytes);

//   });

//   test('Get a list of Followers', async () => {
//     let authToken :AuthToken = AuthToken.Generate();
//     let userTest:User = new User("John", "Anderson", "@allen", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png")

//     const request = new LoadMoreCyberHumanRequest(authToken, userTest, PageSize, null);

//     const response = await serverFacade.loadMoreFollowers(request);
//     expect(response.followers).toBeDefined();
//     expect(response.loadMore).toBe(true);
//     expect(response.followers.length).toBeGreaterThan(5);
    
//   });

//   test('can get a list of followees count', async () => {
//     let authToken :AuthToken = AuthToken.Generate();
//     let userTest:User = new User("John", "Anderson", "@allen", "https:/123")

//     const request = new GetAuthTokenandUserRequest(authToken, userTest);

//     const response = await serverFacade.getFolloweesCount(request);
    
//     expect(response.followeesCount).toBe(10);

    
//   });

//   test('can get a list of following count', async () => {
//     let authToken :AuthToken = AuthToken.Generate();
//     let userTest:User = new User("John", "Anderson", "@allen", "https:/123")

//     const request = new GetAuthTokenandUserRequest(authToken, userTest);

//     const response = await serverFacade.getFollowersCount(request);
    
//     console.log(response)
//     expect(response.followersCount).toBe(20);

    
//   });

// });
