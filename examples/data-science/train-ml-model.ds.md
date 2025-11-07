---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Train ML Model",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "last_updated": "2025-11-05",
  "objective": "Train a machine learning model with proper data validation, evaluation, and artifact management for reproducible experiments",
  "category": ["data-science", "development"],
  "tags": ["machine-learning", "python", "scikit-learn", "training", "model", "data-science"],
  "checksum": {
    "algorithm": "sha256",
    "hash": "98ae7bc6d566a34f55aa48bbab2d4e20ad2eaf3cce56ff4e4ccbb4a4aa263165"
  },
  "risk_level": "medium",
  "risk_factors": [
    "modifies_files",
    "executes_external_code",
    "network_access"
  ],
  "requires_approval": false,
  "destructive_operations": [
    "Creates model artifacts and experiment files in local directory",
    "Installs Python packages via pip (scikit-learn, pandas, numpy, etc.)",
    "Consumes significant CPU/memory during training (may impact system performance)",
    "Creates virtual environment if needed"
  ],
  "estimated_duration": {
    "min_minutes": 5,
    "max_minutes": 60
  },
  "coupling": {
    "level": "Loose",
    "details": "Self-contained workflow with no external dossier dependencies. Outputs can feed into deployment dossiers but are independently usable."
  },
  "mcp_integration": {
    "required": false,
    "server_name": "@dossier/mcp-server",
    "min_version": "1.0.0",
    "features_used": ["verify_dossier"],
    "fallback": "manual_execution",
    "benefits": [
      "Automatic checksum verification",
      "Streamlined security validation"
    ]
  }
}
---

# Dossier: Train ML Model

**Protocol Version**: 1.0 ([PROTOCOL.md](../../PROTOCOL.md))

**Purpose**: Train a machine learning model with proper data validation, evaluation, and artifact management for reproducible experiments.

**When to use**: When you need to train a classification or regression model on structured data with proper experiment tracking and validation.

---

*Before executing, optionally review [PROTOCOL.md](../../PROTOCOL.md) for self-improvement protocol and execution guidelines.*

---

## 📋 Metadata

### Version
- **Dossier**: v1.0.0
- **Protocol**: v1.0
- **Last Updated**: 2025-11-05

### Relationships

**Preceded by**:
- None (self-contained)

**Followed by**:
- deploy-ml-model.md - Deploy trained model to production (suggested)
- tune-hyperparameters.md - Advanced parameter optimization (optional)

**Alternatives**:
- train-deep-learning-model.md - For neural networks and large datasets

**Conflicts with**:
- None

**Can run in parallel with**:
- None (resource intensive, should run alone)

### Outputs

**Files created**:
- `models/model_{timestamp}.pkl` - Trained model (required)
- `models/scaler_{timestamp}.pkl` - Data scaler/transformer (optional)
- `experiments/experiment_{timestamp}.json` - Experiment log (required)
- `results/metrics_{timestamp}.json` - Performance metrics (required)
- `results/confusion_matrix_{timestamp}.png` - Visual results (optional)
- `requirements.txt` - Python dependencies (required if not exists)

**Configuration produced**:
- `experiment.config` - Consumed by: deployment dossiers

**State changes**:
- Creates virtual environment - Affects: local Python environment
- Trains model - Affects: system resources (CPU/memory)

### Inputs

**Required**:
- Dataset file (CSV, JSON, or parquet format)
- Target column name
- Feature columns (or auto-detect all except target)

**Optional**:
- Train/test split ratio (default: 0.8)
- Random seed (default: 42)
- Model type (default: auto-detect based on target)
- Cross-validation folds (default: 5)

### Coupling

**Level**: Loose
**Details**: Self-contained workflow with no external dossier dependencies. Outputs can feed into deployment dossiers but are independently usable.

---

## Objective

Train a machine learning model on provided data with:
- Proper data validation and preprocessing
- Train/test splitting for unbiased evaluation
- Multiple evaluation metrics
- Saved model artifacts for deployment
- Comprehensive experiment logging for reproducibility

Success means: A trained model with documented performance metrics, ready for evaluation or deployment.

---

## Prerequisites

**Environment Requirements**:
- Python 3.8+ installed
- Virtual environment capability (`venv` or `virtualenv`)
- Sufficient disk space for data and models (estimate: 2x dataset size)
- Available memory (at least 2GB free for medium datasets)

