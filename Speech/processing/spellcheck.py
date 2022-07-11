from hunspell import Hunspell

h = Hunspell("en_US")


def auto_correct(word):
    return h.suggest(word)[0]


def auto_correct_sentence(sentence):
    words = sentence.split()
    corrected_words = []
    for word in words:
        corrected_words.append(auto_correct(word))
    return " ".join(corrected_words)
