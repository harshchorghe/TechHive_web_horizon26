export type UserRole = "beginner" | "crm-expert" | "analytics" | "data-analytics";

export type OpsMode = "Strategic" | "Tactical";

export const USER_ROLE_META: Record<
  UserRole,
  {
    label: string;
    shortLabel: string;
    description: string;
    details: string;
    accent: string;
  }
> = {
  beginner: {
    label: "Beginner Operator",
    shortLabel: "Beginner",
    description: "Simple guided dashboard with fewer controls.",
    details: "See the essentials only. Great for new team members who are still learning CRM tools.",
    accent: "emerald",
  },
  "crm-expert": {
    label: "CRM Expert",
    shortLabel: "CRM Expert",
    description: "Full operational console for power users.",
    details: "Advanced workflows, integrations, and complete module access.",
    accent: "blue",
  },
  analytics: {
    label: "Analytics Lead",
    shortLabel: "Analytics",
    description: "Insights-heavy view focused on trends and strategy.",
    details: "Prioritizes reports, forecasts, and AI-backed decision support.",
    accent: "amber",
  },
  "data-analytics": {
    label: "Data Analytics Specialist",
    shortLabel: "Data Analyst",
    description: "Deep data modules with prediction and model context.",
    details: "Built for analysts who need dense telemetry and forecasting detail.",
    accent: "cyan",
  },
};

export const ROLE_ALLOWED_PATHS: Record<UserRole, string[]> = {
  beginner: ["/dashboard", "/sales", "/support"],
  "crm-expert": [
    "/dashboard",
    "/sales",
    "/inventory",
    "/support",
    "/reports",
    "/ai-analytics",
    "/integrations",
  ],
  analytics: ["/dashboard", "/reports", "/ai-analytics", "/sales"],
  "data-analytics": ["/dashboard", "/reports", "/ai-analytics", "/inventory", "/support"],
};

export const ALL_USER_ROLES = Object.keys(USER_ROLE_META) as UserRole[];
