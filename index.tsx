import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Check if root already exists to prevent hot reload issues
let root: ReactDOM.Root;

if ((window as any).__reactRoot) {
  // If root already exists, use it
  root = (window as any).__reactRoot;
} else {
  // Create new root
  root = ReactDOM.createRoot(rootElement);
  (window as any).__reactRoot = root;
}

root.render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(App, null)
  )
);
