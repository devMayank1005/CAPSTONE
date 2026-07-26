import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(morgan("dev"));

app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({
        status: "ok",
    });
});

app.get("/api/status/readyz", (req, res) => {
    res.status(200).json({
        status: "ready",
    });
});


app.use((req, res, next) => {

    const host = req.headers.host;

    console.log("Incoming host:", host);

    const sandboxId = host.split(".")[0];

    console.log("Sandbox ID:", sandboxId);


const target = `http://sandbox-service-${sandboxId}.default.svc.cluster.local:80`;
    console.log("Proxy target:", target);


    return createProxyMiddleware({
        target,
        changeOrigin: true,
        ws: true,

        on: {
            error(err, req, res) {
                console.error(
                    "Proxy error:",
                    err.message
                );

                res.status(502).json({
                    error: "Sandbox proxy failed",
                    message: err.message
                });
            }
        }
    })(req, res, next);
});


export default app;