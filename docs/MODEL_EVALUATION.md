# Model Evaluation

[← README](../README.md) · [Machine Learning](MACHINE_LEARNING.md) · [Dataset](DATASET.md) · [API Documentation](API_DOCUMENTATION.md)

## Evaluation method

`GET /evaluation` evaluates the seven persisted model artifacts against the test partition produced in `backend/main.py`:

```python
train_test_split(X, y, test_size=0.2, random_state=42)
```

The CSV has 9,568 rows, so the resulting test set contains 1,914 rows. Results are sorted by ascending RMSE and assigned ranks in that order. The values below were obtained by running the current backend artifacts and evaluation function in this project.

## Measured results

| Rank (RMSE) | Model | R² | MAE (MW) | RMSE (MW) |
| ---: | --- | ---: | ---: | ---: |
| 1 | Random Forest | 0.9645 | 2.2598 | 3.1874 |
| 2 | KNN | 0.9522 | 2.7067 | 3.7002 |
| 3 | Gradient Boosting | 0.9515 | 2.8697 | 3.7268 |
| 4 | SVR | 0.9461 | 2.9312 | 3.9271 |
| 5 | ANN | 0.9319 | 3.5276 | 4.4153 |
| 6 | Linear Regression | 0.9315 | 3.5434 | 4.4281 |
| 7 | Decision Tree | 0.9301 | 3.0110 | 4.4733 |

**Best by the API's ranking rule:** Random Forest, with the lowest RMSE (3.1874 MW) on this run. It also has the highest R² and lowest MAE in the returned results.

## Metrics

- **R²**: coefficient of determination; higher is better.
- **MAE**: mean absolute prediction error in MW; lower is better.
- **RMSE**: root mean squared prediction error in MW; lower is better. This is the metric used to assign rank.

## Interpretation and limitations

These are measurements of the checked-in model artifacts on the split currently defined by the backend. The repository does not include the code or metadata used to fit those artifacts, so it cannot establish whether these rows were excluded from their original training. The CSV contains 41 exact duplicate rows and the evaluation code does not remove them before splitting. Treat the table as an implementation-level evaluation, not as independently verified generalization performance.

The endpoint recomputes metrics at runtime; its response is the source of truth if the dataset or serialized model files change. See [Machine Learning](MACHINE_LEARNING.md) for preprocessing and artifact details.
