import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import pickle
import os


data = {
    'Food': ['dominos pizza', 'zomato delivery', 'swiggy', 'mcdonalds burger', 'kfc chicken', 'biryani house', 'cafe coffee day', 'lunch at office', 'dinner with friends', 'restaurant bill', 'groceries from supermarket', 'food stall', 'chai and samosa', 'snacks', 'blinkit groceries', 'instamart', 'zepto delivery', 'starbucks', 'subway', 'taco bell'],
    'Transport': ['uber ride', 'ola cab', 'petrol pump', 'shell fuel', 'bus ticket', 'train booking', 'flight tickets', 'metro card recharge', 'taxi fare', 'auto rickshaw', 'toll plaza', 'rapido bike', 'redbus booking', 'irctc', 'makemytrip flight', 'indian oil', 'bharat petroleum'],
    'Entertainment': ['netflix subscription', 'spotify premium', 'movie tickets', 'concert pass', 'steam game', 'amazon prime video', 'hotstar vip', 'disney plus', 'youtube premium', 'pvr cinemas', 'bookmyshow', 'amusement park', 'playstation store'],
    'Shopping': ['amazon order', 'flipkart delivery', 'clothes from zara', 'shoes nike', 'shopping mall', 'myntra fashion', 'ajio', 'meesho', 'nykaa cosmetics', 'hm store', 'pantaloons', 'lifestyle', 'electronics croma', 'reliance digital'],
    'Utilities': ['electricity bill', 'wifi recharge', 'water tax', 'cooking gas cylinder', 'house rent', 'phone bill', 'internet broadband', 'mobile recharge', 'airtel prepaid', 'jio fiber', 'bsnl bill', 'bescom electricity', 'tatasky dth'],
    'Accommodation': ['hotel booking', 'airbnb stay', 'hostel fee', 'resort weekend', 'booking.com', 'oyo rooms', 'goibibo hotel', 'makemytrip hotel', 'taj hotels', 'guest house'],
    'Healthcare': ['pharmacy medicine', 'doctor consultation fee', 'hospital bill', 'apollo pharmacy', 'medplus', '1mg medicines', 'netmeds', 'dental clinic', 'dentist visit', 'gym membership', 'fitness center', 'health checkup', 'blood test'],
    'General': ['gift for friend', 'donation', 'haircut salon', 'laundry service', 'stationery', 'books', 'courier service', 'misc expense', 'pocket money', 'atm withdrawal']
}


titles = []
categories = []

for category, items in data.items():
    for item in items:
        titles.append(item)
        categories.append(category)

df = pd.DataFrame({'title': titles, 'category': categories})

model = make_pipeline(TfidfVectorizer(ngram_range=(1, 2), stop_words='english'), MultinomialNB())

print("Training model...")
model.fit(df['title'], df['category'])
print("Model trained successfully!")

model_path = 'model.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(model, f)
print(f"Model saved to {os.path.abspath(model_path)}")

test_titles = ["uber to work", "pizza hut dinner", "airtel wifi bill"]
predictions = model.predict(test_titles)
print("\nQuick Test:")
for title, category in zip(test_titles, predictions):
    print(f"'{title}' -> {category}")
