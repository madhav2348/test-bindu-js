class BinduError extends Error{
    constructor(public code:number,message:string,public data?:unknown){
        super(message);
        this.name ='BinduError'
    }
}
class BinduNetworkError extends Error{
        constructor(message:string,public cause?:unknown){
            super(message)
            this.name = 'BinduNetworkError'
        }
}