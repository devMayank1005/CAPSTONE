import express from "express";
import morgan from "morgan";
import {createProxyMiddleware} from "http-proxy-middleware";
const app = express();
app.use(morgan("dev"));

app.use((req, res, next) => {
    const host = req.headers.host;
    const sandboxId = host.split(".")[0];

    const target = `http://sandbox-service-${sandboxId}`;

    return createProxyMiddleware({
        target: target,
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying
        
    })(req, res, next);
}); 
  
export default app