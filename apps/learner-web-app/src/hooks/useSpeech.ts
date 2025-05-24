import { useCallback, useState, useEffect } from 'react';

interface SpeechOptions {
  rate?: number;       // Speech rate (0.1 to 10)
  pitch?: number;      // Speech pitch (0 to 2)
  volume?: number;     // Speech volume (0 to 1)
  lang?: string;       // Language code (e.g., 'en-US')
  voice?: SpeechSynthesisVoice; // Specific voice to use
}

/**
 * A custom hook that provides text-to-speech functionality
 * with cross-browser support including fallbacks
 */
const useSpeech = () => {
  // Check if the Web Speech API is supported by the browser
  const isSpeechSupported = typeof window !== 'undefined' && 
    ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
  
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(false);

  // Load available voices
  useEffect(() => {
    if (!isSpeechSupported) {
      // Set fallback active for browsers without native support
      setFallbackActive(true);
      setIsLoaded(true);
      return;
    }

    // Function to get and set voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setIsLoaded(true);
      }
    };

    // Load voices
    loadVoices();

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSpeechSupported]);

  // Fallback function for browsers without speech support
  const fallbackSpeak = useCallback((text: string) => {
    console.log('Using fallback speech mechanism');
    
    // Approach 1: Alert the user (simplest fallback)
    // alert('Text-to-speech is not supported in your browser. Text content: ' + text);
    
    // Approach 2: Create a dedicated text-to-speech service API endpoint
    // This would require server-side implementation
    try {
      // For future server API implementation:
      // const audio = new Audio('https://your-tts-service.com/api/speech?text=' + encodeURIComponent(text));
      // audio.play();
      
      // For now, provide visual feedback
      const element = document.createElement('div');
      element.style.position = 'fixed';
      element.style.bottom = '20px';
      element.style.right = '20px';
      element.style.background = 'rgba(0,0,0,0.7)';
      element.style.color = 'white';
      element.style.padding = '10px';
      element.style.borderRadius = '5px';
      element.style.zIndex = '9999';
      element.style.maxWidth = '300px';
      element.textContent = `Speech feature is limited in your browser. Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`;
      
      document.body.appendChild(element);
      setTimeout(() => {
        if (document.body.contains(element)) {
          document.body.removeChild(element);
        }
      }, 5000);
      
      return true;
    } catch (e) {
      console.error('Fallback speech mechanism failed', e);
      return false;
    }
  }, []);

  /**
   * Speaks the provided text
   * @param text - The text to be spoken
   * @param options - Optional parameters for speech synthesis
   */
  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!isSpeechSupported) {
      return fallbackSpeak(text);
    }

    try {
      // Chrome bug fix: needs to call cancel() before speaking
      window.speechSynthesis.cancel();

      // Create a new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply custom options if provided
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;
      if (options.lang !== undefined) utterance.lang = options.lang;
      if (options.voice !== undefined) utterance.voice = options.voice;
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.error('Speech synthesis failed, trying fallback', e);
      return fallbackSpeak(text);
    }
  }, [isSpeechSupported, fallbackSpeak]);

  /**
   * Stops any active speech
   */
  const stop = useCallback(() => {
    if (isSpeechSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.error('Failed to stop speech', e);
      }
    }
  }, [isSpeechSupported]);

  /**
   * Pauses any active speech
   */
  const pause = useCallback(() => {
    if (isSpeechSupported) {
      try {
        window.speechSynthesis.pause();
      } catch (e) {
        console.error('Failed to pause speech', e);
      }
    }
  }, [isSpeechSupported]);

  /**
   * Resumes any paused speech
   */
  const resume = useCallback(() => {
    if (isSpeechSupported) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {
        console.error('Failed to resume speech', e);
      }
    }
  }, [isSpeechSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    voices,
    isLoaded,
    isSupported: isSpeechSupported || fallbackActive,
    usingFallback: fallbackActive
  };
};

export default useSpeech; 