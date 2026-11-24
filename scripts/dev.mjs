import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const nextCli = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const server = spawn(
  process.execPath,
  [nextCli, "dev", "--hostname", "0.0.0.0", ...process.argv.slice(2)],
  {
    env: { ...process.env, NODE_ENV: "development" },
    stdio: "inherit",
  }
);

server.on("error", (error) => {
  console.error("Could not start the Next.js development server.", error);
  process.exitCode = 1;
});

server.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
