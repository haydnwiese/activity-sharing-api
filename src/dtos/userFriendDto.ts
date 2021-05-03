export interface UserFriendDto {
    id: number;
    sourceId: number;
    targetId: number;
    status: UserFriendStatus;
    createdAt: Date;
}

export enum UserFriendStatus {
    Sent,
    Accepted
}