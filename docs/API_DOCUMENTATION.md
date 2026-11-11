# API Documentation

[← README](../README.md) · [Project Overview](PROJECT_OVERVIEW.md) · [Machine Learning](MACHINE_LEARNING.md) · [Setup Guide](SETUP_GUIDE.md)

## Base URL and interactive schema

The local API runs at `http://127.0.0.1:8000` when started with the documented Uvicorn command. FastAPI serves Swagger UI at [`/docs`](http://127.0.0.1:8000/docs) and ReDoc at [`/redoc`](http://127.0.0.1:8000/redoc).

The API's CORS configuration allows `http://localhost:5173`, which is the Vite development origin. The frontend currently uses hardcoded local API URLs.

## Prediction request fields

All prediction POST endpoints accept a JSON object with these fields:

| Field | Type | Validation | Default |
| --- | --- | --- | --- |
| `AT` | number | −50 ≤ value ≤ 100 | Required |
| `V` | number | 0 ≤ value ≤ 150 | Required |
| `AP` | number | 0 < value ≤ 1200 | Required |
| `RH` | number | 0 ≤ value ≤ 100 | Required |
| `model` | string | Must match an available model for `/predict` | `random_forest` |

The model names are `linear_regression`, `knn`, `decision_tree`, `svr`, `random_forest`, `gradient_boosting`, and `ann`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | API health message |
| `GET` | `/models` | Available model identifiers |
| `POST` | `/predict` | Predict with the requested model |
| `POST` | `/predict/all` | Predict with all seven models |
| `GET` | `/analysis` | Dataset overview, summary statistics, histograms, correlations, and sample rows |
| `GET` | `/evaluation` | Holdout metrics for all seven saved models, ranked by RMSE |

### `GET /`

Response:

```json
{
  "message": "Power Plant Energy Prediction API is running"
}
```

### `GET /models`

Response:

```json
{
  "models": [
    "linear_regression",
    "knn",
    "decision_tree",
    "svr",
    "random_forest",
    "gradient_boosting",
    "ann"
  ]
}
```

### `POST /predict`

Request:

```json
{
  "AT": 19.65,
  "V": 54.31,
  "AP": 1013.26,
  "RH": 73.31,
  "model": "random_forest"
}
```

Response shape (the numeric prediction depends on the selected saved model and input):

```json
{
  "model": "random_forest",
  "predicted_energy": "<number>",
  "unit": "MW"
}
```

An unknown model name returns HTTP 400. Invalid or out-of-range fields are rejected by Pydantic with HTTP 422.

### `POST /predict/all`

Request: the same feature object as `/predict`; the frontend omits `model`, so the schema default applies but the handler evaluates every model.

Response shape:

```json
{
  "predictions": {
    "linear_regression": "<number>",
    "knn": "<number>",
    "decision_tree": "<number>",
    "svr": "<number>",
    "random_forest": "<number>",
    "gradient_boosting": "<number>",
    "ann": "<number>"
  },
  "unit": "MW"
}
```

### `GET /analysis`

The response contains:

| Key | Contents |
| --- | --- |
| `overview` | Row/column counts, missing-value count, feature names, target name |
| `summary` | Per-column mean, standard deviation, minimum, and maximum |
| `distributions` | Twelve histogram bins per column, each with `range` and `count` |
| `correlations` | Pearson correlation of each feature with `PE` |
| `scatter_data` | Up to 500 CSV records sampled with `random_state=42` |

### `GET /evaluation`

Response keys are `test_samples`, `ranking_metric` (`"RMSE"`), and `results`. Each result has `model`, `r2_score`, `mae`, `rmse`, and `rank`. See [Model Evaluation](MODEL_EVALUATION.md) for the measured response values and evaluation caveats.

An exception while building `/analysis` or `/evaluation` is returned as HTTP 500 with a `detail` string.

## Related documentation

- [Setup and run commands](SETUP_GUIDE.md)
- [Feature preprocessing](MACHINE_LEARNING.md)
- [Dataset fields and ranges](DATASET.md)
