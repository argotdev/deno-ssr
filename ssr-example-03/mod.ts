import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { Router } from "https://deno.land/x/oak/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { render } from "./client.js";
import { resolve } from "https://deno.land/std@0.172.0/path/mod.ts";
const html = await Deno.readTextFile("./client.html");

const dinos = ["Allosaur", "T-Rex", "Deno"];
const router = new Router();

router.get("/client.js", async (context) => {
  const path = resolve("./client.js");
  console.log(Deno.cwd());
  await context.send({
    root: Deno.cwd(), // Deno.cwd() is the current working directory
    index: "client.js",
  });
});

router.get("/", async (context) => {
  const document = new DOMParser().parseFromString(
    "<!DOCTYPE html>",
    "text/html"
  );
  render(document, { dinos });
  context.response.type = "text/html";
  context.response.body = `${document.body.innerHTML}${html}`;
});

router.get("/data", async (context) => {
  //send dinos to the client
  context.response.body = dinos;
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
