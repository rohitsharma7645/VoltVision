
import { useState } from "react";
import axios from "axios";

function Prediction() {

  const [formData, setFormData] = useState({
    AT: "",
    V: "",
    AP: "",
    RH: "",
    model: "random_forest"
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          ...formData,
          AT: Number(formData.AT),
          V: Number(formData.V),
          AP: Number(formData.AP),
          RH: Number(formData.RH)
        }
      );

      setResult(response.data.predicted_energy);

    } catch (err) {
      setError("Prediction failed. Please try again.");
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">

      <h1>Power Plant Energy Prediction</h1>

      <p>Enter the input values to predict energy output.</p>

      <form onSubmit={handleSubmit}>

        <label>Ambient Temperature (AT)</label>
        <input
          type="number"
          name="AT"
          placeholder="E.g.-25.0"
          value={formData.AT}
          onChange={handleChange}
          step="any"
          required
        />

        <label>Exhaust Vacuum (V)</label>
        <input
          type="number"
          name="V"
          placeholder="E.g.-60.0"
          value={formData.V}
          onChange={handleChange}
          step="any"
          required
        />

        <label>Ambient Pressure (AP)</label>
        <input
          type="number"
          name="AP"
          placeholder="E.g.-1010.5"
          value={formData.AP}
          onChange={handleChange}
          step="any"
          required
        />

        <label>Relative Humidity (RH)</label>
        <input
          type="number"
          name="RH"
          placeholder="E.g.-70.5"
          value={formData.RH}
          onChange={handleChange}
          step="any"
          required
        />

        <label>Select Model</label>

        <select
          name="model"
          value={formData.model}
          onChange={handleChange}
        >
          <option value="linear_regression">Linear Regression</option>
          <option value="knn">KNN Regression</option>
          <option value="decision_tree">Decision Tree</option>
          <option value="svr">SVR</option>
          <option value="random_forest">Random Forest</option>
          <option value="gradient_boosting">Gradient Boosting</option>
          <option value="ann">ANN</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Energy"}
        </button>

      </form>

      {result !== null && (
        <div className="result">
          <h2>Predicted Energy Output</h2>
          <h1>{result} MW</h1>
        </div>
      )}

      {error && <p className="error">{error}</p>}

    </div>
  );
}

export default Prediction;