**Data Requirements**:
- Dataset file exists and is readable
- Data is structured (tabular format)
- Target column is clearly identifiable
- Dataset has at least 100 rows (recommended: 1000+)

**Validation**:

```bash
# Check Python version
python --version | grep -E "3\.(8|9|10|11|12)"

# Check available memory
free -h | grep "Mem:"

# Check dataset exists
ls -lh data/*.csv data/*.json data/*.parquet 2>/dev/null || echo "No dataset found"

# Check disk space
df -h . | tail -1
```

---

## Context to Gather

### 1. Detect Python Environment

```bash
# Check Python version and virtual environment
python --version
python -m venv --help > /dev/null 2>&1 && echo "venv: ✓" || echo "venv: ✗"

# Check if already in a virtual environment
python -c "import sys; print('In venv:', hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix))"
```

### 2. Locate Dataset

```bash
# Find potential datasets
find . -maxdepth 3 -type f \( -name "*.csv" -o -name "*.json" -o -name "*.parquet" \) | head -10

# Check dataset size and format
file data/*.csv data/*.json data/*.parquet 2>/dev/null
wc -l data/*.csv 2>/dev/null | grep -v total
```

### 3. Check for Existing ML Setup

```bash
# Check for existing requirements.txt
test -f requirements.txt && echo "requirements.txt exists" || echo "No requirements.txt"

# Check for existing models directory
test -d models && echo "models/ directory exists" || echo "No models/ directory"

# Check for Jupyter notebooks
find . -maxdepth 2 -name "*.ipynb" | head -5

# Check for existing ML libraries
python -c "import pandas" 2>/dev/null && echo "pandas: ✓" || echo "pandas: ✗"
python -c "import sklearn" 2>/dev/null && echo "scikit-learn: ✓" || echo "scikit-learn: ✗"
python -c "import numpy" 2>/dev/null && echo "numpy: ✓" || echo "numpy: ✗"
```

### 4. Analyze Data Structure

Once dataset is located, analyze it:

```python
import pandas as pd

# Load dataset
df = pd.read_csv('data/dataset.csv')  # Adjust path and format

# Basic info
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print(f"Dtypes:\n{df.dtypes}")
print(f"Missing values:\n{df.isnull().sum()}")
print(f"Sample:\n{df.head()}")
```

**Output Format**:
```
Dataset: data/customers.csv
Rows: 5000
Columns: 12
Numeric features: 8 (age, income, balance, ...)
Categorical features: 3 (gender, region, status)
Target candidates: churn (binary), satisfaction_score (numeric)
Missing values: 2.3%
```

---

## Decision Points

### Decision 1: Model Type Selection

**Based on**: Target variable type and distribution

**Options**:
- **Random Forest Classifier**: Binary or multi-class classification
  - Use when: Target is categorical (e.g., yes/no, categories)
  - Pros: Handles non-linear relationships, resistant to overfitting, provides feature importance
  - Cons: Larger model size, slower prediction

- **Random Forest Regressor**: Continuous numeric prediction
  - Use when: Target is continuous (e.g., price, temperature, score)
  - Pros: Robust to outliers, captures non-linear patterns
  - Cons: Can't extrapolate beyond training range

- **Logistic Regression**: Simple binary classification
  - Use when: Need interpretable linear model, small dataset
  - Pros: Fast, interpretable, works well for linearly separable data
  - Cons: Limited to linear relationships

**Recommendation**: Random Forest (Classifier or Regressor) for most cases - good balance of performance and simplicity.

### Decision 2: Train/Test Split Strategy

**Based on**: Dataset size and temporal nature

**Options**:
- **80/20 random split**: Standard approach
  - Use when: Dataset > 1000 rows, no time dependency
  - Recommended for most cases

- **70/30 split**: Conservative approach
  - Use when: Dataset is 500-1000 rows
  - More data for testing

- **Time-based split**: Chronological
  - Use when: Data has temporal ordering (dates)
  - Essential for time-series prediction

**Recommendation**: 80/20 random split for datasets > 1000 rows

### Decision 3: Feature Preprocessing

**Based on**: Feature types detected

**Options**:
- **StandardScaler**: Mean=0, StdDev=1
  - Use when: Features have different scales, using distance-based models
  - Not critical for tree-based models but helps with visualization

- **One-Hot Encoding**: Categorical to numeric
  - Use when: Categorical features present
  - Required for most models

