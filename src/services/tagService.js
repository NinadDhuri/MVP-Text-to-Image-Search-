const categories = {
  color: ['red', 'blue', 'white', 'black', 'silver', 'green', 'yellow', 'gray'],
  type: ['sedan', 'suv', 'truck', 'convertible', 'hatchback', 'wagon', 'coupe'],
  features: ['sunroof', 'leather', 'alloy wheels', 'spoiler', 'navigation', 'camera'],
  brand: ['toyota', 'honda', 'bmw', 'ford', 'audi', 'mercedes', 'chevrolet', 'kia', 'hyundai'],
};

const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');

const autoTag = (inputText) => {
  const text = normalize(inputText);
  const matches = [];
  Object.values(categories).forEach((values) => {
    values.forEach((value) => {
      if (text.includes(value)) {
        matches.push(value);
      }
    });
  });
  return Array.from(new Set(matches));
};

const extractKeywords = (text) => {
  const cleaned = normalize(text);
  const stopwords = ['a', 'an', 'the', 'with', 'and', 'for', 'car', 'vehicle'];
  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !stopwords.includes(token));
};

const combineTags = (manualTags = '', inferredTags = []) => {
  const manual = manualTags
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([...manual, ...inferredTags]));
};

module.exports = { categories, autoTag, extractKeywords, combineTags };
