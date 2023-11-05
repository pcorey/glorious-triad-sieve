import logo from "./logo.svg";
import "./App.css";
import _ from "lodash";
import styled from "styled-components";

const cubehelix = (s, r, h, g) => (d) => {
  let t = 2 * Math.PI * (s / 3 + r * d);
  let a = (h * Math.pow(d, g) * (1 - Math.pow(d, g))) / 2;
  return [
    Math.pow(d, g) + a * (-0.14861 * Math.cos(t) + Math.sin(t) * 1.78277),
    Math.pow(d, g) + a * (-0.29227 * Math.cos(t) + Math.sin(t) * -0.90649),
    Math.pow(d, g) + a * (1.97294 * Math.cos(t) + Math.sin(t) * 0.0),
  ];
};

let colorizer = cubehelix(0.5, 2, 1, 0.5);

let noteToDisplay = (note) => {
  switch (note) {
    case 0:
      return "C";
    case 1:
      return "C#/Db";
    case 2:
      return "D";
    case 3:
      return "D#/Eb";
    case 4:
      return "E";
    case 5:
      return "F";
    case 6:
      return "F#/Gb";
    case 7:
      return "G";
    case 8:
      return "G#/Ab";
    case 9:
      return "A";
    case 10:
      return "A#/Bb";
    case 11:
      return "B";
  }
};

let qualities = [
  { symbol: "°", intervals: [0, 3, 6] },
  { symbol: "m", intervals: [0, 3, 7] },
  { symbol: "", intervals: [0, 4, 7] },
  { symbol: "+", intervals: [0, 4, 8] },
];

let chords = _.chain(12)
  .range()
  .flatMap((root) =>
    _.map(qualities, (quality) => ({
      root,
      name: noteToDisplay(root) + quality.symbol,
      notes: _.map(quality.intervals, (interval) => (root + interval) % 12),
    }))
  )
  .value();

