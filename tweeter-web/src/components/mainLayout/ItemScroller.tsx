import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Status, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoListener from "../userInfo/UserInfoHook";
import { PageItemPresenter, PageItemView } from "../../presenter/PageItemPresenter";
import { StoryPresenter } from "../../presenter/StoryPresenter";
import { StatusService } from "../../model/service/StatusService";
import StatusItem from "../StatusItem/StatusItem";
import { FeedPresenter } from "../../presenter/FeedPresenter";
import { FollowingPresenter } from "../../presenter/FollowingPresenter";
import UserItem from "../userItem/UserItem";
import { FollowersPresenter } from "../../presenter/FollowersPresenter";
import { FollowService } from "../../model/service/FollowService";

interface ItemScrollerProps<T, U> {
    presenterGenerator: (view: PageItemView<T>) => PageItemPresenter<T, U>;
    itemComponentGenerator: (value: T) => JSX.Element;
}




const ItemScroller = <T, U>(props: ItemScrollerProps<T, U>) => {
    const { displayErrorMessage } = useToastListener();
    const [items, setItems] = useState<T[]>([]);
    const itemsReference = useRef(items);
    itemsReference.current = items;


    const { displayedUser, authToken } = useUserInfoListener();

    // Load initial items
    useEffect(() => {
        loadMoreItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    const listener: PageItemView<T> = {
        addItems: (newItems: T[]) =>
            setItems([...itemsReference.current, ...newItems]),
        displayErrorMessage: displayErrorMessage
    };


    const [presenter] = useState(props.presenterGenerator(listener));


    const loadMoreItems = async () => {
        presenter.loadMoreItems(authToken!, displayedUser!);
    };

    return (
        <div className="container px-0 overflow-visible vh-100">
            <InfiniteScroll
                className="pr-0 mr-0"
                dataLength={items.length}
                next={loadMoreItems}
                hasMore={presenter.hasMoreItems}
                loader={<h4>Loading...</h4>}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="row mb-3 mx-0 px-0 border rounded bg-white"
                    >
                        {props.itemComponentGenerator(item)}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};


const StoryProps: ItemScrollerProps<Status, StatusService> = {
    presenterGenerator: function (view: PageItemView<Status>):
        PageItemPresenter<Status, StatusService> {
        return new StoryPresenter(view);
    },
    itemComponentGenerator: function (value: Status): JSX.Element {
        return (< StatusItem value={value.user} status={value} />);
    }
}

export const StoryScroller = () => (<ItemScroller {...StoryProps} />);



const FeedProps: ItemScrollerProps<Status, StatusService> = {
    presenterGenerator: function (view: PageItemView<Status>):
        PageItemPresenter<Status, StatusService> {
        return new FeedPresenter(view);
    },
    itemComponentGenerator: function (value: Status): JSX.Element {
        return (< StatusItem value={value.user} status={value}  />);
    }
}

export const FeedScroller = () => (<ItemScroller {...FeedProps} />);




const FollowingProps: ItemScrollerProps<User, FollowService> = {
    presenterGenerator: function (view: PageItemView<User>):
        PageItemPresenter<User, FollowService> {
        return new FollowingPresenter(view);
    },
    itemComponentGenerator: function (value: User): JSX.Element {
        return (<UserItem value={value} />);
    }
}

export const FollowingScroller = () => (<ItemScroller {...FollowingProps} />);




const FollowersProps: ItemScrollerProps<User, FollowService> = {
    presenterGenerator: function (view: PageItemView<User>):
        PageItemPresenter<User, FollowService> {
        return new FollowersPresenter(view);
    },
    itemComponentGenerator: function (value: User): JSX.Element {
        return (<UserItem value={value} />);
    }
}

export const FollowersScroller = () => (<ItemScroller {...FollowersProps} />);

export default ItemScroller;