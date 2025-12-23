import {ThemeProvider} from "@/components/providers/themeProvider";
import {Sidebar} from "@/components/dashboard/sidebar";
import {Topbar} from "@/components/dashboard/topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" >
        <body >
                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
        </body>
        </html>
    )
}