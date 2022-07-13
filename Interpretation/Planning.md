## Queries:

- What is the weather like today
  It is hot today
- Where is [family member] at
  Seattle
- Is it going to rain today
  Yes
- What song is currently playing
  Lacrimosa
- How many emails do I have
  8

## Commands:

- Turn off the lights at 11pm
  I'll turn the lights off at 11pm

- Play [song] by [artist]
  Playing [song] by [artist] on [device]

- Go through my emails
  Checking emails

## Maybe both:

- Can you go through my emails for me?
  Yes I can, would you like me to do that?
  This is query, but it also asks for affirmation to run a command

- Hey would you open a PR for me?
  Yes I can. What repo and branch?
  This is leaning more towards a command. "Would you" is like "will you", as in "willing you" or compelling you to do something.

## Telling them Apart

_This is a binary classification problem. We want to take a statement and be able to tell whether it is a query or a command._

### Methods

- Regex Matching and Dictionary Lookup: <br>
  If I have a sentence, I can cross reference the words in that sentence with a dictionary of words and their meanings. If query like language is detected,
  I can run it through query extraction. If command like language is detected, I can run it through command extraction. If neither, either Onyx simply doesn't understand, it is a mix of both, or it needs to go through a different method. This will be good for simple, common tasks with complex functionality.<br>
  Pros:
  - Easier to implement: I won't need to train a model to understand the language.
  - Easy to test: I can test it with a sentence and see if it is a query or a command.
  - Easy to understand: I can see what the method is figuring out about the input pretty easily.
  - Easy to extend: I can add more words to the dictionary.
  - Faster: This works in a predictable time complexity, and won't need to be trained.
    Cons:
  - Less Flexible: In order to add new possible inputs, I need to extend the dictionary. It won't classify input that doesn't match the dictionary.
  - Less Scalable: As I add more and more dictionary input, the keeping track of all of the interactions could become a nightmare. I'll need to be able to get probabilities of each outcome.
  - Less Nuanced: This dictionary is rule based, strictly, it will not be able to understand nuances of human language that a model could learn to understand.

<br>

- Neural Networks: <br>
  These can recognize a binary pretty quickly, and are significantly more flexible. Given enough training data, and the corresponding outcome of each input, I can predict the probability of a query or command. This means I can extend the functionality of the model by providing it examples of new inputs I could use, and how they should be interpreted. This will be good for complex inputs with varying complexity.<br>
  Pros:
  - More flexible: I can add new inputs to the model, and I can extend the functionality of the model.
  - More scalable: I can add more data to the model, and I can extend the functionality of the model. There won't be overlapping because I'll just have probabilities of each outcome.
  - More nuanced: The model can be trained to take into consideration nuance and context, and therefore be able to understand more complex inputs.
    Cons:
  - Slower: This takes longer to train, and it will take longer to run.
  - Harder to implement: I need to train a model to understand the language. I'm not a data scientist, so I'll have to learn a lot to do this properly
