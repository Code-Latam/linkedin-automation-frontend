"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Conversation {
    id: string
    name: string
    message: string
    avatar?: string
    timestamp: string
    initials: string
}

const conversations: Conversation[] = [
    {
        id: '1',
        name: 'Brittany Fitness',
        message: 'You: Hi Brittany, saw your focus on inventory integrity at Fliw...',
        timestamp: '5 days ago',
        initials: 'BF',
    },
    {
        id: '2',
        name: 'Sean Healy',
        message: 'You: Hi Sean, I see you consult and invest in small businesses...',
        timestamp: 'about 10 hours ago',
        initials: 'SH',
    },
    {
        id: '3',
        name: 'Chee King Ng',
        message: "You: Hi Chee King, I saw Logimark's focus on using smart te...",
        timestamp: '1 day ago',
        initials: 'CK',
    },
    {
        id: '4',
        name: 'Sohan Shetty',
        message: "You: That's a symptom of the real problem. The model of 'bl...",
        timestamp: '4 minutes ago',
        initials: 'SS',
    },
    {
        id: '5',
        name: 'Neil Bhuiyan',
        message: 'Neil reacted 👍',
        timestamp: '5 days ago',
        initials: 'NB',
    },
]

export function RecentConversations() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                    <CardTitle>Recent Conversations</CardTitle>
                    <CardDescription>Latest messages from your leads.</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                        {conversation.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold leading-none">
                                            {conversation.name}
                                        </p>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {conversation.timestamp}
                    </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {conversation.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
