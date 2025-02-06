import { ShiftChange } from "./shift-change";

export interface Shift{
    id:number;
    shift_day:Date;
    shift_start_time:number;
    shift_end_time:number;
    user_id:string;
}
export interface ShiftComplete{
    shift:Shift;
    shiftChanges:ShiftChange[];
}