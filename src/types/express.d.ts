import { AuthUser } from "./authUser.js";

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
