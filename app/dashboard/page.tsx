import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {PerformanceChart} from "@/components/dashboard/performancechart";
import {RecentConversations} from "@/components/dashboard/recentconversations";
import {AgentActivity} from "@/components/dashboard/agentactivity";


export default function Dashboard() {
    return (
        <div className="p-8 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6">
                <StatsCard title="Invites" value="12,898" change="+128.8%" trend="up" color="blue" />
                <StatsCard title="Conversations" value="2,695" change="+117.2%" trend="up" color="green" />
                <StatsCard title="Conversions" value="148" change="1.2%" subtitle="conversion rate" color="orange" />
            </div>

            {/* Performance Chart */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Performance</CardTitle>
                        <CardDescription>Showing activity for the last 90 days</CardDescription>
                    </div>
                    <Button variant="outline">Last 90 days</Button>
                </CardHeader>
                <CardContent>
                    <PerformanceChart />
                </CardContent>
            </Card>

            {/* Bottom Section */}
            <div className="grid grid-cols-2 gap-6">
                <AgentActivity />
                <RecentConversations />
            </div>
        </div>
    )
}

function StatsCard({ title, value, change, subtitle, trend, color }: any) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
                    {title}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold mb-2">{value}</div>
                <div className="text-sm text-green-500 flex items-center gap-1">
                    <span>↗</span>
                    <span>{change}</span>
                </div>
                <div className="text-sm text-muted-foreground">{subtitle || 'from last period'}</div>
            </CardContent>
        </Card>
    )
}
