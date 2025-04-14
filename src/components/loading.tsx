import React from "react";

const Loading: React.FC = () => {
  return (
    <svg className="pl" viewBox="0 0 56 56" width="56px" height="56px" role="img" aria-label="Soccer ball">
      <clipPath id="ball-clip">
        <circle r="8" />
      </clipPath>
      <defs>
        <path id="hex" d="M 0 -9.196 L 8 -4.577 L 8 4.661 L 0 9.28 L -8 4.661 L -8 -4.577 Z" />
        <g id="hex-chunk" fill="none" stroke="hsl(var(--hue),10%,10%)" strokeWidth="0.5">
          <use href="#hex" fill="hsl(var(--hue),10%,10%)" />
          <use href="#hex" transform="translate(16,0)" />
          <use href="#hex" transform="rotate(60) translate(16,0)" />
        </g>
        <g id="hex-pattern" transform="scale(0.333)">
          <use href="#hex-chunk" />
          <use href="#hex-chunk" transform="rotate(30) translate(0,48) rotate(-30)" />
          <use href="#hex-chunk" transform="rotate(-180) translate(0,27.7) rotate(180)" />
          <use href="#hex-chunk" transform="rotate(-120) translate(0,27.7) rotate(120)" />
          <use href="#hex-chunk" transform="rotate(-60) translate(0,27.7) rotate(60)" />
          <use href="#hex-chunk" transform="translate(0,27.7)" />
          <use href="#hex-chunk" transform="rotate(60) translate(0,27.7) rotate(-60)" />
          <use href="#hex-chunk" transform="rotate(120) translate(0,27.7) rotate(-120)" />
        </g>
        <g id="ball-texture" transform="translate(0,-3.5)">
          <use href="#hex-pattern" transform="translate(-48,0)" />
          <use href="#hex-pattern" transform="translate(-32,0)" />
          <use href="#hex-pattern" transform="translate(-16,0)" />
          <use href="#hex-pattern" transform="translate(0,0)" />
          <use href="#hex-pattern" transform="translate(16,0)" />
        </g>
      </defs>
      <filter id="ball-shadow-outside">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>
      <g transform="translate(28,28)">
        <g className="plStripeDotGroup" fill="var(--red)">
          <circle className="plStripeDot" transform="rotate(32) translate(-18.25,0)" />
          <circle className="plStripeDot" transform="rotate(87) translate(-18.25,0)" />
          <circle className="plStripeDot" transform="rotate(103) translate(-18.25,0)" />
          <circle className="plStripeDot" transform="rotate(138) translate(-18.25,0)" />
          <circle className="plStripeDot" transform="rotate(228) translate(-18.25,0)" />
          <circle className="plStripeDot" transform="rotate(243) translate(-18.25,0)" />
          <circle className="plStripeDot" transform="rotate(328) translate(-18.25,0)" />
        </g>
        <g className="plBall" transform="translate(0,-15.75)">
          <circle className="plBallShadow" filter="url(#ball-shadow-outside)" fill="hsla(var(--hue),10%,10%,0.5)" r="8" cx="1" cy="1" />
          <circle fill="var(--white)" r="8" />
          <g clipPath="url(#ball-clip)">
            <use className="plBallTexture" href="#ball-texture" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Loading;
