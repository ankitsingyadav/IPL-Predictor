import pandas as pd
import pickle

# Load dataset
df = pd.read_csv('data/matches.csv', low_memory=False)

print("Columns:\n", df.columns)

# 🔥 Use correct columns from YOUR dataset
df = df[['batting_team','bowling_team','toss_winner','toss_decision','city','match_won_by']]

# Rename for model
df = df.rename(columns={
    'batting_team': 'team1',
    'bowling_team': 'team2',
    'match_won_by': 'winner'
})

# Clean data
df = df.dropna()

# Encode
from sklearn.preprocessing import LabelEncoder

encoders = {}
for col in df.columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Features
X = df.drop('winner', axis=1)
y = df['winner']

# Train model
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = XGBClassifier()
model.fit(X_train, y_train)

# Save model
pickle.dump(model, open('model/live_model.pkl','wb'))

print("✅ Model trained successfully")