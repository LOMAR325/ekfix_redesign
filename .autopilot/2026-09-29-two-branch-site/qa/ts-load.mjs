// Loads the project's TS modules (lib/*, data/*) in plain node for QA scripts: node's type
// stripping + a resolve hook for "@/…" and extensionless relative imports. No dependency.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
export const ROOT = "/Users/User/Personal Projects/ekfix_redesign";
registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith("@/")) spec = pathToFileURL(path.join(ROOT, spec.slice(2))).href;
    if ((spec.startsWith(".") || spec.startsWith("file:")) && !/\.(m?js|ts|json)$/.test(spec)) {
      for (const ext of [".ts", "/index.ts"]) { try { return next(spec + ext, ctx); } catch {} }
    }
    return next(spec, ctx);
  },
});
export const load = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);
