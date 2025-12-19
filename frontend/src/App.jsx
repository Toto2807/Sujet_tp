import React, { useState } from "react";

const API_BASE = "http://localhost:5000/api";

function App() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    // Helper to handle API calls
    const callApi = async (endpoint, method = "GET", body = null) => {
        setLoading(true);
        try {
            const options = {
                method,
                headers: { "Content-Type": "application/json" },
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(`${API_BASE}${endpoint}`, options);
            const data = await response.json();
            setResults({ status: response.status, data });
        } catch (err) {
            setResults({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "sans-serif",
                display: "flex",
                gap: "20px",
            }}
        >
            {/* Sidebar: Route Actions */}
            <div style={{ flex: 1, minWidth: "300px" }}>
                <h1>Manga API Tester</h1>

                <section>
                    <h3>User Routes</h3>
                    <button onClick={() => callApi("/users")}>
                        Get All Users
                    </button>
                    <button
                        onClick={() =>
                            callApi("/users/register", "POST", {
                                username: "testuser",
                                email: "test@example.com",
                                password: "password123",
                            })
                        }
                    >
                        Register Test User
                    </button>
                </section>

                <section>
                    <h3>Manga Routes</h3>
                    <button onClick={() => callApi("/manga")}>
                        Get All Manga
                    </button>
                    <button
                        onClick={() =>
                            callApi("/manga", "POST", {
                                title: "One Piece",
                                author: "Eiichiro Oda",
                                tags: ["Action", "Adventure"],
                            })
                        }
                    >
                        Create Manga
                    </button>
                </section>

                <section>
                    <h3>User Interactions (Fav/History)</h3>
                    <button
                        onClick={() => callApi("/favorites/user-uuid-here")}
                    >
                        Get Favorites
                    </button>
                    <button
                        onClick={() =>
                            callApi("/history", "POST", {
                                user_id: "uuid",
                                manga_id: "uuid",
                                last_chapter_id: "ch-101",
                            })
                        }
                    >
                        Update History
                    </button>
                </section>
            </div>

            {/* Main Content: Response Display */}
            <div
                style={{
                    flex: 2,
                    background: "#f4f4f4",
                    padding: "20px",
                    borderRadius: "8px",
                }}
            >
                <h2>Response Output</h2>
                {loading && <p>Loading...</p>}
                {results && (
                    <pre
                        style={{
                            background: "#222",
                            color: "#0f0",
                            padding: "15px",
                            overflow: "auto",
                        }}
                    >
                        {JSON.stringify(results, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}

export default App;
