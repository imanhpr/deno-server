import * as http from "https://deno.land/std@0.184.0/http/mod.ts";
import { ConnInfo } from "https://deno.land/std@0.184.0/http/server.ts";
import Router, { HTTP_METHODS } from "./Router.ts";
import indexRouter from "./indexRouter.ts";
import dumbRouter from "./dumbRouter.ts";

class Malek {
  private routersList: Router[] = [];
  private findRouteHandler(method: HTTP_METHODS, path: URL) {
    for (const routers of this.routersList) {
      const route = routers.findRoute(method, path);
      if (route) return route;
    }
    return new Response("URL not found", { status: 404 });
  }
  private mainHandler(req: Request, connInfo: ConnInfo) {
    const { method, url: rawUrl } = req;
    const url = new URL(rawUrl);
    const responseMaker = this.findRouteHandler(
      method.toUpperCase() as HTTP_METHODS,
      url
    );
    if (responseMaker instanceof Response) return responseMaker;
    const response = responseMaker.handler(req, connInfo);
    return response;
  }
  listen(port: number) {
    const server = new http.Server({
      handler: this.mainHandler.bind(this),
      port,
    });
    console.log("\nServer is listning on port http://localhost:%d", port);
    server.listenAndServe();
  }
  addRouter(router: Router) {
    console.log(
      "===== Router \x1b[33;1m%s\x1b[0m added! =====",
      router.routerName
    );
    router.allRoutes.forEach((route) => {
      console.log(`\x1b[38;5;45m${route.method}\x1b[0m`, route.path);
    });
    this.routersList.push(router);
  }
}
if (import.meta.main) {
  const server = new Malek();
  server.addRouter(indexRouter);
  server.addRouter(dumbRouter);
  server.listen(8000);
}
