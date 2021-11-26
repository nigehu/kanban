import { DropResult } from "react-smooth-dnd";
import IPost from "./IPost";

export default interface IDropResult extends DropResult {
  payload: IPost; // the payload object retrieved by calling getChildPayload function.
}
