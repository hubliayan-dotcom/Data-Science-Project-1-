/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PollResponse {
  respondent_id: number;
  timestamp: string;
  age_group: string;
  gender: string;
  region: string;
  preferred_tool: string;
  satisfaction: number;
  feedback: string;
}

export interface AnalyticsSummary {
  totalResponses: number;
  avgSatisfaction: number;
  topTool: string;
  regionsCount: number;
}
