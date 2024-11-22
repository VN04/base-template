import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const pianoNotes = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2"
];

const poems = {
  twinkle: ["C", "C", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C"],
  jackAndJill: ["E", "D", "C", "D", "E", "E", "E", "D", "D", "D", "E", "G", "G"]
};

const PianoKey = ({ note, isActive, onClick }) => (
  <button
    className={`w-10 h-40 border border-gray-300 ${
      note.includes("#") ? "bg-black text-white" : "bg-white"
    } ${isActive ? "bg-blue-500" : ""}`}
    onClick={() => onClick(note)}
  >
    {note}
  </button>
);

const Piano = ({ activeNote, onKeyPress }) => (
  <div className="flex overflow-x-auto p-4">
    {pianoNotes.map((note) => (
      <PianoKey
        key={note}
        note={note}
        isActive={activeNote === note}
        onClick={onKeyPress}
      />
    ))}
  </div>
);

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const playNote = (frequency) => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
};

const noteToFrequency = (note) => {
  const noteMap = {
    "C": 261.63, "C#": 277.18, "D": 293.66, "D#": 311.13, "E": 329.63,
    "F": 349.23, "F#": 369.99, "G": 392.00, "G#": 415.30, "A": 440.00,
    "A#": 466.16, "B": 493.88, "C2": 523.25, "C#2": 554.37, "D2": 587.33,
    "D#2": 622.25, "E2": 659.25, "F2": 698.46, "F#2": 739.99, "G2": 783.99,
    "G#2": 830.61, "A2": 880.00, "A#2": 932.33, "B2": 987.77
  };
  return noteMap[note];
};

export default function App() {
  const [mode, setMode] = useState("user");
  const [activeNote, setActiveNote] = useState(null);
  const [poem, setPoem] = useState(null);
  const [poemIndex, setPoemIndex] = useState(0);

  const playRandomNote = useCallback(() => {
    const randomNote = pianoNotes[Math.floor(Math.random() * pianoNotes.length)];
    setActiveNote(randomNote);
    playNote(noteToFrequency(randomNote));
  }, []);

  const playPoemNote = useCallback(() => {
    if (poem && poemIndex < poems[poem].length) {
      const note = poems[poem][poemIndex];
      setActiveNote(note);
      playNote(noteToFrequency(note));
      setPoemIndex(poemIndex + 1);
    }
  }, [poem, poemIndex]);

  useEffect(() => {
    let interval;
    if (mode === "random") {
      interval = setInterval(playRandomNote, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, playRandomNote]);

  useEffect(() => {
    if (mode === "poem") {
      playPoemNote();
    }
  }, [mode, poem, poemIndex, playPoemNote]);

  const handleKeyPress = (note) => {
    setActiveNote(note);
    playNote(noteToFrequency(note));
    if (mode === "poem" && note === poems[poem][poemIndex - 1]) {
      playPoemNote();
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setActiveNote(null);
    setPoemIndex(0);
    if (newMode === "poem") {
      setPoem("twinkle");
    } else {
      setPoem(null);
    }
  };

  const handlePoemChange = (newPoem) => {
    setPoem(newPoem);
    setPoemIndex(0);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Interactive Piano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Select value={mode} onValueChange={handleModeChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User Play</SelectItem>
                <SelectItem value="random">Random Play</SelectItem>
                <SelectItem value="poem">Play Poem</SelectItem>
              </SelectContent>
            </Select>
            {mode === "poem" && (
              <Select value={poem} onValueChange={handlePoemChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select poem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twinkle">Twinkle Twinkle Little Star</SelectItem>
                  <SelectItem value="jackAndJill">Jack and Jill</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <Piano activeNote={activeNote} onKeyPress={handleKeyPress} />
        </CardContent>
      </Card>
      {mode === "poem" && (
        <Card>
          <CardHeader>
            <CardTitle>Poem Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {poems[poem].map((note, index) => (
                <Button
                  key={index}
                  variant={index < poemIndex ? "default" : "outline"}
                >
                  {note}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}