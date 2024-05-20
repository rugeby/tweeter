import {  PostStatusRequest, loadMoreItemsRequest, LoadMoreFeedStoryResponse, User, Follow } from "tweeter-shared";
import {  Status } from "tweeter-shared";
import { StatusFeed } from "tweeter-shared/dist/model/domain/Status";
import { ServiceFactory } from "./ServiceFactory";
import sendMessage from "../../SQS/PostStatusSQS";


export class StatusService extends ServiceFactory{

    public async loadMoreStoryItems(
        event:loadMoreItemsRequest
      ): Promise<LoadMoreFeedStoryResponse > {
        if(event.authToken == null){
          throw new Error("[Bad Request] Missing a Authtoken");
        }
        if(event.pageSize==null){
          throw new Error("[Bad Request] Missing pageSize");
        }
        if(event.user == null){
          throw new Error("[Bad Request] Missing a user");
        }

      if(await this.createAuthTokenProvider().isvalidateAuth(event.authToken)){

        let status = null;
        try{
          status = await this.createStoryProvider().getStory(event.user.alias,event.lastItem!, event.pageSize)
          status.values.forEach(s => s.user = event.user);

          await this.createAuthTokenProvider().putAuthToken(event.authToken);
        }catch(err){
          throw new Error("[Bad Request] " + (err as Error).message);
        }

        //let status: [Status[], boolean]
        if(status) {
          return new LoadMoreFeedStoryResponse(true, status.values, status.hasMorePages);
        }

        else throw new Error("No story posted");

      }
      else{
        throw new Error("login time expired");
      }
      };



       public async loadMoreFeedItems(
        event:loadMoreItemsRequest
      ): Promise<LoadMoreFeedStoryResponse>{
        if(event.authToken == null){
          throw new Error("[Bad Request] Missing a Authtoken");
        }
        if(event.user==null){
          throw new Error("[Bad Request] Missing a User");
        }
        if(event.pageSize == null){
          throw new Error("[Bad Request] Missing a pageSize");
        }

        if(await this.createAuthTokenProvider().isvalidateAuth(event.authToken)){
        let status:Status[] = [];
        let hasMorePages = false;
        try{
          let tempStatus:StatusFeed[] = []
          let feedItems = await this.createFeedProvider().getFeed(event.user.alias, event.lastItem!, event.pageSize);
          hasMorePages = feedItems.hasMorePages;
          tempStatus = feedItems.values;
          console.log(tempStatus);

          const userPromises: Promise<User | undefined>[] = tempStatus.map(async ts => {
            return this.createUserProvider().getUser(ts.userAlias);
        });

        const users = await Promise.all(userPromises);

        users.forEach((user, index) => {
            if (user) {
                let s = new Status(tempStatus[index].post, user, tempStatus[index].timeStamp);
                status.push(s);
            } else {
                console.error(`User with alias ${tempStatus[index].userAlias} not found.`);
            }
        });
        }catch(e){
          throw new Error("[Bad Request] " + (e as Error).message);
        }

        await this.createAuthTokenProvider().putAuthToken(event.authToken);
        return new LoadMoreFeedStoryResponse(true, status, hasMorePages, undefined);
      }
      else{
        throw new Error("login time expired");
      }

      };

      public async postStatus  (
        event:PostStatusRequest
      ): Promise<void>{
        if(event.authToken == null){
          throw new Error("[Bad Request] Missing a Authtoken");
        }
        if(event.newStatus == null){
          throw new Error("[Bad Request] Missing a newStatus");
        }

        if(await this.createAuthTokenProvider().isvalidateAuth(event.authToken)){

        event.newStatus.timestamp = Date.now();
        await this.createStoryProvider().putStory(event.newStatus);
        
        // let followersAliases = await this.createFollowProvider().getJustFollowersAlias(event.newStatus.user.alias);
        // followersAliases.forEach(async alias =>{
        //   await this.createFeedProvider().putFeed(alias, event.newStatus);
        // })
        sendMessage(event.newStatus.user.alias, event.newStatus.post);

        await this.createAuthTokenProvider().putAuthToken(event.authToken);
        // await new Promise((f) => setTimeout(f, 2000));
      }else{
        throw new Error("login time expired");
      }
      };







}



