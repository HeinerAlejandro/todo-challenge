export interface AuthResponse {
    token: string;
}

export interface User {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
}

export type UserResponse = Omit<User, "password" | "password2">;