/// <reference lib="webworker" />

import { ASSIGNMENTS_BASE_PREFIX } from "./config";
import { idb } from "./db";

declare const self: ServiceWorkerGlobalScope;

// 监听安装事件
self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  event.waitUntil(
    idb.getDB().then(() => {
      console.log("service worker db init success");
    })
  );
});

// 监听激活事件
self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  // 立即接管所有客户端，不等待刷新
  event.waitUntil(self.clients.claim());
});

// 监听 fetch 事件
self.addEventListener("fetch", (event) => {
  // 只处理 GET 请求
  if (event.request.method !== "GET") {
    return;
  }

  // 解析 URL 获取 pathname
  const url = new URL(event.request.url);
  const pathname = url.pathname;

  if (!pathname.startsWith(ASSIGNMENTS_BASE_PREFIX)) {
    return;
  }

  // 调试信息：打印所有请求
  console.log("Service Worker intercepted request", {
    url: event.request.url,
    pathname,
    clientId: event.clientId,
    frameType: event.request.mode,
    destination: event.request.destination,
    referrer: event.request.referrer,
  });

  // NOTE: 在异步操作之前调用 respondWith，否则会报错
  event.respondWith(
    (async () => {
      try {
        // 从 IndexedDB 中获取缓存的响应
        const value = await idb.getFileModel(pathname);
        if (value) {
          console.log("Returning cached response for:", event.request.url);
          return new Response(value.value, {
            headers: {
              "Content-Type": value.type || "text/plain",
            },
          });
        } else {
          console.log("Fetching from network:", event.request.url);
          return fetch(event.request);
        }
      } catch (error) {
        console.error("Error in fetch handler:", error);
        return fetch(event.request);
      }
    })()
  );
});
