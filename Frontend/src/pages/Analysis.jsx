
import { useEffect, useState } from "react";
import axios from "axios";

function Analysis() {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/evaluation");
        setEvaluation(response.data);
      } catch (error) {
        setError("Failed to load model evaluation.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, []);

  if (loading) {
    return (
      <div className="analysis-loading">
        Loading model evaluation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-error">
        {error}
      </div>
    );
  }

  if (!evaluation) return null;

  return (
    <div className="analysis-page">

      {/* Header */}
      <h1>Model Performance Evaluation</h1>

      <p>
        Evaluate and compare the performance of trained regression models.
      </p>

      {/* Evaluation Information */}
      <div className="analysis-info">

        <div>
          <h3>Test Samples</h3>
          <p>{evaluation.test_samples}</p>
        </div>

        <div>
          <h3>Ranking Metric</h3>
          <p>{evaluation.ranking_metric}</p>
        </div>

      </div>

      {/* Results Table */}
      <div className="analysis-results">

        <h2>Model Performance Results</h2>

        <div className="analysis-table-container">

          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Model</th>
                <th>R² Score</th>
                <th>MAE</th>
                <th>RMSE</th>
              </tr>
            </thead>

            <tbody>
              {evaluation.results.map((item) => (
                <tr key={item.model}>
                  <td>{item.rank}</td>
                  <td>{item.model.replaceAll("_", " ")}</td>
                  <td>{item.r2_score.toFixed(4)}</td>
                  <td>{item.mae.toFixed(4)}</td>
                  <td>{item.rmse.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

    </div>
  );
}

export default Analysis;
