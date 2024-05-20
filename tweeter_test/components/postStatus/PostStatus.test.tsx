// import { MemoryRouter } from "react-router-dom";
// import PostStatus from "../../../src/components/postStatus/PostStatus";
// import { render, screen } from "@testing-library/react";
// import React from "react";
// import userEvent from "@testing-library/user-event";
// import "@testing-library/jest-dom"
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
// import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
// import { instance, mock, verify } from "ts-mockito";
// import  useUserInfoListener  from "../../../src/components/userInfo/UserInfoHook";
// import { AuthToken, User } from "tweeter-shared";

// library.add(fab);

// jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
//     ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
//     __esModule: true,
//     default: jest.fn(),
// }));


// describe("PostStatus Component", () => {

//     let mockUserInstance: User;
//     let mockAuthTokenInstance: AuthToken;


//     beforeAll(() => {
//         mockUserInstance = instance(mock<User>());
//         mockAuthTokenInstance = instance(mock<AuthToken>());

//         (useUserInfoListener as jest.Mock).mockReturnValue({
//             currentUser: mockUserInstance,
//             authToken: mockAuthTokenInstance,
//           });      
//     });




//     // When first rendered the Post Status and Clear buttons are both disabled.
//     it("starts with the Post Status and Clear buttons disabled", () => {

//         const { postStatusButton, clearStatusButton } = renderPostStatusAndGetElements();
//         expect(postStatusButton).toBeDisabled();
//         expect(clearStatusButton).toBeDisabled();

//     });


//     // Both buttons are enabled when the text field has text.
//     it("enables the Post Status and Clear buttons when the text field has text", async () => {
//         const { postStatusButton, clearStatusButton, postStatusTextArea } = renderPostStatusAndGetElements();
//         await userEvent.type(postStatusTextArea, "Hello, World!");
//         expect(postStatusButton).toBeEnabled();
//         expect(clearStatusButton).toBeEnabled();

//     });


//     // Both buttons are disabled when the text field is cleared.
//     it("disables the Post Status and Clear buttons when the text field is cleared", async () => {
//         const { postStatusButton, clearStatusButton, postStatusTextArea } = renderPostStatusAndGetElements();
//         await userEvent.type(postStatusTextArea, "Hello, World!");
//         expect(postStatusButton).toBeEnabled();
//         expect(clearStatusButton).toBeEnabled();

//         await userEvent.clear(postStatusTextArea);
//         expect(postStatusButton).toBeDisabled();
//         expect(clearStatusButton).toBeDisabled();

//     });



//     // The presenter's postStatus method is called with correct parameters when the Post Status button is pressed.

//     it("calls the presenter's postStatus method with correct parameters when the Post Status button is pressed", async () => {
//         const mockPresenter = mock<PostStatusPresenter>();
//         const mockPresenterInstance = instance(mockPresenter);

        
//         const post = "Hello, World!";

//         const { postStatusTextArea,postStatusButton,user } = 
//             renderPostStatusAndGetElements(mockPresenterInstance);

//         await user.type(postStatusTextArea, post);
//         await user.click(postStatusButton);

//         verify(mockPresenter.submitPost(mockAuthTokenInstance, post, mockUserInstance)).once();

//     });


// });



// const renderPostStatus = (presenter?: PostStatusPresenter) => {
//     return render(
//         <>
//             {!!presenter ? (
//                 <PostStatus presenter={presenter} />
//             ) : (
//                 <PostStatus />

//             )}

//         </>
//     );
// }

// const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
//     const user = userEvent.setup();
//     renderPostStatus(presenter);



//     const postStatusTextArea = screen.getByLabelText("postStatus");
//     const postStatusButton = screen.getByRole("button", { name: "Post Status" });
//     const clearStatusButton = screen.getByRole("button", { name: "Clear" });

//     return { postStatusTextArea, postStatusButton, clearStatusButton,user };
// }

