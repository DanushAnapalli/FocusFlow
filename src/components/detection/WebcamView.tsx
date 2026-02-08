"use client";

import { useRef, useEffect, useState } from "react";
import type Human from "@vladmandic/human";
import type { DetectionResult } from "@/lib/detection-types";

type RGB = [number, number, number];

/**
 * Get the target RGB color for a given focus score and calibration state.
 * Returns raw numeric tuples for cross-frame lerping.
 *
 * Color mapping (focused = green, distracted = red):
 *   0-30:  red (very distracted - head turned away)
 *   30-50: red -> orange (moderately distracted)
 *   50-65: orange -> yellow (slightly distracted)
 *   65-80: yellow -> green (mostly focused)
 *   80-100: pure green (focused - looking at screen)
 */
function getTargetRGB(score: number, isCalibrated: boolean): RGB {
  if (!isCalibrated) return [100, 80, 220]; // blue-purple (calibration)

  if (score < 30) return [239, 68, 68]; // red-500

  if (score < 50) {
    const t = (score - 30) / 20;
    return lerpRGB([239, 68, 68], [249, 115, 22], t); // red -> orange
  }

  if (score < 65) {
    const t = (score - 50) / 15;
    return lerpRGB([249, 115, 22], [234, 179, 8], t); // orange -> yellow
  }

  if (score < 80) {
    const t = (score - 65) / 15;
    return lerpRGB([234, 179, 8], [34, 197, 94], t); // yellow -> green
  }

  return [34, 197, 94]; // pure green-500 for score >= 80
}

/**
 * Linearly interpolate between two RGB colors.
 */
function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/**
 * Calculate dynamic colors based on focus score and calibration state.
 * Returns { primary: string, secondary: string } for mesh and label colors.
 *
 * Color scheme (matches getTargetRGB):
 * - Blue-purple during calibration
 * - Red (< 30) - very distracted
 * - Orange (30-50) - moderately distracted
 * - Yellow (50-65) - slightly distracted
 * - Green (65-80) - transition to focused
 * - Pure green (80+) - focused, looking at screen
 */
function getFocusColors(score: number, isCalibrated: boolean): { primary: string; secondary: string } {
  // During calibration, use blue-purple
  if (!isCalibrated) {
    return {
      primary: 'rgba(100, 80, 220, 0.8)',
      secondary: 'rgba(140, 120, 255, 0.9)',
    };
  }

  // Below 30: Red (very distracted)
  if (score < 30) {
    return {
      primary: 'rgba(220, 38, 38, 0.8)',
      secondary: 'rgba(252, 165, 165, 0.9)',
    };
  }

  // 30-50: Red to orange
  if (score < 50) {
    const t = (score - 30) / 20;
    return {
      primary: interpolateColor([239, 68, 68], [249, 115, 22], t, 0.8),
      secondary: interpolateColor([252, 165, 165], [253, 186, 116], t, 0.9),
    };
  }

  // 50-65: Orange to yellow
  if (score < 65) {
    const t = (score - 50) / 15;
    return {
      primary: interpolateColor([249, 115, 22], [234, 179, 8], t, 0.8),
      secondary: interpolateColor([253, 186, 116], [253, 224, 71], t, 0.9),
    };
  }

  // 65-80: Yellow to green
  if (score < 80) {
    const t = (score - 65) / 15;
    return {
      primary: interpolateColor([234, 179, 8], [34, 197, 94], t, 0.8),
      secondary: interpolateColor([253, 224, 71], [134, 239, 172], t, 0.9),
    };
  }

  // 80+: Pure green (focused)
  return {
    primary: 'rgba(34, 197, 94, 0.8)',
    secondary: 'rgba(134, 239, 172, 0.9)',
  };
}

/**
 * Interpolate between two RGB colors.
 */
