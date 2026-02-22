import { AuthUser } from "./authUser.js";
import { Resource } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
            resource?: Resource;
        }
    }
}
