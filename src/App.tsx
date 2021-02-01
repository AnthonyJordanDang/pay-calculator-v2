import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
    timeObject,
    initTimeState,
    timeStatsObject,
    initTimeStats,
} from "models";
import {
    calcDuration,
    replaceItemAtIndex,
    removeItemAtIndex,
} from "utility/helper";
import { v4 as uuidv4 } from "uuid";

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const timeState = atom({
    key: "timeState",
    default: [initTimeState],
});

const timeRateState = atom({
    key: "timeRateState",
    default: 14,
});

const timeStatsState = selector({
    key: "timeStatsState",
    get: ({ get }) => {
        const shiftList = get(timeState);
        const rate = get(timeRateState);
        const totalDuration = shiftList.reduce(
            (accum, current) =>
                accum +
                calcDuration(
                    current.startTime,
                    current.endTime,
                    current.startPeriod,
                    current.endPeriod,
                    rate
                ),
            0
        );

        return {
            total: totalDuration,
        };
    },
});

function TimeShiftStats() {
    const timeStats = useRecoilValue(timeStatsState);
    return <p> Total: {timeStats.total} </p>;
}

function ShiftList() {
    const shiftList = useRecoilValue(timeState);

    return (
        <div>
            <TimeCreator />
            <TimeRate />

            {shiftList.map((shiftItem) => (
                <ShiftListItem key={shiftItem.id} item={shiftItem} />
            ))}
        </div>
    );
}

function TimeRate() {
    const [timeRateInput, setTimeRateInput] = useRecoilState(timeRateState);
    const setTimeRate = useSetRecoilState(timeRateState);

    const editRate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const new_rate: number = parseInt(e.target.value);
        setTimeRate(new_rate);
    };
    return (
        <div>
            <input
                type="number"
                name="rate"
                onChange={editRate}
                value={timeRateInput}
            >
            </input>
        </div>
    );
}

function TimeCreator() {
    const [timeStateInput, setTimeStateInput] = useState(initTimeState);
    const setTimeList = useSetRecoilState(timeState);

    const addTime = () => {
        setTimeList((oldTimeList) => [
            ...oldTimeList,
            {
                id: uuidv4(),
                startTime: "00:00",
                endTime: "00:00",
                startPeriod: "am",
                endPeriod: "am",
            },
        ]);
        setTimeStateInput(initTimeState);
    };

    return (
        <div>
            <button onClick={addTime}>Add</button>
        </div>
    );
}

interface ShiftListItemProps {
    key: string;
    item: timeObject;
}

function ShiftListItem({ key, item }: ShiftListItemProps) {
    const [shiftList, setShiftList] = useRecoilState(timeState);
    const index = shiftList.findIndex(
        (shiftItem: timeObject) => shiftItem === item
    );

    const editShiftItemTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newList = replaceItemAtIndex(shiftList, index, {
            ...item,
            [e.target.name]: e.target.value,
        });

        setShiftList(newList);
    };

    const editShiftItemPeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newList = replaceItemAtIndex(shiftList, index, {
            ...item,
            [e.target.name]: e.target.value,
        });

        setShiftList(newList);
    };

    const deleteShiftItem = () => {
        const newList = removeItemAtIndex(shiftList, index);
        setShiftList(newList);
    };

    return (
        <div>
            <input
                type="time"
                id="appt"
                name="startTime"
                min="00:00"
                max="11:59"
                required
                value={item.startTime}
                onChange={editShiftItemTime}
            ></input>
            <select
                name="startPeriod"
                value={item.startPeriod}
                onChange={editShiftItemPeriod}
            >
                <option value="am">am</option>
                <option value="pm">pm</option>
            </select>
            to
            <input
                type="time"
                id="appt"
                name="endTime"
                min="00:00"
                max="11:59"
                required
                value={item.endTime}
                onChange={editShiftItemTime}
            ></input>
            <select
                name="endPeriod"
                value={item.endPeriod}
                onChange={editShiftItemPeriod}
            >
                <option value="am">am</option>
                <option value="pm">pm</option>
            </select>
            <button onClick={deleteShiftItem}>
                X
            </button>
            
        </div>
    );
}

function App() {
    return (
        <RecoilRoot>
            <div className="App">
                <TimeShiftStats />
                  
                <ShiftList />
            </div>
        </RecoilRoot>
    );
}

export default App;
