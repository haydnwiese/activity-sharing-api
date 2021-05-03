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

export class ProfileDto {
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    friendCount: number;

    constructor(firstName: string, lastName: string, profileImageUrl: string, friendCount: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileImageUrl = profileImageUrl;
        this.friendCount = friendCount;
    }
}