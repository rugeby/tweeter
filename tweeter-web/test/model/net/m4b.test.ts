import { AuthToken, GetUserRequest, LoginRequest,  loadMoreItemsRequest, User } from "tweeter-shared";
import { ServerFacade } from "../../../src/model/net/ServerFacade";
import {PostStatusPresenter, PostStatusView} from "../../../src/presenter/PostStatusPresenter";
import { instance, mock, verify ,spy, when, anything, capture} from "ts-mockito";
import { StatusService } from "../../../src/model/service/StatusService";
import "isomorphic-fetch"

describe('Milestone4b Integration Tests', () => {

    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;
    let serverFacade: ServerFacade;
    serverFacade = new ServerFacade();
    // Mock data
    let username = "@ruby";
    let password = "123";
    let token = new AuthToken("", Date.now());
    let user = new User("", "", "", "");
    let post = "yeah? Pass?";


    beforeAll(() => {

        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(postStatusPresenterSpy.userService).thenReturn(mockStatusServiceInstance);


    });

    beforeEach(() => {

    }
    );


    //Test 1
    it('1. Login a user', async () => {

        let request = new LoginRequest(username, password);
        const response = await serverFacade.login(request);
        token = response.token;
        // Verify that the login was successful
        expect(response.success).toBe(true);
        expect(response.token).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.user.alias).toBe(username);
        expect(response.user.firstName).toBe("ruby");
        expect(response.user.lastName).toBe("LI");
        expect(response.user.imageUrl).toBeDefined();

    });



    //Test2
    it('2. Post a status from the user to the server by calling the "post status" operation on the relevant Presenter.\n3. Verify that the "Successfully Posted!" message was displayed to the user.', async () => {
        

        let response = new GetUserRequest(username, token);
        let sender = await serverFacade.getUser(response);
        user = sender.user;
        
        await postStatusPresenter.submitPost(token, post, sender.user);
        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
        verify(mockPostStatusView.clearPost()).once();
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

    });




    it('4. Retrieve the user\'s story from the server to verify that the new status was correctly appended to the user\'s story, and that all status details are correct.', async () => {
        // Get the user's story
        let request = new loadMoreItemsRequest(token, user, 10, null);
        let response = await serverFacade.loadMoreStoryItem(request);

        // Verify that the status was correctly appended to the user's story    
  
        expect(response.statuses).toBeDefined();
        expect(response.statuses.length).toBeGreaterThan(0);
        let status = response.statuses[0];
        expect(status.post).toBe(post);
        expect(status.user.alias).toBe("@ruby");
        expect(status.user.firstName).toBe("ruby");
        expect(status.user.lastName).toBe("LI");
        expect(status.timestamp).toBeDefined();


    }
    );

});