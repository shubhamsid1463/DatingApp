export type User = {
    id: string;
    displayName: string;
    email: string;
    token: string;
    imageUrl?:string;
}
export type LoginCredentials = {
    email: string;
    password: string;
}
export type RegisterCreads={
    email:string;
    displayName:string;
    password:string;
}