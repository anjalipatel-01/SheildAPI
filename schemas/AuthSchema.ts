import {z}  from "zod";
export const RegisterSchema = z.object({
    name: z.string().min(2,"Name is too short"),
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(8,"Password must be 8 characters long").max(100,"Password too long")
}).strict();

export const LoginSchema = z.object({
    email:
     z.string()
     .trim()
     .toLowerCase()
     .email("Invalid email format"),
    password: z.string().min(8,"Password must be 8 characters long").max(100,"Password too long")
});

export type RegisterSchema = z.infer<typeof RegisterSchema>;
export type LoginSchema = z.infer<typeof LoginSchema>;