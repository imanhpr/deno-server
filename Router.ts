import { ConnInfo } from "https://deno.land/std@0.184.0/http/server.ts";

export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
}

type HandlerFunction = (
  req: Request,
  connInfo: ConnInfo
) => Response | Promise<Response>;

class Route {
  constructor(
    public readonly method: HTTP_METHODS,
    public readonly path: string,
    public readonly handler: HandlerFunction
  ) {}
}
export default class Router {
  private GET_REPO: Route[] = [];
  private POST_REPO: Route[] = [];
  constructor(readonly routerName: string) {}
  get(path: string, handler: HandlerFunction) {
    const newHandler = new Route(HTTP_METHODS.GET, path, handler);
    this.GET_REPO.push(newHandler);
  }
  post(path: string, handler: HandlerFunction) {
    const newHandler = new Route(HTTP_METHODS.POST, path, handler);
    this.POST_REPO.push(newHandler);
  }
  findRoute(method: HTTP_METHODS, path: URL) {
    switch (method) {
      case HTTP_METHODS.GET: {
        return this.GET_REPO.find((route) => route.path === path.pathname);
      }
      case HTTP_METHODS.POST: {
        return this.POST_REPO.find((route) => route.path === path.pathname);
      }
    }
  }
  get allRoutes() {
    return [...this.GET_REPO, ...this.POST_REPO];
  }
}
