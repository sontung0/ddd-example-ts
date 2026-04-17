import EventEmitter from "node:events";
import { Bus } from "./infrastructure/bus";

export const bus = new Bus(new EventEmitter)