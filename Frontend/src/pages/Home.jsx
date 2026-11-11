
function Home({ setPage }) {

    return (
        <div className="home-page">

            <section className="welcome-section">
                <div className="welcome-copy">
                    <p className="small-heading">SMART ANALYTICS PLATFORM</p>

                    <h1>Power Plant Energy Prediction</h1>

                    <p className="welcome-text">
                        Analyze, predict and optimize power plant energy output using Machine Learning.
                    </p>

                    <button onClick={() => setPage("prediction")}>
                        Get Started →
                    </button>
                </div>

                <img
                    className="welcome-image"
                    src="/voltvision-hero.png"
                    alt="AI-powered power plant with an energy prediction chart and transmission towers"
                />

            </section>

            <main className="main-content">

            <div className="section-heading">
                <h2>Project Overview</h2>
                <p>Your machine learning workspace</p>
            </div>


            <div className="overview-cards">

                <div className="overview-card">
                    <span>📊</span>
                    <div>
                        <h2>4</h2>
                        <p>Input Features</p>
                    </div>
                </div>

                <div className="overview-card">
                    <span>🤖</span>
                    <div>
                        <h2>7</h2>
                        <p>Trained Models</p>
                    </div>
                </div>

                <div className="overview-card">
                    <span>🎯</span>
                    <div>
                        <h2>1</h2>
                        <p>Prediction Target</p>
                    </div>
                </div>

            </div>


            <div className="section-heading">
                <h2>Explore Features</h2>
                <p>Choose what you want to work with</p>
            </div>


            <div className="feature-cards">

                <div className="feature-card">

                    <span className="feature-icon" aria-hidden="true">⚡</span>
                    <h3>Energy Prediction</h3>

                    <p>
                        Predict electrical energy output by providing
                        temperature, vacuum, pressure and humidity values.
                    </p>

                    <button onClick={() => setPage("prediction")}>
                        Open Prediction →
                    </button>
                </div>


                <div className="feature-card">

                    <span className="feature-icon" aria-hidden="true">📊</span>
                    <h3>Model Comparison</h3>

                    <p>
                        Compare predictions from different regression
                        algorithms and understand their performance.
                    </p>

                    <button onClick={() => setPage("comparison")}>
                        Compare Models →
                    </button>
                </div>


                <div className="feature-card">

                    <span className="feature-icon" aria-hidden="true">📈</span>
                    <h3>Data Analysis</h3>

                    <p>
                        Explore dataset features, distributions and
                        relationships through visualizations.
                    </p>

                    <button onClick={() => setPage("analysis")}>
                        Explore Data →
                    </button>
                </div>

            </div>

            </main>

        </div>
    );
}

export default Home;
