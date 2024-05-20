import { AuthToken, PostStatusRequest, Status, User, loadMoreItemsRequest} from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";


export class StatusService{
    public async loadMoreStoryItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        let moreStoryItemsRequest = new loadMoreItemsRequest(authToken, user, pageSize, lastItem );
        let response = await ServerFacade.instance.loadMoreStoryItem(moreStoryItemsRequest);
        let statuses: Status[] = response.statuses;
        let loadMore : boolean = response.loadMore;


        if (statuses === null) {
            throw new Error("[Bad Request] Missing 'Statuses' field");
        } else if (loadMore === null) {
            throw new Error("[Bad Request] Missing 'LoadMore' field");
        }


        return [statuses, loadMore];
  
      };

      public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]>{
     
        let feedRequest = new loadMoreItemsRequest(authToken, user, pageSize, lastItem);

        let response = await ServerFacade.instance.loadMoreFeedItems(feedRequest);
        console.log(`Response is ${JSON.stringify(response)}`)

        let statuses: Status[] = response.statuses;
        let loadMore : boolean = response.loadMore;
        console.log(`loadMore = ${loadMore}`
        )


        if (statuses === null) {
            throw new Error("[Bad Request] Missing 'Statuses' field");
        } 
        if (loadMore === null) {
            throw new Error("[Bad Request] Missing 'LoadMore' field");
        }

        console.log("status:", statuses);
        console.log("loadMore",loadMore);


        return [statuses, loadMore];
      };



      public async postStatus  (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void>{
        let postStatusRequest = new PostStatusRequest(authToken, newStatus);
        let response = await ServerFacade.instance.postStatus(postStatusRequest);
        if (response === null) {
          throw new Error("[Bad Request] Missing 'Status' field");
      }
        await new Promise((f) => setTimeout(f, 2000));
    
        
      };

}