import { IDB_OPTIONS } from "../config";
import { IDBStore } from "./idb";

export const idb = new IDBStore(IDB_OPTIONS);