- **Minimal preprocessing**: None
  - Use when: All features already numeric and scaled
  - Fastest approach for tree-based models

**Recommendation**: One-Hot Encoding for categoricals + StandardScaler for numeric features

### Decision 4: Validation Strategy

**Based on**: Dataset size and training time

**Options**:
- **5-Fold Cross-Validation**: Standard approach
  - Use when: Dataset > 1000 rows
  - Robust performance estimate

- **3-Fold Cross-Validation**: Faster
  - Use when: Dataset 500-1000 rows or slow training
  - Reasonable performance estimate

- **Single train/test**: Fastest
  - Use when: Dataset < 500 rows or rapid iteration
  - Less robust but quick

**Recommendation**: 5-fold cross-validation for final model, single split for initial exploration

---

## Actions to Perform

### Step 1: Setup Python Environment

**What to do**: Create isolated virtual environment and install dependencies

**Commands**:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# OR
# venv\Scripts\activate  # Windows

# Upgrade pip
pip install --upgrade pip
```

**Expected outcome**: Virtual environment created and activated

**Validation**:
```bash
which python  # Should point to venv/bin/python
pip --version # Should show pip from venv
```

### Step 2: Install ML Dependencies

**What to do**: Install required Python packages

**Commands**:
```bash
# Install core ML libraries
pip install pandas numpy scikit-learn matplotlib seaborn joblib

# Save dependencies
pip freeze > requirements.txt
```

**Expected outcome**: All ML libraries installed and requirements.txt created

**Validation**:
```bash
pip list | grep -E "(pandas|numpy|scikit-learn|matplotlib)"
test -f requirements.txt && echo "✓ requirements.txt created" || echo "✗ Failed"
```

### Step 3: Create Project Structure

**What to do**: Setup directories for organized experiment tracking

**Commands**:
```bash
# Create directory structure
mkdir -p models experiments results data

# Verify structure
ls -la | grep -E "(models|experiments|results|data)"
```

**Expected outcome**: Directory structure ready for artifacts

**Validation**:
```bash
test -d models && test -d experiments && test -d results && echo "✓ Structure ready" || echo "✗ Missing directories"
```

### Step 4: Load and Validate Data

**What to do**: Read dataset, check quality, and understand structure

**Create file**: `train_model.py`

```python
import pandas as pd
import numpy as np
from datetime import datetime
import json

# Configuration
DATASET_PATH = 'data/dataset.csv'  # Adjust this
TARGET_COLUMN = 'target'  # Adjust this
RANDOM_SEED = 42
TIMESTAMP = datetime.now().strftime('%Y%m%d_%H%M%S')

print(f"[1/7] Loading dataset from {DATASET_PATH}...")

# Load data
df = pd.read_csv(DATASET_PATH)
print(f"✓ Loaded {len(df)} rows, {len(df.columns)} columns")

# Basic validation
print("\n=== Data Validation ===")
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print(f"\nData types:\n{df.dtypes}")
print(f"\nMissing values:\n{df.isnull().sum()[df.isnull().sum() > 0]}")
print(f"\nTarget distribution:\n{df[TARGET_COLUMN].value_counts()}")

# Check for issues
assert TARGET_COLUMN in df.columns, f"Target column '{TARGET_COLUMN}' not found!"
assert len(df) >= 100, f"Dataset too small: {len(df)} rows (need 100+)"

missing_pct = (df.isnull().sum().sum() / (df.shape[0] * df.shape[1])) * 100
if missing_pct > 10:
    print(f"⚠ Warning: {missing_pct:.1f}% missing values")

