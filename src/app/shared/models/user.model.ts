import { UserRole } from "./user-role.enum";

export interface User {
    id: number;
    userName: string;
    email: string;
    role: UserRole;
}