function App() {
  let debug = false;
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 11 14">
        <rect x="0" y="0" width="11" height="14" fill="white" />
        {debug &&
          _.map(_.range(15), (i) => (
            <line
              x1={0}
              y1={i}
              x2={11}
              y2={i}
              stroke-width="0.01"
              stroke="black"
            />
          ))}
        {debug &&
          _.map(_.range(12), (i) => (
            <line
              x1={i}
              y1={0}
              x2={i}
              y2={14}
              stroke-width="0.01"
              stroke="black"
            />
          ))}
        {_.chain(chords) // Back
          .chunk(4)
          .map((row, rowIndex) => {
            return _.map(row, (chord, index) => (
              <text
                key={rowIndex * 4 + index}
                x={1 + index * 2 + 1.5}
                y={1 + rowIndex + 0.5}
                alignment-baseline="middle"
                text-anchor="middle"
                fill="black"
              >
                {chord.name}
              </text>
            ));
          })
          .value()}
      </svg>
      <svg viewBox="0 0 11 14">
        {!debug &&
          _.map(_.range(0, 12), (root) => {
            let [r, g, b] = colorizer((root + 1) / 13);
            return (
              <>
                <mask id={`page-mask-${root}`}>
                  <rect x="0" y="0" width="10" height="14" fill="white" />
                  {_.chain(chords) // Note pages
                    .chunk(4)
                    .map((row, rowIndex) => {
                      return (
                        <>
                          {_.map(row, (chord, index) => (
                            <>
                              {_.includes(chord.notes, root) && (
                                <rect
                                  x={1 + index * 2 + 0.1}
                                  y={1 + rowIndex + 0.1}
                                  width="1.8"
                                  height="0.8"
                                  fill="black"
                                />
                              )}
                            </>
                          ))}
                        </>
                      );
                    })
                    .value()}
                  <rect x={2} y={1} width={1} height={12} fill="black" />
                  <rect x={4} y={1} width={1} height={12} fill="black" />
                  <rect x={6} y={1} width={1} height={12} fill="black" />
                  <rect x={8} y={1} width={1} height={12} fill="black" />
                  <rect x={9} y={0} width={1} height={root + 1} fill="black" />
                  <rect
                    x={9}
                    y={root + 2}
                    width={1}
                    height={14 - root}
                    fill="black"
                  />
                </mask>
                <g>
                  <rect
                    x="0"
                    y="0"
                    width="10"
                    height="14"
                    fill={`rgb(${r * 255}, ${g * 255}, ${b * 255})`}
                    mask={`url(#page-mask-${root})`}
                  />
                  <rect
                    x={10}
                    y={root + 1}
                    width={1}
                    height={1}
                    fill={`rgb(${r * 255}, ${g * 255}, ${b * 255})`}
                  />
                  <text
                    x={10.5}
                    y={root + 1.5}
                    alignment-baseline="middle"
                    text-anchor="middle"
                  >
                    {noteToDisplay(root)}
                  </text>
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    from="0 0"
                    to="1 0"
                    dur="0.5s"
                    begin="click"
                    fill="freeze"
                  />
                </g>
              </>
            );
          })}
        {debug &&
          _.map(_.range(0, 12), (root) => (
            <>
              <rect x="0" y="0" width="11" height="14" fill="white" />
              {_.map(_.range(15), (i) => (
                <line
                  x1={0}
                  y1={i}
                  x2={11}
                  y2={i}
                  stroke-width="0.01"
                  stroke="black"
                />
              ))}
              {_.map(_.range(12), (i) => (
                <line
                  x1={i}
                  y1={0}
                  x2={i}
                  y2={14}
                  stroke-width="0.01"
                  stroke="black"
                />
              ))}
              {_.chain(chords) // Note pages
                .chunk(4)
                .map((row, rowIndex) => {
                  return (
                    <>
                      {_.map(row, (chord, index) => (
                        <>
                          {_.includes(chord.notes, root) && (
                            <rect
                              x={1 + index * 2 + 0.1}
                              y={1 + rowIndex + 0.1}
                              width="1.8"
                              height="0.8"
                              fill="rgba(0,0,0,0.25)"
                            />
                          )}
                          <text
                            key={rowIndex * 4 + index}
                            x={1 + index * 2 + 1.5}
                            y={1 + rowIndex + 0.5}
                            alignment-baseline="middle"
                            text-anchor="middle"
                            fill={
                              _.includes(chord.notes, root)
                                ? "black"
                                : "dodgerblue"
                            }
                          >
                            {chord.name}
                          </text>
                        </>
                      ))}
                    </>
                  );
                })
                .value()}
              <rect
                x={10}
                y={0}
                width={1}
                height={root + 1}
                fill="rgba(0,0,0,0.25)"
              />
              <text
                x={10.5}
                y={root + 1.5}
                alignment-baseline="middle"
                text-anchor="middle"
              >
                {noteToDisplay(root)}
              </text>
              <rect
                x={10}
                y={root + 2}
                width={1}
                height={14 - root}
                fill="rgba(0,0,0,0.25)"
              />
            </>
          ))}
      </svg>
      {!debug && (
        <svg viewBox="0 0 11 14" style={{ pointerEvents: "none" }}>
          <mask id="cover-mask">
            <rect x="0" y="0" width="11" height="14" fill="white" />
            <rect x={2} y={1} width={1} height={12} fill="black" />
            <rect x={4} y={1} width={1} height={12} fill="black" />
            <rect x={6} y={1} width={1} height={12} fill="black" />
            <rect x={8} y={1} width={1} height={12} fill="black" />
            <rect x={10} y={0} width={1} height={14} fill="black" />
          </mask>
          <rect
            x="0"
            y="0"
            width="11"
            height="14"
            fill="oldlace"
            mask="url(#cover-mask)"
          />
        </svg>
      )}
      {debug && (
        <svg viewBox="0 0 11 14" style={{ pointerEvents: "none" }}>
          {_.map(_.range(15), (i) => (
            <line
              x1={0}
              y1={i}
              x2={11}
              y2={i}
              stroke-width="0.01"
              stroke="black"
            />
          ))}
          {_.map(_.range(12), (i) => (
            <line
              x1={i}
              y1={0}
              x2={i}
              y2={14}
              stroke-width="0.01"
              stroke="black"
            />
          ))}
          <rect x={2} y={1} width={1} height={12} fill="rgba(0,0,0,0.25)" />
          <rect x={4} y={1} width={1} height={12} fill="rgba(0,0,0,0.25)" />
          <rect x={6} y={1} width={1} height={12} fill="rgba(0,0,0,0.25)" />
          <rect x={8} y={1} width={1} height={12} fill="rgba(0,0,0,0.25)" />
          <rect x={10} y={0} width={1} height={14} fill="rgba(0,0,0,0.25)" />
        </svg>
      )}
    </div>
  );
}

export default App;
