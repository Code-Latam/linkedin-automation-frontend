"use client";

export default function Contact() {
    return (
        <section id="contact" className="py-28 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                    Contact Us
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
                    Have questions or want to start your AI-powered LinkedIn outreach? Reach out to us!
                </p>

                <div className="grid md:grid-cols-2 gap-10">

                    <div className="flex flex-col justify-center gap-6 text-left">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Email</h3>
                            <p className="text-muted-foreground">support@linkedinaioutreach.com</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Phone</h3>
                            <p className="text-muted-foreground">+1 (123) 456-7890</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Address</h3>
                            <p className="text-muted-foreground">123 AI Street, Tech City, USA</p>
                        </div>
                    </div>
                    {/* Contact Form */}
                    <form className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="border border-border rounded-lg px-4 py-2 text-foreground bg-background focus:ring-2 focus:ring-primary outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="border border-border rounded-lg px-4 py-2 text-foreground bg-background focus:ring-2 focus:ring-primary outline-none"
                        />
                        <textarea
                            placeholder="Your Message"
                            className="border border-border rounded-lg px-4 py-2 text-foreground bg-background focus:ring-2 focus:ring-primary outline-none resize-none h-32"
                        />
                        <button
                            type="submit"
                            className="mt-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition"
                        >
                            Send Message
                        </button>
                    </form>


                </div>
            </div>
        </section>
    );
}
