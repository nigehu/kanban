import fetchUrl from "./common";
import common from "./common";
import IPost, {
  IPostPositionUpdate,
  IPostSubmission,
  IPostUpdate,
} from "../interfaces/IPost";

async function getPostList() {
  return await fetchUrl<IPost[]>("post");
}

async function getPost(id: number) {
  return await fetchUrl<IPost>("post");
}

async function createPost(post: IPostSubmission) {
  return await fetchUrl<IPost>("post", "POST", post);
}

async function updatePost(id: number, post: IPostUpdate) {
  return await fetchUrl<IPost>(`post/${id}`, "PUT", post);
}

async function patchPositions(positionUpdates: IPostPositionUpdate[]) {
  return await fetchUrl<void>("post/positions", "PATCH", {
    posts: positionUpdates,
  });
}

async function deletePost(id: number) {
  return await fetchUrl<void>(`post/${id}`, "DELETE");
}

export { createPost, updatePost, patchPositions, deletePost };
