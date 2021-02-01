import {v4 as uuidv4} from "uuid";

export interface timeObject {
    id: string
    startTime: string
    endTime: string
    startPeriod: string
    endPeriod: string
}

export const initTimeState : timeObject = {
    id: uuidv4(),
    startTime: "00:00",
    endTime: "00:00",
    startPeriod: "am",
    endPeriod: "am",
}

export interface timeStatsObject {
    total: number
}

export const initTimeStats: timeStatsObject = {
    total:0,
}

