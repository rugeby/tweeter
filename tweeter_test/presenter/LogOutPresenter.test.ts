// import { AuthToken } from "tweeter-shared";
// import {LogOutPresenter, LogOutView} from "../../src/presenter/LogOutPresenter";
// import { instance, mock, verify ,spy, when, anything, capture} from "ts-mockito";
// import { UserService } from "../../src/model/service/UserService";

// describe("LogOutPresenter", ()=>{
//     let mockLogOutView : LogOutView;
//     let logOutPresenter: LogOutPresenter;
//     let mockUserService:UserService;

//     const authToken = new AuthToken("abc123", Date.now());

//     beforeEach(()=>{
//         mockLogOutView=mock<LogOutView>();
//         const mockLogOutViewInstance = instance(mockLogOutView);

//         const logOutPresenterSpy = spy( new LogOutPresenter(mockLogOutViewInstance));
//         logOutPresenter = instance(logOutPresenterSpy);

//         mockUserService = mock<UserService>();
//         const mockUserServiceInstance = instance(mockUserService);

//         when(logOutPresenterSpy.userService).thenReturn(mockUserServiceInstance);

//     });

//     it("tells the view to display a logging out message", async()=>{
//         await logOutPresenter.logOut(authToken);
//         verify(mockLogOutView.displayInfoMessage("Logging Out...", 0)).once();
//     });

//     it("calls logout on the user service with the correct auth token", async()=>{
//         await logOutPresenter.logOut(authToken);
//         verify(mockUserService.logout(authToken)).once();

//         let [capturedAuthtoken] = capture(mockUserService.logout).last();
//         expect(capturedAuthtoken).toEqual(authToken);
//     });

//     it("tells the view to clear the last info message, clear the user info, and navigate to the login page when logout is sucessful", async()=>{
//         await logOutPresenter.logOut(authToken);

//         verify(mockLogOutView.clearLastInfoMessage()).once();
//         verify(mockLogOutView.clearUserInfo()).once();
//         verify(mockLogOutView.navigate("/login")).once();

//         verify(mockLogOutView.displayErrorMessage(anything())).never();
//     });

//     it("displays an error message and does not clear the last info message, clear the user info, and navigate to the login page when logout fail", async()=>{
//         const error = new Error("An error occurred");
//         when(mockUserService.logout(authToken)).thenThrow(error);

//         await logOutPresenter.logOut(authToken);
    
//         verify(mockLogOutView.displayErrorMessage(`Failed to log user out because of exception: An error occurred`)).once();

//         verify(mockLogOutView.clearLastInfoMessage()).never();
//         verify(mockLogOutView.clearUserInfo()).never();
//         verify(mockLogOutView.navigate("/login")).never();
//     });
// });