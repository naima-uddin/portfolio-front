"use client";

import { useEffect, useState } from "react";

// Types and deletes each word in a loop.
const Typewriter = ({ words }: { words: string[] }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];

    const timeout = setTimeout(
      () => {
        if (!deleting) {
          const next = current.slice(0, text.length + 1);
          setText(next);
          if (next === current) {
            setTimeout(() => setDeleting(true), 1600);
          }
        } else {
          const next = current.slice(0, text.length - 1);
          setText(next);
          if (next === "") {
            setDeleting(false);
            setWordIndex((i) => (i + 1) % words.length);
          }
        }
      },
      deleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words]);

  return (
    <span>
      {text}
      <span className="typewriter-caret" style={{ height: "1em" }}>
        &nbsp;
      </span>
    </span>
  );
};

export default Typewriter;
