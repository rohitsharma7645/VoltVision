
import { useState } from "react";

import Navbar from "./components/Navbar";
import logo from "./assets/voltvision-logo.png";

import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import Comparison from "./pages/Comparison";
import Analysis from "./pages/Analysis";

import "./App.css";

function App() {

    const [page, setPage] = useState("home");

    return (
        <div className="app">

            <Navbar page={page} setPage={setPage} />

            {page === "home" && (
                <Home setPage={setPage} />
            )}

            {page === "prediction" && (
                <Prediction />
            )}

            {page === "comparison" && (
                <Comparison />
            )}

            {page === "analysis" && (
                <Analysis />
            )}

            <footer className="site-footer">
                <div className="footer-main">
                    <section className="footer-brand">
                        <img className="footer-logo" src={logo} alt="VoltVision" />
                        <p>AI-powered energy prediction using machine learning.</p>
                    </section>

                    <section className="footer-column">
                        <h2>Connect With Me</h2>
                        <a className="footer-link" href="https://github.com/rohitsharma7645" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.88.13 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" /></svg>
                            <span>GitHub</span>
                        </a>
                        <a className="footer-link" href="https://www.linkedin.com/in/rohit-sharma-5a9878325/" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.23 0Z" /></svg>
                            <span>LinkedIn</span>
                        </a>
                    </section>

                    <section className="footer-column">
                        <h2>Contact</h2>
                        <a className="footer-link" href="mailto:rohitsharma09565@gmail.com">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span>rohitsharma09565@gmail.com</span>
                        </a>
                        <a className="footer-link" href="tel:+917645870977">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 3a14 14 0 0 1-7-7l3-2-2-5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span>+91 7645870977</span>
                        </a>
                    </section>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} VoltVision. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
}

export default App;