print("✓ Data validation passed")
```

**Expected outcome**: Dataset loaded with quality report

**Validation**: Run script and check for errors
```bash
python train_model.py 2>&1 | head -20
```

### Step 5: Preprocess and Split Data

**What to do**: Handle missing values, encode categoricals, split train/test

**Add to `train_model.py`**:

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

print(f"\n[2/7] Preprocessing data...")

# Handle missing values
imputer = SimpleImputer(strategy='median')  # or 'mean' or 'most_frequent'

# Separate features and target
X = df.drop(columns=[TARGET_COLUMN])
y = df[TARGET_COLUMN]

# Identify column types
numeric_cols = X.select_dtypes(include=[np.number]).columns.tolist()
categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()

print(f"Numeric features: {len(numeric_cols)}")
print(f"Categorical features: {len(categorical_cols)}")

# Encode categorical features
X_processed = X.copy()
label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    X_processed[col] = le.fit_transform(X[col].astype(str))
    label_encoders[col] = le
    print(f"  Encoded '{col}': {len(le.classes_)} classes")

# Handle missing values
if X_processed.isnull().sum().sum() > 0:
    X_processed = pd.DataFrame(
        imputer.fit_transform(X_processed),
        columns=X_processed.columns
    )
    print(f"✓ Imputed missing values")

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_processed)
X_scaled = pd.DataFrame(X_scaled, columns=X_processed.columns)

print(f"✓ Scaled features")

# Split data
TEST_SIZE = 0.2
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y,
    test_size=TEST_SIZE,
    random_state=RANDOM_SEED,
    stratify=y if y.dtype == 'object' or len(y.unique()) < 20 else None
)

print(f"✓ Split: {len(X_train)} train, {len(X_test)} test ({TEST_SIZE*100:.0f}% test)")
```

**Expected outcome**: Preprocessed data ready for training

### Step 6: Train Model

**What to do**: Initialize model, train on data, track progress

**Add to `train_model.py`**:

```python
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import classification_report, confusion_matrix, mean_squared_error, r2_score
import joblib

print(f"\n[3/7] Training model...")

# Determine problem type
is_classification = y.dtype == 'object' or len(y.unique()) < 20

if is_classification:
    print("Problem type: Classification")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=RANDOM_SEED,
        n_jobs=-1,  # Use all CPU cores
        verbose=1   # Show progress
    )
else:
    print("Problem type: Regression")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=RANDOM_SEED,
        n_jobs=-1,
        verbose=1
    )

# Train model
print("Training started...")
model.fit(X_train, y_train)
print("✓ Training completed")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X_processed.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\nTop 5 important features:")
print(feature_importance.head())
```

**Expected outcome**: Trained model with feature importance

**Validation**: Check model is trained
```python
assert hasattr(model, 'estimators_'), "Model not fitted!"
```

### Step 7: Evaluate Model

**What to do**: Test model on held-out data, calculate metrics

**Add to `train_model.py`**:

```python
print(f"\n[4/7] Evaluating model...")

# Make predictions
y_pred = model.predict(X_test)

# Calculate metrics
if is_classification:
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')

    print(f"\n=== Classification Metrics ===")
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1 Score:  {f1:.4f}")

    print(f"\n=== Classification Report ===")
    print(classification_report(y_test, y_pred))

    print(f"\n=== Confusion Matrix ===")
    print(confusion_matrix(y_test, y_pred))

    metrics = {
        'accuracy': float(accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'problem_type': 'classification'
    }
else:
    from sklearn.metrics import mean_absolute_error

    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"\n=== Regression Metrics ===")
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE:  {mae:.4f}")
    print(f"R²:   {r2:.4f}")

    metrics = {
        'rmse': float(rmse),
        'mae': float(mae),
        'r2_score': float(r2),
        'problem_type': 'regression'
    }

print("✓ Evaluation completed")
```

**Expected outcome**: Comprehensive performance metrics

### Step 8: Save Artifacts

**What to do**: Persist model, scaler, and experiment metadata

**Add to `train_model.py`**:

```python
print(f"\n[5/7] Saving artifacts...")

# Save model
model_path = f'models/model_{TIMESTAMP}.pkl'
joblib.dump(model, model_path)
print(f"✓ Model saved: {model_path}")

# Save scaler
scaler_path = f'models/scaler_{TIMESTAMP}.pkl'
joblib.dump(scaler, scaler_path)
print(f"✓ Scaler saved: {scaler_path}")

# Save metrics
metrics_path = f'results/metrics_{TIMESTAMP}.json'
with open(metrics_path, 'w') as f:
    json.dump(metrics, f, indent=2)
print(f"✓ Metrics saved: {metrics_path}")

# Save experiment log
experiment_log = {
    'timestamp': TIMESTAMP,
    'dataset': DATASET_PATH,
    'dataset_shape': df.shape,
    'target_column': TARGET_COLUMN,
    'features': X_processed.columns.tolist(),
    'numeric_features': numeric_cols,
    'categorical_features': categorical_cols,
    'model_type': type(model).__name__,
    'model_params': model.get_params(),
    'train_size': len(X_train),
    'test_size': len(X_test),
    'test_split_ratio': TEST_SIZE,
    'random_seed': RANDOM_SEED,
    'metrics': metrics,
    'feature_importance': feature_importance.to_dict('records'),
    'model_path': model_path,
    'scaler_path': scaler_path
}

experiment_path = f'experiments/experiment_{TIMESTAMP}.json'
with open(experiment_path, 'w') as f:
    json.dump(experiment_log, f, indent=2)
print(f"✓ Experiment log saved: {experiment_path}")
```

