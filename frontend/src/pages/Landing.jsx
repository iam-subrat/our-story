import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden">
            <section className="relative rounded-2xl overflow-hidden">
                <div className="card p-8 sm:p-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="pill mx-auto mb-4 w-fit">
                            <span className="text-primary-700">●</span> Made for
                            shared moments
                        </div>
                        <h1 className="h1 mb-4">
                            A beautiful timeline for your memories.
                        </h1>
                        <p className="lead mb-8">
                            Create a story, share one link, and let everyone add
                            photos with captions.
                        </p>
                        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
                            <button
                                onClick={() => navigate("/create")}
                                className="btn-primary px-8 py-4 text-base"
                            >
                                Create a Story
                            </button>
                            <button
                                onClick={() =>
                                    document
                                        .getElementById("how")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        })
                                }
                                className="btn-soft px-8 py-4 text-base"
                            >
                                See how it works
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how" className="mt-10 sm:mt-14">
                <div className="mb-6">
                    <div className="kicker">How it works</div>
                    <h2 className="h2 mt-1">A story everyone can build.</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3 md:items-stretch">
                    {[
                        {
                            n: "01",
                            title: "Create a story",
                            desc: "Name it, pick a date, optionally add a Google Photos album link.",
                        },
                        {
                            n: "02",
                            title: "Share the link",
                            desc: "Send it to friends on WhatsApp, Telegram, or copy/paste anywhere.",
                        },
                        {
                            n: "03",
                            title: "Add memories",
                            desc: "Everyone uploads photos with captions—your timeline grows together.",
                        },
                    ].map((s) => (
                        <div
                            key={s.n}
                            className="group relative h-full overflow-hidden rounded-2xl bg-white/70 p-6 shadow-soft ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white"
                        >
                            {/* top accent */}
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 opacity-70" />

                            <div className="flex items-center justify-between gap-4">
                                <div className="pill bg-paper-100/80">
                                    Step {s.n}
                                </div>
                                <div className="text-ink-300 transition group-hover:text-primary-600">
                                    →
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="font-display text-xl font-semibold tracking-tight text-ink-950">
                                    {s.title}
                                </div>
                                <div className="mt-2 text-sm leading-relaxed text-ink-600">
                                    {s.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-10 sm:mt-14">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="kicker">Perfect for</div>
                        <h2 className="h2 mt-1">Moments worth collecting.</h2>
                        <p className="mt-2 text-ink-700">
                            Weddings, trips, reunions, birthdays—anything you
                            want to remember together.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/create")}
                        className="btn-soft px-7 py-3"
                    >
                        Start your first story
                    </button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                        "Events & parties",
                        "Travel",
                        "Family moments",
                        "Milestones",
                    ].map((label) => (
                        <div
                            key={label}
                            className="group flex items-center justify-between rounded-2xl bg-white/25 px-5 py-4 ring-1 ring-black/5 backdrop-blur transition hover:bg-white/40"
                        >
                            <div className="font-semibold text-ink-950">
                                {label}
                            </div>
                            <div className="text-ink-300 transition group-hover:text-primary-600">
                                →
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
