export interface Lead {
    id: string
    name: string
    title: string
    avatar?: string
    assignedTo: string
    journey: {
        profile: boolean
        document: boolean
        message: boolean
        sync: boolean
        chat: boolean
        starred?: boolean
        flag?: boolean
    }
    lastContacted: string
    status: 'active' | 'pending' | 'completed'
}
