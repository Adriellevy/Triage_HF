import string
from data.make_dataset import get_df
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer 


def ini():
    train_df = get_df()
    nltk.download('stopword')
    nltk.download('wordnet')
    nltk.download('punkt')


def preprocess_text(text):
    text = text.lower()

    text = ''.join([char for char in text if char not in string.punctuation])

    tokens = nltk.word_tokenize(text)

    stop_words = set(stopwords.words('spanish'))

    filtered_tokens = [word for word in tokens if word not in stop_words]

    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]
    return ' '.join(lemmatized_tokens)

