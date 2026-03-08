import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Share Your Story
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Create a beautiful timeline from your Google Photos and
                        invite friends to add their memories
                    </p>
                    <button
                        onClick={() => navigate("/create")}
                        className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                        Create Your Story
                    </button>
                </div>

                {/* How it works */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-primary">
                                1
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                            Share Album
                        </h3>
                        <p className="text-gray-600">
                            Paste your Google Photos album link
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-primary">
                                2
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                            Invite Friends
                        </h3>
                        <p className="text-gray-600">
                            Share your story link with anyone
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-primary">
                                3
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                            Build Together
                        </h3>
                        <p className="text-gray-600">
                            Everyone adds their photos to the timeline
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">Perfect for</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🎉</span>
                            <div>
                                <h4 className="font-semibold">
                                    Events & Parties
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Collect photos from all guests
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">✈️</span>
                            <div>
                                <h4 className="font-semibold">
                                    Travel Memories
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Share trip photos with friends
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🏡</span>
                            <div>
                                <h4 className="font-semibold">
                                    Family Moments
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Keep everyone connected
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🎓</span>
                            <div>
                                <h4 className="font-semibold">Milestones</h4>
                                <p className="text-sm text-gray-600">
                                    Celebrate special occasions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
