export interface UserDto {
    id: number;
    authId: string;
    firstName: string;
    lastName: string;
    email: string;
    registeredAt: Date;
    lastLogin: string;
    displayImageId: string;
}