import { types } from "mediasoup";
import { MyPeer } from "./MyPeer";

export type Then<T> = T extends PromiseLike<infer U> ? U : T;

export type MyRoomState = Record<string, MyPeer>;

export type MyRooms = Record<
  string,
  { worker: types.Worker; router: types.Router; state: MyRoomState }
>;
