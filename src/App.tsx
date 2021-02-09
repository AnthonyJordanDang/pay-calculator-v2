import React, { useState } from "react";
import "./scss/main.scss";
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

import "date-fns";

import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from "@material-ui/pickers";

import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Divider } from "@material-ui/core";

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
                    current.startTime.toLocaleTimeString(),
                    current.endTime.toLocaleTimeString(),
                    rate
                ),
            0
        );

        return {
            total: totalDuration,
        };
    },
});

function TotalPay() {
    const timeStats = useRecoilValue(timeStatsState);
    return (
        <h1 className="--title-amount">
            {" "}
            $ {timeStats.total.toFixed(2)}{" "}
        </h1>
    );
}

function ShiftList() {
    const shiftList = useRecoilValue(timeState);

    return (
        <div className="list">
            {shiftList.map((shiftItem) => (
                <div className="--list-row">
                    <ShiftListItem key={shiftItem.id} item={shiftItem} />
                    <div className="--list-item-divider">
                        <Divider />
                    </div>
                </div>
            ))}
        </div>
    );
}

function TimeRate() {
    const [timeRateInput, setTimeRateInput] = useRecoilState(timeRateState);
    const setTimeRate = useSetRecoilState(timeRateState);

    const editRate = (e: any) => {
        console.log("this is the value of the rate " + e.target.value);
        console.log("this is the current value of the rate " + timeRateInput);
        let new_rate: number = parseInt(e.target.value);
        if (isNaN(new_rate)) {
            new_rate = 0;
        }

        setTimeRate(new_rate);
    };

    return (
        <div className="input-rate">
            {isNaN(timeRateInput) ? (
                <TextField
                    error
                    id="outlined-error"
                    label="Please enter valid rate"
                    defaultValue="0"
                    onChange={editRate}
                    value={timeRateInput}
                    variant="outlined"
                />
            ) : (
                <TextField
                    id="filled-basic"
                    label="$/hour"
                    variant="filled"
                    name="rate"
                    onChange={editRate}
                    value={timeRateInput}
                />
            )}
        </div>
    );
}

function AddTime() {
    const [timeStateInput, setTimeStateInput] = useState(initTimeState);
    const setTimeList = useSetRecoilState(timeState);
    const [shiftList, setShiftList] = useRecoilState(timeState);

    const addTime = () => {
        console.log(timeState);
        setTimeList((oldTimeList) => [
            ...oldTimeList,
            {
                id: uuidv4(),
                startTime: new Date(),
                endTime: new Date(),
            },
        ]);
        setTimeStateInput(initTimeState);
    };

    return (
        <Button variant="contained" color="primary" onClick={addTime}>
            Add
        </Button>
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

    const editShiftItemTime = (timeDesc: string, event: any) => {
        console.log(shiftList);
        const newList = replaceItemAtIndex(shiftList, index, {
            ...item,
            [timeDesc]: event,
        });

        setShiftList(newList);
    };

    const deleteShiftItem = (e: any) => {
        console.log("gang");
        console.log(e.target.id);
        const newList = removeItemAtIndex(shiftList, index);
        setShiftList(newList);
    };

    return (
        <div className="--list-item">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div className="--list-item-time">
                    <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Start Time"
                        value={item.startTime}
                        onChange={(event) =>
                            editShiftItemTime("startTime", event)
                        }
                        KeyboardButtonProps={{
                            "aria-label": "change time",
                        }}
                    />
                </div>

                <div className="--list-item-time">
                    <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        name="endTime"
                        label="End Time"
                        value={item.endTime}
                        onChange={(event) =>
                            editShiftItemTime("endTime", event)
                        }
                        KeyboardButtonProps={{
                            "aria-label": "change time",
                        }}
                    />
                </div>
            </MuiPickersUtilsProvider>

            <div className="--list-item-delete">
                <IconButton onClick={deleteShiftItem}>
                    <CloseIcon />
                </IconButton>
            </div>
        </div>
    );
}

function App() {
    return (
        <RecoilRoot>
            <div id="container" className="App">
                <div className="amount">
                    <TotalPay />
                </div>
                <div className="options">
                    <AddTime />
                    <TimeRate />
                </div>
                <ShiftList />
            </div>
        </RecoilRoot>
    );
}

export default App;