**Expected outcome**: All artifacts saved with timestamp

**Validation**:
```bash
ls -lh models/*.pkl experiments/*.json results/*.json | tail -5
```

### Step 9: Generate Summary

**What to do**: Create human-readable summary of experiment

**Add to `train_model.py`**:

```python
print(f"\n[6/7] Generating summary...")

summary = f"""
{'='*60}
ML TRAINING SUMMARY
{'='*60}

Timestamp: {TIMESTAMP}
Dataset: {DATASET_PATH} ({df.shape[0]} rows, {df.shape[1]} columns)
Target: {TARGET_COLUMN}

Model: {type(model).__name__}
Problem Type: {metrics['problem_type']}

Data Split:
  Training: {len(X_train)} samples ({(1-TEST_SIZE)*100:.0f}%)
  Testing:  {len(X_test)} samples ({TEST_SIZE*100:.0f}%)

Performance Metrics:
"""

for key, value in metrics.items():
    if key != 'problem_type':
        summary += f"  {key}: {value:.4f}\n"

summary += f"""
Top Features:
"""
for idx, row in feature_importance.head(5).iterrows():
    summary += f"  {row['feature']}: {row['importance']:.4f}\n"

summary += f"""
Artifacts:
  Model: {model_path}
  Scaler: {scaler_path}
  Experiment: {experiment_path}
  Metrics: {metrics_path}

{'='*60}
"""

print(summary)

# Save summary
summary_path = f'results/summary_{TIMESTAMP}.txt'
with open(summary_path, 'w') as f:
    f.write(summary)
print(f"✓ Summary saved: {summary_path}")

print(f"\n[7/7] Training pipeline completed successfully! ✓")
```

**Expected outcome**: Complete training summary

**Validation**: Read the summary
```bash
cat results/summary_*.txt | tail -30
```

### Step 10: Run Complete Training Pipeline

**What to do**: Execute the training script end-to-end

**Commands**:
```bash
# Ensure virtual environment is active
source venv/bin/activate

# Run training
python train_model.py

# Check outputs
ls -lh models/ experiments/ results/
```

**Expected outcome**:
- Model trained successfully
- All artifacts saved
- Summary printed and saved

**Validation**:
```bash
# Check all artifacts exist
test -f models/model_*.pkl && echo "✓ Model saved"
test -f models/scaler_*.pkl && echo "✓ Scaler saved"
test -f experiments/experiment_*.json && echo "✓ Experiment logged"
test -f results/metrics_*.json && echo "✓ Metrics saved"
test -f results/summary_*.txt && echo "✓ Summary saved"

# Verify model can be loaded
python -c "import joblib; model = joblib.load('$(ls models/model_*.pkl | tail -1)'); print('✓ Model loads successfully')"
```

---

## File Operations

### Create: `train_model.py`

**Location**: Project root

**Content**: Complete script combining all steps above (Steps 4-9)

**Purpose**: Single executable script for reproducible training

### Create: `requirements.txt`

**Location**: Project root

**Content**:
```txt
pandas>=1.3.0
numpy>=1.21.0
scikit-learn>=1.0.0
matplotlib>=3.4.0
seaborn>=0.11.0
joblib>=1.1.0
```

### Create: Directory structure

**Locations**:
- `models/` - Trained models and preprocessors
- `experiments/` - Experiment logs and configurations
- `results/` - Metrics, plots, and summaries
- `data/` - Input datasets (should exist)

---

## Validation

### Checks to Perform

1. **Environment Setup**
```bash
source venv/bin/activate
python --version | grep "3\."
pip list | grep scikit-learn
```

2. **Artifacts Exist**
```bash
ls models/*.pkl | wc -l  # Should be >= 2 (model + scaler)
ls experiments/*.json | wc -l  # Should be >= 1
ls results/*.json | wc -l  # Should be >= 1
```

