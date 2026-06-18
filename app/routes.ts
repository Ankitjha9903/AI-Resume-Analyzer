import { type RouteConfig, index, route } from "@react-router/dev/routes";
import path from "path";

export default [
  index("routes/home.tsx"),
  // cast to any because a plain string path is not assignable to RouteConfigEntry
  // "routes/auth.tsx" as any
  route("/auth", "routes/auth.tsx"),
  route("/upload", "routes/upload.tsx"),
] satisfies RouteConfig;
