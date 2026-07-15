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
                                src="https://www.youtube.com/embed/zuiiqMlNEEE"
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
                                src="https://www.youtube.com/embed/YR6TLKzCZgc"
                                title="How to create your own SDR or BDR agent"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            How to Create Your Own SDR or BDR Agent
                        </h3>
                    </div>

                    {/* Video 3 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/gR5IiO2gMEo"
                                title="How to create your own Marketing Manager Agent"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            How to Create Your Own Marketing Manager Agent and Run Organic Marketing Campaigns
                        </h3>
                    </div>

                    {/* Video 4 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/L6PLGWzFmWI"
                                title="How to Assign Prospects to Your Agents"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            How to Assign People to Your Agents
                        </h3>
                    </div>

                    {/* Video 5 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/xTToS5xjUEg"
                                title="How to Track Your AI Outreach Performance"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            Agents, People List and Dashboard
                        </h3>
                    </div>

                    {/* Video 6 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/oFPYGzWrwtM"
                                title="How to Setup an SEO AI Manager Agent"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            How to Setup an SEO Manager Agent
                        </h3>
                    </div>

                    {/* Video 7 */}
                    <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/DArEDeVQp5E"
                                title="How to Set Up Your Astrolab Meeting Maker Account"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            How to Set Up Your Astrolab Meeting Maker Account
                        </h3>
                    </div>

                </div>

            </div>
        </section>
    );
}