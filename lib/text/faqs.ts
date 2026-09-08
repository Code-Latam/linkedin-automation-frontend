export const faqsText = {
    header: {
        title: "FAQ",
        subtitle: "We've gone ahead and answered the questions we're asked most often. Can't find what you're looking for? Feel free to reach out to us through the contact form above!"
    },
    items: [
        {
            question: "How can I subscribe?",
            answer: "You can sign up directly from this page using the pricing section. "
        },
        {
            question: "How many connections will one agent add daily?",
            answer:'This is configurable but we recommend to keep it around 20 so there will be no pause in connection requests.'
        },
        {
            question: "How many messages will the agent send daily?",
            answer:'This is configurable but we recommend to keep it around 100 so there will be no pause in message requests.'
        },
        {
            question: "Do you use first message templates?",
            answer:'Conversations are led end to end by AI agents so no templates are used. The agents are trained to handle openings and all known sales objections.'
        },
        ,
        {
            question: "Can I take over the conversation from an AI agent?",
            answer:'Yes you can take over at any time'
        }

    ]
} as const;
