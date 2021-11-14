export interface DailyPostResponse {
    id: string,
    name: string,
    api_created: boolean,
    privacy: "public" | "private",
    url: string,
    created_at: string,
    config: {
        start_video_off: boolean,
        start_audio_off: boolean
    }

}
