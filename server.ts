import { createServerSideRendering } from "./lib/mod.ts";

const { render } = await createServerSideRendering({
  rootDir: `${Deno.cwd()}/app`,
});

Deno.serve((req) => render(req));
