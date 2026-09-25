export default function InstructionalVideos() {
    return (
        <section id="videos" className="relative overflow-hidden py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                        Instructional Videos
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Learn how to get the most out of Meeting Maker with step-by-step walkthroughs.
                    </p>
                </div>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

                    {/* Video 1 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/uu9_BWFRmwc"
                                title="General Overview of The Meeting Maker"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            General Overview of The Meeting Maker
                        </h3>
                    </div>

                    {/* Video 2 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/_DDo2W2iTto&t=20s"
                                title="How to setup your Meeting Maker agents for success"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            How to setup your Meeting Maker agents for success
                        </h3>
                    </div>

                    {/* Video 3 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/rbLqj2U-3Gg"
                                title="How to setup Meeting Maker campaigns for marketing"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            How to setup Meeting Maker campaigns for marketing
                        </h3>
                    </div>

                    {/* Video 4 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/ZWfAKzQZNXU"
                                title="How to setup Meeting Maker Campaigns for outreach"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            How to setup Meeting Maker Campaigns for outreach
                        </h3>
                    </div>

                    {/* Video 5 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/gr1KXkcBHKQ"
                                title="How to read your Meeting Maker dashboard"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            How to read your Meeting Maker dashboard
                        </h3>
                    </div>
                

                </div>

            </div>
        </section>
    );
}