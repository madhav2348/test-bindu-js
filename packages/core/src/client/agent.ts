/*
 * Agent metadata and capability discovery endpoints.
 */

interface AgentDiscoveryType{
    getAgent(): Promise<void>
    rootRedirect(): Promise<void>
}