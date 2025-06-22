import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Gen Z Slang Dictionary";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#7c3aed",
          backgroundImage:
            "linear-gradient(45deg, #7c3aed 0%, #ec4899 50%, #3b82f6 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "80px",
              fontWeight: "bold",
              margin: "0 0 20px 0",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Gen Z Slang Dictionary 📱
          </h1>
          <p
            style={{
              fontSize: "32px",
              margin: "0 0 40px 0",
              opacity: 0.9,
            }}
          >
            Stay updated with the latest slang terms, no cap! 🔥
          </p>
          <div
            style={{
              display: "flex",
              gap: "30px",
              fontSize: "24px",
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "20px 40px",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span>✨ Featured Terms</span>
            <span>🔍 Search & Learn</span>
            <span>📚 Examples Included</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
