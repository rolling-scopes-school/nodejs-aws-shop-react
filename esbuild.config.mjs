import * as esbuild from "esbuild";

const options = {
    format: "esm",
    bundle: true,
    platform: "node",
    packages: "external",
    sourcemap: false,
    minify: false,
    tsconfig: "tsconfig.cdk.json",
};

await esbuild.build({
    entryPoints: ["cdk/index.ts"],
    outfile: "cdk.dist/index.mjs",
    ...options,
});
