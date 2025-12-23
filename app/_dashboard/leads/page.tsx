import {Lead} from "@/types/lead";
import {DataTable} from "@/components/dashboard/lead/datatable";
import {columns} from "@/components/dashboard/lead/columns";

const leads: Lead[] = [
    {
        id: "1",
        name: "Jeffrey Hill",
        title: "Director, Sales Development ...",
        assignedTo: "Asen Levov",
        journey: {
            profile: true,
            document: true,
            message: true,
            sync: true,
            chat: true,
        },
        lastContacted: "10/13/2025",
        status: "active",
    },
    {
        id: "2",
        name: "Alexandra Kahr",
        title: "Partnership-as-a-Service to ...",
        assignedTo: "Edryo Shiderski",
        journey: {
            profile: true,
            document: true,
            message: true,
            sync: true,
            chat: true,
            flag: true,
        },
        lastContacted: "10/13/2025",
        status: "active",
    },
    {
        id: "3",
        name: "Michael Scott",
        title: "Regional Manager at Dunder Mifflin",
        assignedTo: "Pam Beesly",
        journey: {
            profile: true,
            document: false,
            message: true,
            sync: false,
            chat: true,
        },
        lastContacted: "09/30/2025",
        status: "pending",
    },
    {
        id: "4",
        name: "Sarah Johnson",
        title: "Marketing Specialist at Initech",
        assignedTo: "Peter Gibbons",
        journey: {
            profile: true,
            document: true,
            message: false,
            sync: true,
            chat: false,
        },
        lastContacted: "10/10/2025",
        status: "active",
    },
    {
        id: "5",
        name: "David Lee",
        title: "Software Engineer at Hooli",
        assignedTo: "Gavin Belson",
        journey: {
            profile: true,
            document: true,
            message: true,
            sync: true,
            chat: true,
        },
        lastContacted: "10/12/2025",
        status: "active",
    },
    {
        id: "6",
        name: "Emily Davis",
        title: "Product Manager at Pied Piper",
        assignedTo: "Richard Hendricks",
        journey: {
            profile: true,
            document: false,
            message: true,
            sync: false,
            chat: true,
        },
        lastContacted: "10/11/2025",
        status: "completed",
    }
    // Add more leads...
]

export default function LeadsPage() {
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={leads} />
        </div>
    )
}
