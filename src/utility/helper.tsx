import {timeObject} from 'models';


//calculates the duration in hours
export const calcDuration = (
    start: string,
    end: string,
    startPeriod: string,
    endPeriod: string,
    rate: number,

): number => {
    //special case: works evening past midnight
    let startHour: number = parseInt(start.substr(0,3),10);
    let startMin: number = parseInt(start.substr(3,5),10);

    let endHour: number = parseInt(end.substr(0,3),10);
    let endMin: number = parseInt(end.substr(3,5),10);

    if(startPeriod=="pm"&&endPeriod=="am") {
        if(endHour<12) {
            endHour+=12;
        }
    }
    else {
        if(startPeriod=="pm") {
            startHour+=12;
        }
        if(endPeriod=="pm") {
            endHour+=12;
        }
    }

    let startInMinutes: number = (startHour*60)+startMin;
    let endInMinutes: number = (endHour*60)+endMin;

    let duration: number = (endInMinutes-startInMinutes)/60;
    let cost: number = Number((duration*rate).toFixed(2));
    return cost;
}

export function replaceItemAtIndex(
    arr: timeObject[],
    index: number,
    newValue: timeObject
) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export function removeItemAtIndex(arr: timeObject[], index: number) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

