"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    MoreHorizontal,
    ArrowUpDown,
    Users,
    FileText,
    Send,
    RefreshCw,
    MessageSquare,
    Star,
    Flag
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Lead } from "@/types/lead"

export const columns: ColumnDef<Lead>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const lead = row.original
            const initials = lead.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={lead.avatar} alt={lead.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {lead.title}
                        </div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => (
            <div className="text-sm">{row.getValue("assignedTo")}</div>
        ),
    },
    {
        id: "journey",
        header: "Journey",
        cell: ({ row }) => {
            const journey = row.original.journey
            return (
                <div className="flex items-center gap-2">
                    <Users className={`h-5 w-5 ${journey.profile ? 'text-blue-500' : 'text-gray-600'}`} />
                    <FileText className={`h-5 w-5 ${journey.document ? 'text-blue-500' : 'text-gray-600'}`} />
                    <Send className={`h-5 w-5 ${journey.message ? 'text-blue-500' : 'text-gray-600'}`} />
                    <RefreshCw className={`h-5 w-5 ${journey.sync ? 'text-blue-500' : 'text-gray-600'}`} />
                    <MessageSquare className={`h-5 w-5 ${journey.chat ? 'text-blue-500' : 'text-gray-600'}`} />
                    {journey.starred && <Star className="h-5 w-5 text-green-500 fill-green-500" />}
                    {journey.flag && <Flag className="h-5 w-5 text-orange-500 fill-orange-500" />}
                </div>
            )
        },
    },
    {
        accessorKey: "lastContacted",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent"
                >
                    Last Contacted
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-sm">{row.getValue("lastContacted")}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const lead = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(lead.id)}>
                            Copy lead ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Send message</DropdownMenuItem>
                        <DropdownMenuItem>Reassign</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete lead</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
