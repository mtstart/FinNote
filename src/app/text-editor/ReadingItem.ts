import { localDateTime } from "../task/task";

export interface ReadingItem {
    id: string;
    title: string;
    content: string;
    url: string;
    img: string;
    lastUpdate?: localDateTime;
}