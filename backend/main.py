
import joblib
import torch
import torch.nn as nn
import pandas as pd
import numpy as np

from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    r2_score,
    mean_absolute_error,
    mean_squared_error
)


app = FastAPI(title="Power Plant Energy Prediction API")


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Model and scaler paths
BASE_DIR = Path(__file__).resolve().parent

MODEL_DIR = BASE_DIR / "models"
SCALER_DIR = BASE_DIR / "scalers"


# ANN model
class ANN(nn.Module):

    def __init__(self):
        super().__init__()

        self.model = nn.Sequential(
            nn.Linear(4, 6),
            nn.ReLU(),
            nn.Linear(6, 6),
            nn.ReLU(),
            nn.Linear(6, 1)
        )

    def forward(self, x):
        return self.model(x)


# Load ML models
models = {
    "linear_regression": joblib.load(MODEL_DIR / "linear_regression.pkl"),
    "knn": joblib.load(MODEL_DIR / "knn.pkl"),
    "decision_tree": joblib.load(MODEL_DIR / "decision_tree.pkl"),
    "svr": joblib.load(MODEL_DIR / "svr.pkl"),
    "random_forest": joblib.load(MODEL_DIR / "random_forest.pkl"),
    "gradient_boosting": joblib.load(MODEL_DIR / "gradient_boosting.pkl")
}


# Load scalers
standard_scaler = joblib.load(SCALER_DIR / "standard_scaler.pkl")
ann_scaler = joblib.load(SCALER_DIR / "ann_scaler.pkl")


# Load ANN weights
ann_model = ANN()

ann_model.load_state_dict(
    torch.load(
        MODEL_DIR / "ann_model.pt",
        map_location="cpu",
        weights_only=True
    )
)

ann_model.eval()


# Input data
class PredictionInput(BaseModel):

    AT: float = Field(ge=-50, le=100)
    V: float = Field(ge=0, le=150)
    AP: float = Field(gt=0, le=1200)
    RH: float = Field(ge=0, le=100)

    model: str = "random_forest"


available_models = list(models.keys()) + ["ann"]


# Prediction function
def predict_energy(data, model_name):

    input_data = pd.DataFrame(
        [[data.AT, data.V, data.AP, data.RH]],
        columns=["AT", "V", "AP", "RH"]
    )

    if model_name == "ann":

        input_data = ann_scaler.transform(input_data)
        input_tensor = torch.tensor(input_data, dtype=torch.float32)

        with torch.no_grad():
            prediction = ann_model(input_tensor).item()

    else:

        model = models[model_name]

        if model_name in ["knn", "svr"]:
            input_data = standard_scaler.transform(input_data)

        prediction = model.predict(input_data)[0]

    return round(float(prediction), 2)


# Home route
@app.get("/")
def home():

    return {"message": "Power Plant Energy Prediction API is running"}


# Get available models
@app.get("/models")
def get_models():

    return {"models": available_models}


# Predict using selected model
@app.post("/predict")
def predict(data: PredictionInput):

    if data.model not in available_models:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid model. Choose from: {available_models}"
        )

    prediction = predict_energy(data, data.model)

    return {
        "model": data.model,
        "predicted_energy": prediction,
        "unit": "MW"
    }


# Compare all models
@app.post("/predict/all")
def predict_all(data: PredictionInput):

    results = {}

    for model_name in available_models:
        results[model_name] = predict_energy(data, model_name)

    return {
        "predictions": results,
        "unit": "MW"
    }


# --------------------------------
# 12. Dataset Analysis
# --------------------------------

# Load dataset
dataset = pd.read_csv(BASE_DIR / "powerplant_data.csv")

print(dataset.shape)
print(dataset.dtypes)
print(dataset.isnull().sum())
print(dataset.head())


@app.get("/analysis")
def get_analysis():

    try:

        # Dataset overview
        overview = {
            "rows": int(dataset.shape[0]),
            "columns": int(dataset.shape[1]),
            "missing_values": int(dataset.isnull().sum().sum()),
            "features": ["AT", "V", "AP", "RH"],
            "target": "PE"
        }


        # Statistical summary
        summary = {}

        for column in dataset.columns:

            summary[column] = {
                "mean": round(float(dataset[column].mean()), 2),
                "std": round(float(dataset[column].std()), 2),
                "min": round(float(dataset[column].min()), 2),
                "max": round(float(dataset[column].max()), 2)
            }


        # Feature distributions
        distributions = {}

        for column in dataset.columns:

            counts, edges = np.histogram(
                dataset[column].dropna(),
                bins=12
            )

            distributions[column] = [
                {
                    "range": round(float(edges[i]), 2),
                    "count": int(counts[i])
                }
                for i in range(len(counts))
            ]


        # Correlation with PE
        correlations = []

        for column in ["AT", "V", "AP", "RH"]:

            correlations.append({
                "feature": column,
                "correlation": round(
                    float(dataset[column].corr(dataset["PE"])), 3
                )
            })


        # Sample data for scatter plots
        sample_data = dataset.sample(
            n=min(500, len(dataset)),
            random_state=42
        )

        scatter_data = sample_data.to_dict(orient="records")


        return {
            "overview": overview,
            "summary": summary,
            "distributions": distributions,
            "correlations": correlations,
            "scatter_data": scatter_data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# --------------------------------
# 13. Model Performance Evaluation
# --------------------------------

# Prepare test data
X = dataset[["AT", "V", "AP", "RH"]]
y = dataset["PE"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Evaluate all seven models
@app.get("/evaluation")
def evaluate_models():

    try:

        results = []

        for model_name in available_models:

            # ANN prediction
            if model_name == "ann":

                scaled_data = ann_scaler.transform(X_test)

                input_tensor = torch.tensor(
                    scaled_data,
                    dtype=torch.float32
                )

                with torch.no_grad():
                    predictions = ann_model(
                        input_tensor
                    ).numpy().flatten()

            # Other ML models
            else:

                model = models[model_name]

                test_data = X_test

                # Scale KNN and SVR inputs
                if model_name in ["knn", "svr"]:
                    test_data = standard_scaler.transform(X_test)

                predictions = model.predict(test_data)


            # Calculate evaluation metrics
            r2 = r2_score(y_test, predictions)

            mae = mean_absolute_error(
                y_test,
                predictions
            )

            rmse = np.sqrt(
                mean_squared_error(y_test, predictions)
            )


            # Store results
            results.append({
                "model": model_name,
                "r2_score": round(float(r2), 4),
                "mae": round(float(mae), 4),
                "rmse": round(float(rmse), 4)
            })


        # Rank models based on RMSE
        results.sort(key=lambda x: x["rmse"])


        # Assign ranks
        for rank, result in enumerate(results, start=1):
            result["rank"] = rank


        return {
            "test_samples": len(y_test),
            "ranking_metric": "RMSE",
            "results": results
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
