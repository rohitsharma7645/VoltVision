
import logo from "../assets/voltvision-logo.png";

function Navbar({ page, setPage }) {

    return (
        <nav className="navbar">

            <div className="logo">
                <img
                    src={logo}
                    alt="VoltVision Logo"
                />
            </div>

            <div className="nav-links">
                <button
                    className={page === "home" ? "active" : ""}
                    onClick={() => setPage("home")}
                >
                    Home
                </button>

                <button
                    className={page === "prediction" ? "active" : ""}
                    onClick={() => setPage("prediction")}
                >
                    Prediction
                </button>

                <button
                    className={page === "comparison" ? "active" : ""}
                    onClick={() => setPage("comparison")}
                >
                    Model Comparison
                </button>

                <button
                    className={page === "analysis" ? "active" : ""}
                    onClick={() => setPage("analysis")}
                >
                    Data Analysis
                </button>
            </div>

        </nav>
    );
}

export default Navbar;
