import { Request, Response } from "express";
const rateLimit = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_REQUESTS = 10;

export const rateLimitMiddleware = (req: Request, res: Response, next: Function) => {
    const ip: string = req.ip || "global";
    const now: number = Date.now();
    const requests: number = rateLimit.get(ip) || 0;

    if (requests >= RATE_LIMIT_REQUESTS) {
        return res.status(429).json({ error: "Too many requests. Try again later." });
    }

    rateLimit.set(ip, requests + 1);
    setTimeout(() => rateLimit.set(ip, (rateLimit.get(ip) || 1) - 1), RATE_LIMIT_WINDOW);

    next();
};
