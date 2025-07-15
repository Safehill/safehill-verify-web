"use client";

import React, { useEffect, useState, useRef } from "react";

const TypewriterHeadline = ({
  strings,
  className,
  style,
}: {
  strings: string[];
  className: string;
  style: React.CSSProperties;
}) => {
  const [displayed, setDisplayed] = useState("");
  const [stringIdx, setStringIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate the maximum number of lines for all strings (for minHeight)
  const maxLines = React.useMemo(() => {
    return Math.max(
      ...strings.map((s) => s.split(/<br\s*\/?>/i).length)
    );
  }, [strings]);

  useEffect(() => {
    const currentString = strings[stringIdx];
    // Split on <br /> for line breaks
    const parts = currentString.split(/<br\s*\/?>/i);
    let fullString = parts.join("\n");

    if (!deleting) {
      if (charIdx < fullString.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(fullString.slice(0, charIdx + 1));
          setCharIdx(charIdx + 1);
        }, 50);
      } else {
        // Pause before deleting (increased by 1s: 1200 + 1000 = 2200ms)
        timeoutRef.current = setTimeout(() => {
          setDeleting(true);
        }, 2200);
      }
    } else {
      if (charIdx > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(fullString.slice(0, charIdx - 1));
          setCharIdx(charIdx - 1);
        }, 30);
      } else {
        // Move to next string
        timeoutRef.current = setTimeout(() => {
          setDeleting(false);
          setStringIdx((stringIdx + 1) % strings.length);
        }, 200);
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [charIdx, deleting, stringIdx, strings]);

  useEffect(() => {
    // Reset charIdx when stringIdx changes
    setCharIdx(0);
  }, [stringIdx]);

  // Render with line breaks
  const lines = displayed.split("\n");

  // To prevent layout shift, always render the same number of lines (maxLines)
  // Fill with invisible lines if needed
  // The caret should always be at the end of the last visible character, not on a new line

  // We'll use a monospace font for the invisible lines to ensure consistent height,
  // but inherit the font for the visible lines.
  return (
    <h1
      className={className}
      style={{
        ...style,
        minHeight: undefined, // Don't set minHeight, use fixed lines instead
        position: "relative",
        display: "block",
      }}
    >
      {Array.from({ length: maxLines }).map((_, i) => {
        // For each line slot, render the real line if available, else an invisible placeholder
        const isLastLine = i === lines.length - 1;
        const isCaretLine = isLastLine && lines[i] !== undefined;
        const lineContent = lines[i] !== undefined ? lines[i] : "\u00A0"; // non-breaking space for empty lines

        return (
          <div
            key={i}
            style={{
              display: "block",
              minHeight: "1em",
              lineHeight: "1.1em",
              // Prevent margin collapse
              margin: 0,
              padding: 0,
              // For invisible lines, use visibility hidden
              visibility: lines[i] !== undefined ? "visible" : "hidden",
              // Prevent font fallback shift
              fontFamily: "inherit",
              fontWeight: "inherit",
              fontSize: "inherit",
              textAlign: "inherit",
              whiteSpace: "pre",
            }}
          >
            {lineContent}
            {/* Only append the caret to the last visible line */}
            {isCaretLine && (
              <span
                className="animate-blink-caret text-orange-200"
                style={{
                  fontWeight: "bold",
                  marginLeft: "2px",
                  display: "inline-block",
                  width: "0.1em", // Make caret wider
                  height: "1.2em",
                  verticalAlign: "middle",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "100%",
                    height: "100%",
                    background: "currentColor",
                    borderRadius: "2px",
                    opacity: 0.8,
                  }}
                ></span>
              </span>
            )}
          </div>
        );
      })}
      <style>
        {`
          @keyframes blinkCaretYellow {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          .animate-blink-caret {
            animation: blinkCaretYellow 1s step-end infinite;
          }
        `}
      </style>
    </h1>
  );
};

export default TypewriterHeadline;