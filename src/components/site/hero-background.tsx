"use client";

import React, { Component, useEffect, useState, type ReactNode } from "react";
import Spline from "@splinetool/react-spline";

class SplineBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {

  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return (
      typeof WebGLRenderingContext !== "undefined" &&
      !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function LightMesh() {
  return (
    <div className="absolute inset-0 bg-white">
      <div className="absolute -left-[10%] -top-[22%] h-[62vmax] w-[62vmax] rounded-full bg-[radial-gradient(circle,rgba(67,225,240,0.26),transparent_60%)] blur-3xl" />
      <div className="absolute -right-[12%] top-[2%] h-[54vmax] w-[54vmax] rounded-full bg-[radial-gradient(circle,rgba(67,225,240,0.16),transparent_60%)] blur-3xl" />
      <div className="absolute bottom-[-28%] left-[28%] h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.16),transparent_60%)] blur-3xl" />
      <div className="absolute inset-0 grid-overlay opacity-70" />
    </div>
  );
}

export function HeroBackground() {
  const [useSpline, setUseSpline] = useState(false);

  useEffect(() => {
    setUseSpline(webglAvailable());
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">

      <LightMesh />

      {useSpline && (
        <div
          className="absolute inset-0"
          style={{ filter: "invert(1) hue-rotate(180deg) brightness(1.05)" }}
        >
          <SplineBoundary fallback={null}>
            <Spline
              style={{ width: "100%", height: "100%" }}
              scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode"
            />
          </SplineBoundary>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, rgba(255,255,255,0.92), rgba(255,255,255,0.25) 26%, rgba(255,255,255,0.25) 74%, rgba(255,255,255,0.92)),
            linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 36%, rgba(255,255,255,0.35) 62%, rgba(255,255,255,1))
          `,
        }}
      />
    </div>
  );
}
