import Router from "./Router.ts";

const router = new Router("indexRouter");

router.get("/test", () => new Response("hello from test"));
router.get("/hello", () => new Response("Hello from deno"));
router.post("/getdata", async (req) => {
  if (!(req.headers.get("content-type")?.toLowerCase() === "application/json"))
    return new Response(JSON.stringify({ error: "send valid json" }), {
      status: 400,
    });
  if (req.body === null) {
    return new Response(
      JSON.stringify({ error: "Send a valid payload with your request" }),
      { status: 400 }
    );
  }
  const body = await req.json();
  return Response.json(Object.assign(body, { echo: "from deno" }));
});
export default router;
