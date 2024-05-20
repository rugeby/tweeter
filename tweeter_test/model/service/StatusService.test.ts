// import { AuthToken, GetAuthTokenandUserRequest, LoadMoreCyberHumanRequest, LoadMoreFeedStoryResponse, LoadMoreFollowersResponse, RegisterRequest, Status, User, loadMoreItemsRequest } from "tweeter-shared";
// import { StatusService } from "../../../src/model/service/StatusService";
// import "isomorphic-fetch";

// describe('StatusService', () => {
//   const statusService = new StatusService();
//   const authToken:AuthToken = AuthToken.Generate();
//   const gril_image_url:string = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png";
//   const boy_image_url:string = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";


//   const lastUser = new User("Amy", "Ames", "@amy", gril_image_url);
//   const firstUser = new User("Alleen", "Anderson", "@allen", boy_image_url);
//   test('Retrieve a list of statuses', async () => {

//     let sender = firstUser;
//     let status = new Status("test", sender, 32);

//     let response = new LoadMoreFeedStoryResponse(true,
//         ...(await statusService.loadMoreStoryItems(authToken, firstUser, 10, null))
//     );
//     expect(response.message).toBeNull;
//     expect(response.success).toBeTruthy;
//     // expect(response.statuses.length).toBeGreaterThan(5);
//     expect(response.loadMore).toBeTruthy;
    
//     let lastItem = response.statuses[-1]
//     response = new LoadMoreFeedStoryResponse(true, 
//         ...(await statusService.loadMoreStoryItems(authToken, firstUser, 30, lastItem)))
//         expect(response.message).toBeNull;
//         expect(response.success).toBeTruthy;
//         // expect(response.statuses.length).toBeGreaterThan(20);
//         expect(response.loadMore).toBeFalsy;

//   });



// });