3. **Model Loadable**
```python
import joblib
model = joblib.load('models/model_<timestamp>.pkl')
scaler = joblib.load('models/scaler_<timestamp>.pkl')
print("✓ Artifacts load successfully")
```

4. **Metrics Valid**
```python
import json
with open('results/metrics_<timestamp>.json') as f:
    metrics = json.load(f)

# For classification
if metrics['problem_type'] == 'classification':
    assert 0 <= metrics['accuracy'] <= 1, "Invalid accuracy"
    assert 0 <= metrics['f1_score'] <= 1, "Invalid F1"
    print(f"✓ Model accuracy: {metrics['accuracy']:.2%}")

# For regression
else:
    assert metrics['r2_score'] <= 1, "Invalid R²"
    assert metrics['rmse'] >= 0, "Invalid RMSE"
    print(f"✓ Model R²: {metrics['r2_score']:.4f}")
```

5. **Experiment Reproducible**
```python
# Load experiment config
with open('experiments/experiment_<timestamp>.json') as f:
    exp = json.load(f)

# Verify key fields
assert 'random_seed' in exp
assert 'model_params' in exp
assert 'dataset' in exp
print("✓ Experiment is reproducible")
```

### Success Criteria

1. ✅ Virtual environment created and activated
2. ✅ All dependencies installed
3. ✅ Model trained without errors
4. ✅ Test metrics calculated and reasonable (accuracy > 50% or R² > 0)
5. ✅ All artifacts saved with consistent timestamp
6. ✅ Experiment fully logged and reproducible
7. ✅ Model can be loaded and used for predictions

### If Validation Fails

**Problem**: `ModuleNotFoundError: No module named 'sklearn'`
**Cause**: Dependencies not installed or virtual environment not activated
**Solution**:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Problem**: `FileNotFoundError: [Errno 2] No such file or directory: 'data/dataset.csv'`
**Cause**: Dataset path incorrect
**Solution**:
```bash
# Find actual dataset location
find . -name "*.csv" -type f
# Update DATASET_PATH in train_model.py
```

**Problem**: `ValueError: could not convert string to float`
**Cause**: Categorical features not properly encoded
**Solution**: Check that all categorical columns are in `categorical_cols` and being encoded

**Problem**: Low model performance (accuracy < 50% or R² < 0)
**Causes**:
- Target column incorrect
- Data leakage (target in features)
- Random data/labels
**Solution**:
```python
# Check target distribution
print(df[TARGET_COLUMN].value_counts())
# Check for leakage
print([col for col in df.columns if TARGET_COLUMN in col.lower()])
```

---

## Example

### Before:
```
my-ml-project/
├── data/
│   └── customers.csv      # 5000 rows, 12 columns
└── README.md
```

### After:
```
my-ml-project/
├── data/
│   └── customers.csv
├── models/
│   ├── model_20251105_143022.pkl      # ← Trained model
│   └── scaler_20251105_143022.pkl     # ← Fitted scaler
├── experiments/
│   └── experiment_20251105_143022.json # ← Full experiment log
├── results/
│   ├── metrics_20251105_143022.json   # ← Performance metrics
│   └── summary_20251105_143022.txt    # ← Human-readable summary
├── venv/                               # ← Virtual environment
├── requirements.txt                    # ← Python dependencies
├── train_model.py                      # ← Training script
└── README.md
```

### Generated `experiments/experiment_20251105_143022.json`:
```json
{
  "timestamp": "20251105_143022",
  "dataset": "data/customers.csv",
  "dataset_shape": [5000, 12],
  "target_column": "churn",
  "features": ["age", "income", "balance", "tenure", "products", "active", "gender_encoded", "region_encoded"],
  "numeric_features": ["age", "income", "balance", "tenure", "products", "active"],
  "categorical_features": ["gender", "region"],
  "model_type": "RandomForestClassifier",
  "model_params": {
    "n_estimators": 100,
    "max_depth": 10,
    "random_state": 42,
    "n_jobs": -1
  },
  "train_size": 4000,
  "test_size": 1000,
  "test_split_ratio": 0.2,
  "random_seed": 42,
  "metrics": {
    "accuracy": 0.8560,
    "precision": 0.8573,
    "recall": 0.8560,
    "f1_score": 0.8552,
    "problem_type": "classification"
  },
  "feature_importance": [
    {"feature": "age", "importance": 0.2341},
    {"feature": "balance", "importance": 0.1876},
    {"feature": "products", "importance": 0.1654},
    {"feature": "tenure", "importance": 0.1432},
    {"feature": "income", "importance": 0.1201}
  ],
  "model_path": "models/model_20251105_143022.pkl",
  "scaler_path": "models/scaler_20251105_143022.pkl"
}
```

