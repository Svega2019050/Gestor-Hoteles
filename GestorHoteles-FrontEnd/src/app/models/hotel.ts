export class Hotel{
    constructor(
        public _id: string,
        public name: String,
        public description: String,
        public direction: String,
        public phone: string,
        public admin: String,
        public image: string,
        public room:[],
        public reservation:[]
    ){}
}