// @ts-check
import React from "react";

/** Using JSDoc to type-check this React component in a .jsx file
 * @typedef {Object} LegacyWidgetProps
 * @property {string} title
 * @property {string=} subtitle
 * @property {() => void=} onClick
 * @property {React.ReactNode=} children
 */

/**
 * @param {LegacyWidgetProps} props
 * @returns {React.JSX.Element}
 */
export default function LegacyWidget({ title, subtitle, onClick, children }) {
  return (
    <section>
      <button type="button" onClick={onClick}>
        {title}
      </button>
      {subtitle ? <p>{subtitle}</p> : null}
      {children}
    </section>
  );
}