### Generated `results/summary_20251105_143022.txt`:
```
============================================================
ML TRAINING SUMMARY
============================================================

Timestamp: 20251105_143022
Dataset: data/customers.csv (5000 rows, 12 columns)
Target: churn

Model: RandomForestClassifier
Problem Type: classification

Data Split:
  Training: 4000 samples (80%)
  Testing:  1000 samples (20%)

Performance Metrics:
  accuracy: 0.8560
  precision: 0.8573
  recall: 0.8560
  f1_score: 0.8552

Top Features:
  age: 0.2341
  balance: 0.1876
  products: 0.1654
  tenure: 0.1432
  income: 0.1201

Artifacts:
  Model: models/model_20251105_143022.pkl
  Scaler: models/scaler_20251105_143022.pkl
  Experiment: experiments/experiment_20251105_143022.json
  Metrics: results/metrics_20251105_143022.json

============================================================
```

### Using the Trained Model:

```python
import joblib
import pandas as pd

# Load artifacts
model = joblib.load('models/model_20251105_143022.pkl')
scaler = joblib.load('models/scaler_20251105_143022.pkl')

# Prepare new data (same preprocessing as training)
new_data = pd.DataFrame({
    'age': [35],
    'income': [75000],
    'balance': [50000],
    'tenure': [3],
    'products': [2],
    'active': [1],
    'gender_encoded': [1],
    'region_encoded': [2]
})

# Scale and predict
new_data_scaled = scaler.transform(new_data)
prediction = model.predict(new_data_scaled)
probability = model.predict_proba(new_data_scaled)

print(f"Prediction: {prediction[0]}")
print(f"Probability: {probability[0]}")
```

---

## Troubleshooting

### Issue 1: Memory Error During Training

**Symptoms**:
- `MemoryError` or system freeze
- Process killed by OS

**Causes**:
- Dataset too large for available RAM
- Too many trees in Random Forest (`n_estimators`)

**Solutions**:
1. Reduce model complexity:
   ```python
   model = RandomForestClassifier(
       n_estimators=50,  # Reduce from 100
       max_depth=5       # Reduce from 10
   )
   ```

2. Sample the dataset:
   ```python
   df = df.sample(frac=0.5, random_state=42)  # Use 50% of data
   ```

3. Use incremental learning:
   ```python
   from sklearn.linear_model import SGDClassifier
   model = SGDClassifier()  # Trains on batches
   ```

### Issue 2: Poor Model Performance

**Symptoms**:
- Accuracy < 60% for classification
- R² < 0.3 for regression
- Random-looking predictions

**Causes**:
- Incorrect target column
- Insufficient feature engineering
- Class imbalance
- Data leakage

**Solutions**:

1. Verify target column:
   ```python
   print("Target distribution:")
   print(df[TARGET_COLUMN].value_counts(normalize=True))
   # Should not be 50/50 random split
   ```

2. Check for class imbalance:
   ```python
   from imblearn.over_sampling import SMOTE
   smote = SMOTE(random_state=42)
   X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
   ```

3. Feature engineering:
   ```python
   # Create interaction features
   X['age_income'] = X['age'] * X['income']
   # Create polynomial features
   from sklearn.preprocessing import PolynomialFeatures
   poly = PolynomialFeatures(degree=2, include_bias=False)
   X_poly = poly.fit_transform(X)
   ```

4. Check for data leakage:
   ```python
   # Target shouldn't appear in feature names
   leaky_features = [col for col in X.columns if TARGET_COLUMN.lower() in col.lower()]
   if leaky_features:
       print(f"⚠ Potential leakage: {leaky_features}")
       X = X.drop(columns=leaky_features)
   ```

### Issue 3: Training Takes Too Long

**Symptoms**:
- Training runs for hours
- No progress output

**Causes**:
- Too many estimators or depth
- Large dataset
- CPU bottleneck

**Solutions**:

1. Enable progress tracking:
   ```python
   model = RandomForestClassifier(verbose=2)  # Show progress
   ```

