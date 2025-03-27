const natural = require('natural');
const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-model');
const nlp = winkNLP(model);
const compromise = require('compromise');

// Initialize tokenizer and stemmer
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

exports.analyzeDocument = async (text) => {
  // Basic statistics
  const wordCount = tokenizer.tokenize(text).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Key phrases extraction
  const keyPhrases = extractKeyPhrases(text);
  
  // Named entities
  const entities = extractEntities(text);
  
  // Summary
  const summary = generateSummary(text);
  
  // Sentiment analysis
  const sentiment = analyzeSentiment(text);
  
  return {
    wordCount,
    sentenceCount: sentences.length,
    keyPhrases,
    entities,
    summary,
    sentiment,
    readingTime: Math.ceil(wordCount / 200) // 200 wpm average
  };
};

function extractKeyPhrases(text) {
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(text);
  
  const keyPhrases = [];
  tfidf.listTerms(0 /* document index */).forEach(item => {
    if (item.tfidf > 0.2) { // Threshold
      keyPhrases.push({
        term: item.term,
        importance: item.tfidf
      });
    }
  });
  
  return keyPhrases.slice(0, 10); // Return top 10
}

function extractEntities(text) {
  const doc = nlp.readDoc(text);
  return {
    people: doc.entities().filter(e => e.type() === 'PERSON').out('array'),
    places: doc.entities().filter(e => e.type() === 'LOC').out('array'),
    organizations: doc.entities().filter(e => e.type() === 'ORG').out('array')
  };
}

function generateSummary(text) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  if (sentences.length <= 3) return text;
  
  const summaryLength = Math.max(3, Math.floor(sentences.length * 0.3)); // 30% of sentences
  return sentences.slice(0, summaryLength).join(' ');
}

function analyzeSentiment(text) {
  const analyzer = new natural.SentimentAnalyzer();
  const stemmedText = stemmer.tokenizeAndStem(text);
  const score = analyzer.getSentiment(stemmedText);
  
  return {
    score,
    label: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
  };
}