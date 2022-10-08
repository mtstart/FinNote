import {v4 as uuid} from 'uuid';
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
    id: string;
    name: string;
    teamJoined: number;
    sum: number;
    icon: string;
}

export interface Orders {
    name: string;
    price: number;
    dinnerID: string;
    sharedMember: string[]; //member id
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
