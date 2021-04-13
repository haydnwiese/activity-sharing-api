export interface EventDto {
    id: number;
    creatorId: number;
    title: string;
    description: string;
    createdAt: Date;
    scheduledAt: Date;
    remoteImageId: string;
}