"use client";

/**
 * Global error boundary — catches errors thrown in the root layout itself.
 * Must render its own <html>/<body> because it replaces the whole document.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Application error
        </h1>
        <p style={{ color: "#64748b" }}>
          A critical error occurred. {error.digest ? `(${error.digest})` : ""}
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
