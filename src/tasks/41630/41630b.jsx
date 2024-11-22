import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const octaves = [4, 5]; // We'll use two octaves for simplicity

// Predefined poems with notes
const poems = {
  'Twinkle Twinkle Little Star': 'CCGGAAGFFEEDDCGGFFEEDGGFFEEDCCGGAAGFFEEDDC',
  'Jack and Jill': 'EEDCDEEGGFFEEDCDEEEEDDEDCDEEEEDCDE'
};

// Audio files are simulated here since we can't use external assets
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

function playNote(note, octave) {
  // Here you would typically load an audio file or synthesize a sound
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440 * Math.pow(2, (notes.indexOf(note) + (octave - 4) * 12) / 12), audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
}

function PianoKey({ note, octave, isPlaying, onClick }) {
  const isSharp = note.includes('#');
  const keyClass = `w-16 h-48 ${isSharp ? 'bg-black text-white h-32 w-10 relative -ml-2 -mr-2 z-10' : 'bg-white border'} flex justify-center items-end pb-2`;

  return (
    <button 
      onClick={() => { onClick(note, octave); playNote(note, octave); }} 
      className={keyClass + (isPlaying ? ' playing' : '')}
    >
      {note}{octave}
    </button>
  );
}

function PoemPlayer({ poem, isActive, onEnd }) {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  
  useEffect(() => {
    if (isActive && currentNoteIndex < poem.length) {
      const timeoutId = setTimeout(() => {
        playNote(poem[currentNoteIndex], 5); // Assuming octave 5 for simplicity
        setCurrentNoteIndex(currentNoteIndex + 1);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [currentNoteIndex, isActive, poem]);

  useEffect(() => {
    if (currentNoteIndex >= poem.length && isActive) {
      onEnd();
    }
  }, [currentNoteIndex, poem.length, isActive, onEnd]);

  return null; // This component doesn't render anything visible
}

export default function App() {
  const [mode, setMode] = useState('play');
  const [activePoem, setActivePoem] = useState(null);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const allKeys = octaves.flatMap(octave => 
      notes.map(note => ({ note, octave, isPlaying: false }))
    );
    setKeys(allKeys);
  }, []);

  const handleRandomPlay = () => {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    playNote(randomKey.note, randomKey.octave);
    setKeys(prevKeys => 
      prevKeys.map(key => 
        key.note === randomKey.note && key.octave === randomKey.octave ? 
        { ...key, isPlaying: true } : { ...key, isPlaying: false }
      )
    );
    setTimeout(() => {
      setKeys(prevKeys => 
        prevKeys.map(key => ({ ...key, isPlaying: false }))
      );
    }, 500);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-100 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Piano</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={() => setMode('play')}>Play</Button>
            <Button onClick={() => setMode('random')}>Random Play</Button>
            <Button onClick={() => setMode('poem')}>Play Poem</Button>
          </div>

          {mode === 'poem' && (
            <div className="flex space-x-2">
              {Object.keys(poems).map(poem => (
                <Button 
                  key={poem} 
                  onClick={() => { setActivePoem(poem); setMode('playPoem'); }}
                >
                  {poem}
                </Button>
              ))}
            </div>
          )}

          {mode === 'playPoem' && (
            <PoemPlayer 
              poem={poems[activePoem]} 
              isActive={mode === 'playPoem'} 
              onEnd={() => setMode('poem')}
            />
          )}

          <div className="flex space-x-1">
            {keys.map(key => (
              <PianoKey 
                key={`${key.note}${key.octave}`} 
                {...key} 
                onClick={(note, octave) => {
                  if (mode === 'play') playNote(note, octave);
                }}
                isPlaying={mode === 'playPoem' && activePoem && 
                  poems[activePoem][keys.findIndex(k => k.note === key.note && k.octave === key.octave)] === 
                  poems[activePoem][keys.findIndex(k => k.note === key.note && k.octave === key.octave)]}
              />
            ))}
          </div>

          {mode === 'random' && (
            <Button onClick={handleRandomPlay}>Play Random Note</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}