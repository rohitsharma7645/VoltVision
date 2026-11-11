# Dataset

[← README](../README.md) · [Project Overview](PROJECT_OVERVIEW.md) · [Machine Learning](MACHINE_LEARNING.md) · [Evaluation](MODEL_EVALUATION.md)

## Source and local file

The bundled `backend/powerplant_data.csv` has 9,568 rows and the five columns of the UCI Machine Learning Repository's [Combined Cycle Power Plant dataset](https://archive.ics.uci.edu/dataset/294/combined%2Bcycle%2Bpower%2Bplant). Its row count, schema, and observed ranges match that dataset. The source describes hourly-average measurements collected from 2006–2011 while the plant was operating at full load. Dataset citation: T. Tufekci and H. Kaya, [UCI dataset 294, DOI 10.24432/C5002N](https://doi.org/10.24432/C5002N).

The project CSV does not include a separate provenance or license file. The source attribution above is based on the matching schema and values; no additional local acquisition details are available.

## Columns

All five columns are stored as `float64` in the checked-in CSV. The input names and descriptions correspond to those used in the frontend and API.

| Column | Role | Description | Unit | Observed range in bundled CSV |
| --- | --- | --- | --- | --- |
| `AT` | Feature | Ambient temperature | °C | 1.81–37.11 |
| `V` | Feature | Exhaust vacuum | cm Hg | 25.36–81.56 |
| `AP` | Feature | Ambient pressure | mbar | 992.89–1033.30 |
| `RH` | Feature | Relative humidity | % | 25.56–100.16 |
| `PE` | Target | Net hourly electrical energy output | MW | 420.26–495.76 |

`AT`, `V`, `AP`, and `RH` are sent to the models. `PE` is the regression target. The prediction API response names the target value `predicted_energy`.

## Data checks and preprocessing in the application

| Check | Observed value / implemented behavior |
| --- | --- |
| Rows and columns | 9,568 rows × 5 columns |
| Data types | All columns are `float64` |
| Missing values | 0 in the bundled CSV |
| Exact duplicate rows | 41; the application does not remove them |
| Runtime loading | `pandas.read_csv` in `backend/main.py` |
| Feature scaling | StandardScaler artifacts are used for KNN, SVR, and ANN inference; other models use raw features |

The API calculates descriptive statistics, 12-bin histograms, feature-to-PE correlations, and a deterministic sample of up to 500 rows in `/analysis`. It does not impute, deduplicate, or otherwise clean the CSV before those calculations.

Input validation bounds are API constraints, not data-derived ranges. They are listed in the [API reference](API_DOCUMENTATION.md). See [Machine Learning](MACHINE_LEARNING.md) for preprocessing and evaluation details.
