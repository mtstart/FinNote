import { localDateTime } from 'src/app/task/task';
// import * as jspb from 'google-protobuf'



export interface Dinner {
    id: string;
    dinnerID: string;
    name: string;
    activity?: Activity;  // type, e.g. food/ gift...
    icon: string;
    members: Eaters[];
    orders: Orders[];
    totalSum: number;
    lastUpdate?: localDateTime;
}


// export class DinnerDataset extends jspb.Message {

//     getId(): string;
//     setId(value: string): DinnerDataset;

//     serializeBinary(): Uint8Array {
//         throw new Error('Method not implemented.');
//     }
//     toObject(includeInstance?: boolean | undefined): {} {
//         throw new Error('Method not implemented.');
//     }
    
// }



export interface Eaters {
    privilege: string[];
    Status: number;
    Username: string;
    icon: string;
    id: string;
    sum: number;
    color?: string;
    joinedDinner?: boolean;
}

export interface Orders {
    id: string;
    name: string;
    price: number;
    dinnerID: string;
    sharedMember: Eaters[]; //member id
}
// In database: Orders
// name: string;
// price: number;
// dinnerID: string;
// sharedMember: string;


export enum Activity {
    Food,
    Gift,
    Groceries,
}

