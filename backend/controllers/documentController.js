const pdf = require('pdf-parse');
const natural = require('natural');
const Sentiment = require('sentiment');
const fs = require('fs');
const path = require('path');

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const tfidf = new natural.TfIdf();
const sentiment = new Sentiment();

exports.analyzeDocument = async (file) => {
  try {
    // Validate file
    if (!file || !file.path) {
      throw new Error('Invalid file object');
    }

    // Read file content
    let text;
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdf(dataBuffer);
      text = data.text;
    } else if (file.mimetype === 'text/plain') {
      text = fs.readFileSync(file.path, 'utf-8');
    } else {
      throw new Error('Unsupported file type');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Document is empty or could not be read');
    }

    // Basic analysis
    const words = tokenizer.tokenize(text) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Key phrases extraction
    tfidf.addDocument(text);
    const keyPhrases = [];
    tfidf.listTerms(0).forEach(item => {
      if (item.tfidf > 0.2 && keyPhrases.length < 10) {
        keyPhrases.push(item.term);
      }
    });

    // Sentiment analysis using the sentiment package
    const sentimentResult = sentiment.analyze(text);
    const sentimentScore = sentimentResult.comparative;

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      keyPhrases: keyPhrases.length > 0 ? keyPhrases : ['No significant phrases found'],
      sentiment: getSentimentLabel(sentimentScore),
      readingTime: Math.max(1, Math.ceil(words.length / 200)),
      characterCount: text.length,
      sentimentScore: sentimentScore
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

function getSentimentLabel(score) {
  if (score > 0.05) return 'positive';
  if (score < -0.05) return 'negative';
  return 'neutral';
}
