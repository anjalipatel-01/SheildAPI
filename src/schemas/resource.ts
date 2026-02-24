import { z } from "zod";

// Reusable UUID param validator
export const UUIDParam = z.object({
    id: z.string().uuid("Invalid resource ID format")
});

// POST / — Create resource
export const CreateResourceSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    secretData: z.string().min(1, "Secret data is required"),
}).strict();

// PATCH /:id — Update resource
export const UpdateResourceSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    secretData: z.string().min(1).optional(),
}).strict();

// POST /admin — Admin create resource
export const AdminCreateResourceSchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    secretData: z.string().min(1, "Secret data is required"),
    targetUserId: z.string().uuid("targetUserId must be a valid UUID"),
}).strict();

// PATCH /admin/:id — Admin update resource
export const AdminUpdateResourceSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    secretData: z.string().min(1).optional(),
}).strict();
