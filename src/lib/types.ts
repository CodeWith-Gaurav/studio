export type DetectionResultType = "Early Blight" | "Late Blight" | "Healthy";
export type SimulatedDetectionResult = DetectionResultType | null;

export interface AiSummary {
  diseaseName?: string;
  summary?: string;
  preventativeMeasures?: string;
}
