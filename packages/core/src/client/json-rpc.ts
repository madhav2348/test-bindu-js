/**
 * JSON-RPC 2.0 endpoints for agent communication. All JSON-RPC methods are sent as POST requests to the root endpoint.
 */
interface RpcType{
    sendMessage():Promise<void>
    sendMessagewithPayment():Promise<void>
    sendMessageWithRefrence():Promise<void>
    getTask():Promise<void>
    getTaskStatus():Promise<void>
    getTaskList():Promise<void>
    cancelTask():Promise<void>
    listContext():Promise<void>
    clearContext():Promise<void>
  
}
interface JsonRpcRequest {}
interface JsonRpcResPonse {}