function interpolateColor(
  rgb1: [number, number, number],
  rgb2: [number, number, number],
  t: number,
  alpha: number
): string {
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface WebcamViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  result: DetectionResult | null;
  humanRef: React.RefObject<Human | null>;
  isLoading: boolean;
  loadingMessage: string;
  fps: number;
  focusScore: number; // Display score (3-second averaged)
  alignmentScore: number; // Real-time alignment score for mesh colors
  instantScore: number; // Real-time instant score for color changes
  isCalibrated: boolean;
}

/**
 * Video element with canvas overlay for detection visualization.
 * Uses human.draw.all() for face mesh/bounding box overlay plus
 * custom text overlay for head pose and gaze metrics.
 */
export default function WebcamView({
  videoRef,
  result,
  humanRef,
  isLoading,
  loadingMessage,
  fps,
  focusScore,
  alignmentScore,
  instantScore,
  isCalibrated,
}: WebcamViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentColorRef = useRef<RGB>([100, 80, 220]); // Start blue-purple (calibration)
  const [showVideo, setShowVideo] = useState(true);

  // Draw detection overlay whenever result changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const human = humanRef.current;

    if (!canvas || !human || !result) return;

    const video = videoRef.current;
    if (!video) return;

    const drawOverlay = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Sync canvas size with video display size for pixel-perfect alignment
      const displayWidth = video.clientWidth;
      const displayHeight = video.clientHeight;

      // Use devicePixelRatio for crisp rendering
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        ctx.scale(dpr, dpr);
      }

      // Clear previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mirrored to match the -scale-x-100 on the video
      ctx.save();
      ctx.translate(displayWidth, 0);
      ctx.scale(-1, 1);

      // Cross-frame color lerping for responsive transitions
      // Use instantScore for immediate visual feedback on gaze direction
      const targetRGB = getTargetRGB(instantScore, isCalibrated);

      const cur = currentColorRef.current;
      const lerpFactor = 0.4; // Fast response for live feel
      currentColorRef.current = [
        cur[0] + (targetRGB[0] - cur[0]) * lerpFactor,
        cur[1] + (targetRGB[1] - cur[1]) * lerpFactor,
        cur[2] + (targetRGB[2] - cur[2]) * lerpFactor,
      ];
      const [lr, lg, lb] = currentColorRef.current.map(Math.round);
      const lerpedPrimary = `rgba(${lr}, ${lg}, ${lb}, 0.8)`;
      const lerpedSecondary = `rgba(${Math.min(lr + 40, 255)}, ${Math.min(lg + 40, 255)}, ${Math.min(lb + 40, 255)}, 0.9)`;

      // Set dynamic colors based on lerped values
      if (human.draw) {
        const newOptions = {
          color: lerpedPrimary,
          labelColor: lerpedSecondary,
          lineWidth: 2,
          drawPoints: true,
          drawPolygons: true,
          drawBoxes: false,
          fillPolygons: false,
          useDepth: false,
          useCurves: true,
          drawLabels: !isCalibrated,
          font: 'small-caps 13px "Segoe UI"',
        };

        Object.assign(human.draw.options, newOptions);
      }

      // Use Human.js draw API for bounding boxes, face mesh, gaze arrows
      try {
        // Build a result object compatible with human.draw.all()
        // IMPORTANT: Use display size, not video size, for proper alignment
        const drawResult = {
          face: (result.faces || []).map((face) => ({
            ...face,
            rotation: face.rotation
              ? {
                  angle: face.rotation.angle,
                  matrix: face.rotation.matrix,
                  gaze: face.rotation.gaze,
                }
              : undefined,
          })),
          body: [],
          hand: [],
          gesture: [],
          object: [],
          persons: [],
          performance: result.performance,
          timestamp: result.timestamp,
          width: displayWidth,
          height: displayHeight,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await human.draw.all(canvas, drawResult as any);
      } catch {
        // Fallback: draw basic bounding box
        const face = result.faces[0];
        if (face) {
          const scaleX = displayWidth / (video.videoWidth || 640);
          const scaleY = displayHeight / (video.videoHeight || 480);
          const [x, y, w, h] = face.box;
          ctx.strokeStyle = lerpedPrimary;
          ctx.lineWidth = 2;
          ctx.strokeRect(x * scaleX, y * scaleY, w * scaleX, h * scaleY);
        }
      }

      ctx.restore();

      // Draw custom text overlay only during calibration (not mirrored)
      if (!isCalibrated) {
        drawMetricsOverlay(ctx, result, fps);
      }
    };

    drawOverlay();
  }, [result, humanRef, videoRef, fps, instantScore, isCalibrated]);

  // Calculate colors for data attributes (for testing)
  const currentColors = getFocusColors(focusScore, isCalibrated);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-warmBorder bg-warmSurface shadow-2xl"
      data-testid="webcam-view"
      data-focus-score={focusScore}
      data-is-calibrated={isCalibrated}
      data-mesh-color={currentColors.primary}
    >
      {/* Video feed -- always in DOM for detection, visibility toggled */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`block w-full max-w-[640px] -scale-x-100 ${
          showVideo ? "" : "invisible"
        }`}
        style={{ aspectRatio: '4/3', minHeight: '360px' }}
      />

      {/* Canvas overlay for detection drawings */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
      />

      {/* Color indicator for debugging */}
      <div className="absolute left-2 top-2 z-10 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm">
        <div
          className="h-4 w-4 rounded-full border-2 border-white/50"
          style={{ backgroundColor: currentColors.primary.replace('0.8', '1') }}
          title={`Mesh Color: ${currentColors.primary}`}
        />
        <span className="text-xs font-mono text-white">
          {isCalibrated ? `${Math.round(focusScore)}` : 'CAL'}
        </span>
      </div>

      {/* Toggle video feed visibility */}
      <button
        onClick={() => setShowVideo((prev) => !prev)}
        className="absolute right-2 top-2 z-10 rounded-lg bg-warmSurface/80 px-2.5 py-1.5 text-xs font-medium text-warmBrown backdrop-blur-sm transition-colors hover:bg-warmBorder/80 hover:text-warmBrown"
        aria-label={showVideo ? "Hide video feed" : "Show video feed"}
      >
        {showVideo ? "Hide Video" : "Show Video"}
      </button>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-warmBorder border-t-warmCoral" />
          <p className="text-sm font-medium text-white">{loadingMessage}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Draw head pose, gaze, and confidence text overlay on the canvas.
 * Positioned in the top-left corner with a semi-transparent background.
 */
function drawMetricsOverlay(
  ctx: CanvasRenderingContext2D,
  result: DetectionResult,
  fps: number
) {
  const face = result.faces[0];
  if (!face) return;

  const lines: string[] = [];

  if (face.rotation) {
    const { yaw, pitch, roll } = face.rotation.angle;
    const yawDeg = Math.round((yaw * 180) / Math.PI);
    const pitchDeg = Math.round((pitch * 180) / Math.PI);
    const rollDeg = Math.round((roll * 180) / Math.PI);
    lines.push(`Yaw: ${yawDeg}\u00B0  Pitch: ${pitchDeg}\u00B0  Roll: ${rollDeg}\u00B0`);

    const bearingDeg = Math.round((face.rotation.gaze.bearing * 180) / Math.PI);
    const strengthPct = Math.round(face.rotation.gaze.strength * 100);
    lines.push(`Gaze: ${bearingDeg}\u00B0 (${strengthPct}%)`);
  }

  lines.push(`Face: ${Math.round((face.score ?? 0) * 100)}%`);
  lines.push(`FPS: ${fps}`);

  // Background panel
  const lineHeight = 18;
  const padding = 8;
  const panelHeight = lines.length * lineHeight + padding * 2;
  const panelWidth = 280;

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(6, 6, panelWidth, panelHeight);

  // Text
  ctx.fillStyle = "rgba(0, 255, 128, 0.9)";
  ctx.font = "13px monospace";

  lines.forEach((line, i) => {
    ctx.fillText(line, 6 + padding, 6 + padding + (i + 1) * lineHeight - 4);
  });
}
