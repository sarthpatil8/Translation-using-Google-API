import React, { useState } from 'react';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';
import './Translate.css';
import githubLogo from './images/github-logo.png'; 
import linkedinLogo from './images/linkedin-logo.png';

const languages = {
  English: 'English',
  Hindi: 'Hindi',
  Marathi: 'Marathi',
  Spanish : 'Spanish',
  French: 'French'
};

const Translate = () => {
  const [text, setText] = useState('');
  const [translatedChunks, setTranslatedChunks] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Marathi');

  const apiEndpoint = 'http://localhost:5757/api/translate';

  const splitText = (text, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  };

  const translateChunk = async (chunk) => {
    try {
      const response = await axios.post(apiEndpoint, {
        text: chunk,
        from: sourceLanguage,
        to: targetLanguage
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      return data.translatedText;
    } catch (error) {
      console.error('Error:', error);
      return 'Translation failed';
    }
  };

  const handleTranslate = async (event) => {
    event.preventDefault();
    setIsTranslating(true);
    setTranslatedChunks([]);

    const chunks = splitText(text, 5000);

    for (const chunk of chunks) {
      const translatedText = await translateChunk(chunk);
      setTranslatedChunks((prevChunks) => [...prevChunks, translatedText]);
    }

    setIsTranslating(false);
  };

  return (
    <div className="translation-container">
      <h1>Translation App using Google API</h1>
      <form onSubmit={handleTranslate} className="translation-form">
        <div className="language-selector">
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
          >
            {Object.keys(languages).map((lang) => (
              <option key={lang} value={lang}>
                {languages[lang]}
              </option>
            ))}
          </select>
          <span>to</span>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            {Object.keys(languages).map((lang) => (
              <option key={lang} value={lang}>
                {languages[lang]}
              </option>
            ))}
          </select>
        </div>
        <div className="input-box">
          <textarea
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here..."
          />
          <button type="submit" disabled={isTranslating}>
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>
        <div className="output-box">
          <h3>Translated Text:</h3>
          {translatedChunks.map((chunk, index) => (
            <div key={index}>
              <Typewriter
                words={[chunk]}
                cursor={false}
                typeSpeed={30}
                deleteSpeed={15}
              />
            </div>
          ))}
        </div>
      </form>
      <div className="icon-container">
        <a href="https://github.com/sarthpatil8" target="_blank" rel="noopener noreferrer">
          <img src={githubLogo}  alt="GitHub" />
        </a>
        <a href="https://www.linkedin.com/in/sarth-patil-7257541b2" target="_blank" rel="noopener noreferrer">
          <img src={linkedinLogo} alt="LinkedIn" />
        </a>
      </div>
    </div>
  );
};

export default Translate;
