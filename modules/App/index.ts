import EventEmitter from "node:events";
import { Bus } from "./Bus";

export const bus = new Bus(new EventEmitter)