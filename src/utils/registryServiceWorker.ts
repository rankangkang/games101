export function registryServiceWorker(path: string) {
  if ("serviceWorker" in navigator) {
    return navigator.serviceWorker
      .register(path, {
        scope: "/",
      })
      .then((registration) => {
        console.log("ServiceWorker registered", registration.scope);
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed", error);
      });
  }
  return Promise.resolve();
}
