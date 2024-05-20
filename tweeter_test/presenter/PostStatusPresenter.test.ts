// import { AuthToken, User } from "tweeter-shared";
// import {PostStatusPresenter, PostStatusView} from "../../src/presenter/PostStatusPresenter";
// import { instance, mock, verify ,spy, when, anything, capture} from "ts-mockito";
// import { StatusService } from "../../src/model/service/StatusService";


// describe("PostStatusPresenter", ()=>{
//     let mockPostStatusView :PostStatusView;
//     let postStatusPresenter:PostStatusPresenter;
//     let mockStatusService:StatusService;

//     const authToken = new AuthToken("abc123", Date.now());
//     const currentUser = new User("Rub","Shumway","matt","http://www.fake.com");
//     const post = "when can i finish this hw";
    
//     beforeEach(()=>{
//         mockPostStatusView = mock<PostStatusView>();
//         const mockPostStatusViewInstance = instance(mockPostStatusView);

//         const PostStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
//         postStatusPresenter = instance(PostStatusPresenterSpy);

//         mockStatusService = mock<StatusService>();
//         const mockUserServiceInstance = instance(mockStatusService);

//         when(PostStatusPresenterSpy.userService).thenReturn(mockUserServiceInstance);

//     })

//     it("tells the view to display a posting status message", async()=>{
//         await postStatusPresenter.submitPost(authToken, post, currentUser);
//         verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
//     });

//     it("presenter calls postStatus on the post status service with the correct status string and auth token", async()=>{
//         await postStatusPresenter.submitPost(authToken, post, currentUser);
//         verify(mockStatusService.postStatus(authToken, anything())).once();

//         let [capturedAuthtoken, capturedStatus] = capture(mockStatusService.postStatus).last();
//         expect(capturedAuthtoken).toEqual(authToken);
//         expect(capturedStatus.post).toEqual(post);
//     });

//     it(" tells the view to clear the last info message, clear the post, and display a status posted message When posting of the status is successful", async()=>{
//         await postStatusPresenter.submitPost(authToken, post, currentUser);

//        verify(mockPostStatusView.clearLastInfoMessage()).once();
//         verify(mockPostStatusView.clearPost()).once();
//         verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

//         verify(mockPostStatusView.displayErrorMessage(anything())).never();
//     });

//     it("tells the view to display an error message and does not tell it to do the following: clear the last info message, clear the post, and display a status posted message When posting of the status failed", async()=>{
//         const error = new Error("An error occurred");
//         when(mockStatusService.postStatus).thenThrow(error);

//         await postStatusPresenter.submitPost(authToken, post, currentUser);
    
//         verify(mockPostStatusView.displayErrorMessage(`Failed to post the status because of exception: An error occurred`)).once();

//         verify(mockPostStatusView.clearLastInfoMessage()).never();
//         verify(mockPostStatusView.clearPost()).never();
//         verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
//     });








    
// })


// //3. clear the last info message, clear the post, and display a status posted message.
// //4. 