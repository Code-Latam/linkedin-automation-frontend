import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/dashboard/sidebar'
import {ThemeProvider} from "@/components/providers/themeProvider";
import {Topbar} from "@/components/dashboard/topbar";
const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                {/* Sidebar */}
                <Sidebar />
                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Topbar */}
                    <Topbar />

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
        </body>
        </html>
    )
}
