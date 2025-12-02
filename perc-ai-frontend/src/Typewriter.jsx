import { useState, useEffect } from 'react';

const Typewriter = ({ text, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on new text
    if (text) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }
  }, [text, speed]);

  return (
    <div className="typewriter-text">
      {displayedText.split('\n').map((line, idx) => (
        <p key={idx}>{line || '\u00A0'}</p>
      ))}
      <span className="cursor" />
    </div>
  );
};

export default Typewriter;
