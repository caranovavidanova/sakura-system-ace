import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("sakuraApp", {
  version: process.env.npm_package_version,
});
