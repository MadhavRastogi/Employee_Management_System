import { ISupSts } from "./ISupSts";

export interface IEmpSts{
    id: number;
    fullName: string;
    score: number;
    status: number;
    supervisors: ISupSts[];
}
