import "./PostStatus.css";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import UserInfoHook from "../userInfo/UserInfoHook";
import { PostStatusPresenter, PostStatusView } from "../../presenter/PostStatusPresenter";
interface Props {
  presenter?: PostStatusPresenter;
}

const PostStatus = (props:Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();


  const { currentUser, authToken } = UserInfoHook();
  const [post, setPost] = useState("");
  const listener:PostStatusView ={
    displayErrorMessage:displayErrorMessage,
    displayInfoMessage:displayInfoMessage,
    clearLastInfoMessage:clearLastInfoMessage,
    clearPost : () => setPost(""),
  }

  const [presenter] = useState(props.presenter?? new PostStatusPresenter(listener));

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    presenter.submitPost(authToken!, post, currentUser!)
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          aria-label="postStatus"
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          onClick={(event) => submitPost(event)}
        >
          Post Status
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={(event) => clearPost(event)}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
