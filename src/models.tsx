import {v4 as uuidv4} from "uuid";

export interface timeObject {
    id: string
    startTime: Date
    endTime: Date
}

export const initTimeState : timeObject = {
    id: uuidv4(),
    startTime: new Date("October 13, 2014 12:00:00"),
    endTime: new Date("October 13, 2014 12:00:00"),
}

export interface timeStatsObject {
    total: number
}

export const initTimeStats: timeStatsObject = {
    total:0,
}

