from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import pickle
from sklearn.utils import Bunch

# Load dataset
digits = load_digits()
X, y = digits.data, digits.target

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LogisticRegression(max_iter=2000)
model.fit(X_train, y_train)

# Save model
with open("sklearn_digit_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved.")
