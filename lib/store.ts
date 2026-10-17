// In-memory store for fallback when MongoDB is not connected
export interface Milestone {
  id: string;
  title: string;
  hours: number;
  cost: number;
  deliverables: string[];
}

export interface PaymentPhase {
  phase: string;
  percentage: number;
  amount: number;
  timing: string;
}

export interface ProposalDocument {
  _id?: string;
  freelancerName?: string;
  clientName: string;
  projectTitle: string;
  currency: string;
  hourlyRate: number;
  rawNotes: string;
  totalEstimatedHours: number;
  totalBudget: number;
  milestones: Milestone[];
  inScope: string[];
  outOfScope: string[];
  changeOrderPolicy: string;
  paymentSchedule: PaymentPhase[];
  status: "draft" | "sent" | "accepted";
  createdAt: string | Date;
  acceptedAt?: string | Date | null;
  updatedAt?: string | Date;
}

const memoryStore = new Map<string, ProposalDocument>();

export function getMemoryStore() {
  return memoryStore;
}
