import EventEmitter from "node:events";
import { Bus } from "./Infrastructure/Bus";

export const bus = new Bus(new EventEmitter)