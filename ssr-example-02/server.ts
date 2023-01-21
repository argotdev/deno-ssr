import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { Router } from "https://deno.land/x/oak/mod.ts";
import { Handlebars } from "https://deno.land/x/handlebars/mod.ts";

const dinos = ["Allosaur", "T-Rex", "Deno"];
const handle = new Handlebars();
const router = new Router();

router.get("/", async (context) => {
  context.response.body = await handle.renderView("index", { dinos: dinos });
});

router.post("/add", async (context) => {
  const { value } = await context.request.body({ type: "json" });
  const { item } = await value;
  dinos.push(item);
  context.response.status = 200;
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
