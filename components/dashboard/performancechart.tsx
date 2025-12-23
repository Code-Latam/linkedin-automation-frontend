"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "Jan", invites: 186, conversations: 80, conversions: 12 },
    { month: "Feb", invites: 305, conversations: 200, conversions: 18 },
    { month: "Mar", invites: 237, conversations: 120, conversions: 15 },
    { month: "Apr", invites: 273, conversations: 190, conversions: 22 },
    { month: "May", invites: 209, conversations: 130, conversions: 16 },
    { month: "Jun", invites: 314, conversations: 140, conversions: 19 },
    { month: "Jul", invites: 285, conversations: 165, conversions: 24 },
    { month: "Aug", invites: 398, conversations: 245, conversions: 31 },
    { month: "Sep", invites: 456, conversations: 312, conversions: 38 },
    { month: "Oct", invites: 523, conversations: 385, conversions: 45 },
    { month: "Nov", invites: 612, conversations: 458, conversions: 52 },
    { month: "Dec", invites: 689, conversations: 521, conversions: 61 },
]

const chartConfig = {
    invites: {
        label: "Invites",
        color: "hsl(221, 83%, 53%)",
    },
    conversations: {
        label: "Conversations",
        color: "hsl(142, 76%, 36%)",
    },
    conversions: {
        label: "Conversions",
        color: "hsl(25, 95%, 53%)",
    },
} satisfies ChartConfig

export function PerformanceChart() {
    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <defs>
                    <linearGradient id="fillInvites" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="fillConversations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="fillConversions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <Area
                    dataKey="invites"
                    type="natural"
                    fill="url(#fillInvites)"
                    fillOpacity={0.4}
                    stroke="hsl(221, 83%, 53%)"
                    stackId="a"
                />
                <Area
                    dataKey="conversations"
                    type="natural"
                    fill="url(#fillConversations)"
                    fillOpacity={0.4}
                    stroke="hsl(142, 76%, 36%)"
                    stackId="a"
                />
                <Area
                    dataKey="conversions"
                    type="natural"
                    fill="url(#fillConversions)"
                    fillOpacity={0.4}
                    stroke="hsl(25, 95%, 53%)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    )
}
