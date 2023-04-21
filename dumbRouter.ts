import Router from "./Router.ts";

const router = new Router("dumbRouter");

router.get("/dumb", () => new Response("From dumb Router"));

export default router;
