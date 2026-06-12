import pickle

model = pickle.load(open('model/live_model.pkl','rb'))

def predict(data):
    return model.predict_proba(data)[0]