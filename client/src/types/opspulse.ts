export type AlertType = "crisis" | "opportunity" | "anomaly";

export interface OpsAlert {
  id: string;
  at: string;
  type: AlertType;
  title: string;
  message: string;
  severity: number;
  recommended_action: string;
  impact: string;
}

export interface SalesState {
  revenue_per_hour: number;
  orders_per_hour: number;
  conversion_rate: number;
  avg_order_value: number;
  refund_rate: number;
  cash_reserve: number;
}

export interface InventorySku {
  sku: string;
  stock: number;
  reorder_point: number;
  velocity_per_hour: number;
  warehouse: string;
  delayed: boolean;
}

export interface InventoryState {
  fulfillment_minutes: number;
  bottleneck: string;
  skus: InventorySku[];
  incoming_shipments: Array<{
    id: string;
    status: string;
    eta: string;
    item: string;
  }>;
}

export interface SupportState {
  open_tickets: number;
  ticket_volume_per_hour: number;
  sentiment_score: number;
  resolution_minutes: number;
  active_agents: number;
  total_agents: number;
  categories: Array<{
    label: string;
    tickets: number;
    response_minutes: number;
  }>;
  live_tickets: Array<{
    id: string;
    customer: string;
    sentiment: "negative" | "neutral" | "positive";
    status: "active" | "escalated" | "resolved";
    message: string;
    eta_minutes: number;
  }>;
}

export interface OpsState {
  timestamp: string;
  role: "Strategic" | "Tactical";
  sales: SalesState;
  inventory: InventoryState;
  support: SupportState;
  stress_score: number;
  stress_breakdown: Record<string, number>;
  alerts: OpsAlert[];
  events: Array<{
    id: string;
    time: string;
    type: AlertType;
    message: string;
    title: string;
    impact: string;
    recommendedAction: string;
  }>;
  root_causes: Array<{
    origin: string;
    impact: string;
    financial_effect: string;
  }>;
  predictions: Array<{
    horizon_hours: number;
    predicted_stress: number;
    explanation: string;
  }>;
  chart_data: Array<{
    time: string;
    health: number;
    predicted: number | null;
  }>;
  recommendations: {
    playbooks: Array<{
      id: string;
      title: string;
      risk: string;
      action: string;
      estimated_cost: string;
      urgency: string;
    }>;
  };
  strategic_metrics: {
    net_profit: number;
    runway_days: number;
    ltv: number;
    elasticity_score: number;
  };
  tactical_metrics: {
    fulfillment_speed_minutes: number;
    sku_velocity: number;
    ticket_resolution_minutes: number;
    warehouse_bottleneck: string;
  };
  war_room_active: boolean;
}
