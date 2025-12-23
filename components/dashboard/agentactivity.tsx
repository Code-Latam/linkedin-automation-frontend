import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThumbsUp, MessageCircle } from 'lucide-react'

export function AgentActivity() {
    const activities = [
        { agent: 'Etienne Bresciani', action: 'user-added', lead: 'Rusalin Iliev', time: '1 minute ago' },
        { agent: 'Etienne Bresciani', action: 'thumbs-up', lead: 'Rusalin Iliev', time: '1 minute ago' },
        // Add more activities...
    ]

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Agent Activity</CardTitle>
                    <p className="text-sm text-muted-foreground">A log of the latest actions from your agents.</p>
                </div>
                <Button variant="outline">View All</Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar><AvatarFallback>EB</AvatarFallback></Avatar>
                            <div>
                                <p className="font-medium">{activity.agent}</p>
                                <p className="text-sm text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                        {activity.action === 'thumbs-up' ? <ThumbsUp className="w-5 h-5 text-orange-500" /> : <MessageCircle className="w-5 h-5" />}
                        <div className="flex items-center gap-2">
                            <span className="text-sm">{activity.lead}</span>
                            <Avatar className="w-8 h-8"><AvatarFallback>RI</AvatarFallback></Avatar>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
