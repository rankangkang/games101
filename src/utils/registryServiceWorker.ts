export function registryServiceWorker(path: string) {
  if ("serviceWorker" in navigator) {
    return navigator.serviceWorker
      .register(path, {
        scope: "/",
      })
      .then((registration) => {
        console.log("ServiceWorker 注册成功:", registration.scope);
      })
      .catch((error) => {
        console.log("ServiceWorker 注册失败:", error);
      });
  }
  return Promise.resolve();
}