2. Reduce model complexity:
   ```python
   model = RandomForestClassifier(
       n_estimators=50,     # Fewer trees
       max_depth=8,         # Shallower trees
       max_features='sqrt'  # Fewer features per split
   )
   ```

3. Use simpler model for iteration:
   ```python
   from sklearn.linear_model import LogisticRegression
   model = LogisticRegression(max_iter=1000)  # Much faster
   ```

4. Use subset for development:
   ```python
   df_sample = df.sample(n=1000, random_state=42)
   # Develop on sample, train full model later
   ```

### Issue 4: Can't Load Saved Model

**Symptoms**:
- `FileNotFoundError` or `ModuleNotFoundError` when loading
- Version mismatch errors

**Causes**:
- Wrong file path
- Different scikit-learn version
- Missing dependencies

**Solutions**:

1. Check file exists:
   ```bash
   ls -lh models/*.pkl
   ```

2. Use correct path:
   ```python
   import glob
   latest_model = sorted(glob.glob('models/model_*.pkl'))[-1]
   model = joblib.load(latest_model)
   ```

3. Check scikit-learn version:
   ```python
   import sklearn
   print(f"scikit-learn version: {sklearn.__version__}")
   # Should match training environment
   ```

4. Save version info:
   ```python
   import sklearn
   experiment_log['sklearn_version'] = sklearn.__version__
   # Include in experiment log for reproducibility
   ```

### Issue 5: Categorical Encoding Fails

**Symptoms**:
- `ValueError: could not convert string to float`
- `TypeError: Cannot use .astype to convert from timezone-aware to timezone-naive`

**Causes**:
- Categorical features not detected
- Special data types (dates, times)

**Solutions**:

1. Explicitly specify categorical columns:
   ```python
   categorical_cols = ['gender', 'region', 'status']  # Manual list
   ```

2. Handle dates separately:
   ```python
   # Convert dates to numeric features
   df['date'] = pd.to_datetime(df['date'])
   df['year'] = df['date'].dt.year
   df['month'] = df['date'].dt.month
   df['day_of_week'] = df['date'].dt.dayofweek
   df = df.drop(columns=['date'])
   ```

3. Use pandas get_dummies:
   ```python
   X_processed = pd.get_dummies(X, columns=categorical_cols, drop_first=True)
   ```

---

## Notes for LLM Execution

### Execution Guidelines

- **Dataset path**: Always verify dataset exists before starting. Ask user if ambiguous.
- **Target column**: Confirm target column name with user if not obvious from data
- **Resource monitoring**: Warn user if dataset is very large (>100MB or >100k rows)
- **Progress updates**: Print status after each major step
- **Error handling**: If training fails, save intermediate results and explain error
- **Reproducibility**: Always use random seeds for reproducible results

### Adaptation Points

- **Dataset format**: Support CSV, JSON, and parquet - detect automatically
- **Problem type**: Auto-detect classification vs regression based on target variable
- **Missing values**: Adjust imputation strategy based on missing percentage
- **Categorical encoding**: Switch to one-hot encoding if memory allows (better for non-tree models)
- **Validation**: Add cross-validation if dataset is large enough (>1000 rows)

### Common Modifications

User may request:
- Different models (XGBoost, LightGBM, Neural Networks)
- Hyperparameter tuning (Grid Search, Random Search)
- Cross-validation instead of single split
- Custom metrics or evaluation criteria
- Plots and visualizations (learning curves, ROC curves)

Be prepared to adapt the script while maintaining the core structure and logging.

---

## Related Dossiers

- **deploy-ml-model.md** - Deploy trained model to production API
- **tune-hyperparameters.md** - Optimize model parameters with grid/random search
- **visualize-ml-results.md** - Create plots and dashboards for model analysis
- **monitor-ml-model.md** - Track model performance in production

---

## Version History

- **v1.0.0** (2025-11-05) - Initial version with scikit-learn Random Forest implementation

---

## Self-Improvement Notes

*This section follows the Dossier Protocol for self-improvement. LLMs executing this dossier should note any issues, improvements, or adaptations here.*

**Template for improvements**:
```markdown
### Improvement: [Title]
- **Date**: YYYY-MM-DD
- **Issue**: [What didn't work or could be better]
- **Solution**: [How it was improved]
- **Impact**: [What this enables or fixes]
```

---

**End of Dossier**

*Remember: This dossier is LLM-executable. An AI agent should be able to follow these instructions autonomously to train a production-ready ML model.*
