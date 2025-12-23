"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    BarChart3,
    Lightbulb,
    Bot,
    FileText,
    Users,
    UserPlus,
    Settings,
    HelpCircle,
    UsersRound,
    Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItemProps {
    icon: React.ComponentType<{ className?: string }>
    label: string
    href: string
}

function NavItem({ icon: Icon, label, href }: NavItemProps) {
    const pathname = usePathname()
    const isActive = pathname === href || pathname.startsWith(href + '/dashboard')

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </Link>
    )
}

export function Sidebar() {
    return (
        <aside className="w-64 border-r border-border bg-card p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-8">

                <Link
                    href="/"
                    className="group flex items-center gap-2 font-bold text-lg"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-1.5 rounded-lg">
                            <Sparkles className="w-5 h-5 text-black" strokeWidth={2.5} />
                        </div>
                    </div>
                    <span className="text-gradient">LeadGenAI</span>
                </Link>
            </div>
            {/* Main Navigation */}
            <nav className="space-y-1 flex-1">
                <NavItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
                <NavItem icon={BarChart3} label="Analytics" href="/dashboard/analytics" />
                <NavItem icon={Lightbulb} label="Insights" href="/dashboard/insights" />
                <NavItem icon={Bot} label="Agents" href="/dashboard/agents" />
                <NavItem icon={FileText} label="Intent Signals" href="/dashboard/intent-signals" />
                <NavItem icon={FileText} label="Posts" href="/dashboard/posts" />
                <NavItem icon={Users} label="Leads" href="/dashboard/leads" />
                <NavItem icon={UserPlus} label="Add Leads" href="/dashboard/add-leads" />
            </nav>

            {/* Bottom Navigation */}
            <div className="border-t border-border pt-4 space-y-1">
                <NavItem icon={Settings} label="Admin Panel" href="/dashboard/admin-panel" />
                <NavItem icon={UsersRound} label="Partners Program" href="/dashboard/partners-program" />
                <NavItem icon={HelpCircle} label="Help Center" href="/dashboard/help-center" />
            </div>
        </aside>
    )
}
