# Machine Learning

[← README](../README.md) · [Project Overview](PROJECT_OVERVIEW.md) · [Dataset](DATASET.md) · [Evaluation](MODEL_EVALUATION.md)

## Implemented models

The backend loads six scikit-learn estimators from `backend/models/*.pkl` and one PyTorch model from `backend/models/ann_model.pt`.

| API model name | Verified implementation | Artifact |
| --- | --- | --- |
| `linear_regression` | `LinearRegression` | `linear_regression.pkl` |
| `knn` | `KNeighborsRegressor` | `knn.pkl` |
| `decision_tree` | `DecisionTreeRegressor` | `decision_tree.pkl` |
| `svr` | `SVR` | `svr.pkl` |
| `random_forest` | `RandomForestRegressor` | `random_forest.pkl` |
| `gradient_boosting` | `GradientBoostingRegressor` | `gradient_boosting.pkl` |
| `ann` | PyTorch feed-forward neural network | `ann_model.pt` |

The ANN architecture in `backend/main.py` is `4 → 6 → 6 → 1`, with ReLU activations after the first two linear layers. The loaded model is put in evaluation mode and inference runs without gradient tracking.

## Input preprocessing

The request feature order is `AT`, `V`, `AP`, `RH`.

| Model | Input preprocessing at inference |
| --- | --- |
| `knn`, `svr` | `standard_scaler.pkl` (`StandardScaler`) |
| `ann` | `ann_scaler.pkl` (`StandardScaler`) |
| Linear regression, decision tree, random forest, gradient boosting | No scaling in the prediction function |

The API does not transform the prediction back from a scaled target. It returns the model output rounded to two decimals and labels it `MW`.

## Evaluation split

For `/evaluation`, the backend takes `X = [AT, V, AP, RH]` and `y = PE`, then calls `train_test_split(test_size=0.2, random_state=42)`. This produces 1,914 test rows from the 9,568-row CSV. The persisted artifacts are evaluated on that split; results are sorted by ascending RMSE.

The repository does not contain the fitting code, training split, hyperparameter search, or training metadata for the saved models. Therefore it cannot verify that this evaluation split was held out during artifact training. The dataset also contains 41 duplicate rows, and the current split code does not deduplicate them. See [Model Evaluation](MODEL_EVALUATION.md) for the measured results and caveats.

## Training and artifact provenance

The codebase contains inference and evaluation code only. It loads the six joblib estimators, the ANN state dictionary, and both scalers at startup. No notebook or script that fits those estimators is present, so training parameters and reproducibility details beyond the evaluation split above are not documented as facts.

For request validation and response behavior, see the [API documentation](API_DOCUMENTATION.md). For feature ranges and units, see the [dataset reference](DATASET.md).
