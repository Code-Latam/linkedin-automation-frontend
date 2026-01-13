
import {Metadata} from "next";

const name = "Astrolab Meeting Maker";
const faviconIcon = "logo/logo.jpeg";
const baseUrl = "https://www.meetingmaker.tech";

export const pagesMetaData = {
    main: {
        title: `${name}`,
        description: "Astrolab Meeting Maker helps you schedule meetings effortlessly.",
        icons: faviconIcon,
        openGraph: {
            title: `${name}`,
            description:
                "Astrolab Meeting Maker is an AI-powered scheduling tool that simplifies the process of arranging meetings. " +
                "With seamless calendar integration and smart suggestions, it ensures you never miss an important appointment.",
            url: baseUrl,
            siteName: name,
            images: [
                {
                    url: `https://www.meetingmaker.tech/logo.png`,
                    width: 1200,
                    height: 630,
                    alt: `${name} - Meeting Scheduler`,
                },
            ],
            type: "website",
        },
    } as Metadata,

    home: {
        title: `${name} | Home`,
        description: "Astrolab Meeting Maker helps you schedule meetings effortlessly.",
        icons: faviconIcon,
        openGraph: {
            title: `${name} | Home`,
            description:
                "Astrolab Meeting Maker is an AI-powered scheduling tool that simplifies the process of arranging meetings. " +
                "With seamless calendar integration and smart suggestions, it ensures you never miss an important appointment.",
            url: baseUrl,
            siteName: name,
            images: [
                {
                    url: `https://www.meetingmaker.tech/logo.png`,
                    width: 1200,
                    height: 630,
                    alt: `${name} - Meeting Scheduler`,
                },
            ],
            type: "website",
        },
    } as Metadata,
};