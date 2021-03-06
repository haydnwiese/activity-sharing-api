export interface InviteDto {
    id: number;
    eventId: number;
    sourceId: number;
    targetId: number;
    createdAt: Date;
    status: InviteStatus;
}

export enum InviteStatus {
    Sent,
    Accepted,
    Declined
}