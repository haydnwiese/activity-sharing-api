export interface EventDto {
    id: number;
    creatorId: number;
    title: string;
    description: string;
    createdAt: Date;
    scheduledAt: Date;
    remoteImageId: string;
}

export interface UpcomingEventDto extends EventDto {
    attendeeCount: number;
    userDisplayImageUrls: string[];
}