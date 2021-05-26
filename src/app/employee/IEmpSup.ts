import { ISupervisor } from './ISupervisor';

export interface IEmpSup{
    id: number;
    fullName: string;
    status: number;
    score: number;
    supervisors: ISupervisor[];
}
