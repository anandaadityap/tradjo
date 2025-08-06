"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradingStats } from "@/components/trading-stats";
import { TradesTable } from "@/components/trades-table";
import { AddTradeForm } from "@/components/add-trade-form";
import { EditTradeForm } from "@/components/edit-trade-form";
import { AddTradingPlanForm } from "@/components/add-trading-plan-form";
import { TradingPlanCard } from "@/components/trading-plan-card";
import { CloseTradeDialog } from "@/components/close-trade-dialog";
import { CapitalManagement } from "@/components/capital-management";
import { BarChart3, TrendingUp, Target } from "lucide-react";
import {
  TradeWithPlan,
  TradingPlanWithTrades,
  CreateTradeInput,
  UpdateTradeInput,
  CreateTradingPlanInput,
  TradeStats as TradeStatsType,
  TradeStatus,
} from "@/lib/types";
import {
  fetchTradingPlans,
  createTradingPlanAPI,
  fetchTrades,
  createTradeAPI,
  deleteTradeAPI,
  updateTradeAPI,
  closeTradeAPI,
  fetchStats,
} from "@/lib/api-client";

// Mock data untuk demo
const mockTradingPlans: TradingPlanWithTrades[] = [
  {
    id: "1",
    name: "Conservative Strategy",
    description: "Low risk, steady gains with 1:2 risk-reward ratio",
    riskRewardRatio: 2.0,
    maxLossAmount: 2.0,
    initialCapital: 1000.0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    trades: [],
  },
  {
    id: "2",
    name: "Aggressive Growth",
    description: "Higher risk for potentially higher returns",
    riskRewardRatio: 3.0,
    maxLossAmount: 5.0,
    initialCapital: 2000.0,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    trades: [],
  },
];

const mockTrades: TradeWithPlan[] = [
  {
    id: "1",
    symbol: "EURUSD",
    type: "BUY",
    status: "CLOSED" as TradeStatus,
    entryPrice: 1.085,
    entryTime: new Date("2024-01-15T10:30:00"),
    quantity: 10000,
    exitPrice: 1.089,
    exitTime: new Date("2024-01-15T14:20:00"),
    stopLoss: 1.083,
    takeProfit: 1.089,
    riskAmount: 20,
    rewardAmount: 40,
    pnl: 40,
    pnlPercentage: 0.37,
    notes: "Clean breakout above resistance",
    screenshot: null,
    tags: ["breakout", "trend"],
    createdAt: new Date(),
    updatedAt: new Date(),
    tradingPlanId: "1",
    tradingPlan: mockTradingPlans[0],
  },
  {
    id: "2",
    symbol: "GBPUSD",
    type: "SELL",
    status: "CLOSED" as TradeStatus,
    entryPrice: 1.265,
    entryTime: new Date("2024-01-16T08:15:00"),
    quantity: 5000,
    exitPrice: 1.267,
    exitTime: new Date("2024-01-16T11:45:00"),
    stopLoss: 1.267,
    takeProfit: 1.261,
    riskAmount: 10,
    rewardAmount: 20,
    pnl: -10,
    pnlPercentage: -0.16,
    notes: "False breakdown, stopped out",
    screenshot: null,
    tags: ["breakdown", "failed"],
    createdAt: new Date(),
    updatedAt: new Date(),
    tradingPlanId: "1",
    tradingPlan: mockTradingPlans[0],
  },
  {
    id: "3",
    symbol: "BTCUSD",
    type: "BUY",
    status: "OPEN" as TradeStatus,
    entryPrice: 42500,
    entryTime: new Date("2024-01-17T09:00:00"),
    quantity: 0.1,
    exitPrice: null,
    exitTime: null,
    stopLoss: 41500,
    takeProfit: 44500,
    riskAmount: 100,
    rewardAmount: 200,
    pnl: null,
    pnlPercentage: null,
    notes: "Support level hold, expecting bounce",
    screenshot: null,
    tags: ["support", "crypto"],
    createdAt: new Date(),
    updatedAt: new Date(),
    tradingPlanId: "1",
    tradingPlan: mockTradingPlans[0],
  },
  {
    id: "4",
    symbol: "USDJPY",
    type: "SELL",
    status: "OPEN" as TradeStatus,
    entryPrice: 150.25,
    entryTime: new Date("2024-01-18T14:30:00"),
    quantity: 10000,
    exitPrice: null,
    exitTime: null,
    stopLoss: 151.25,
    takeProfit: 148.25,
    riskAmount: 100,
    rewardAmount: 200,
    pnl: null,
    pnlPercentage: null,
    notes: "Resistance rejection, expecting downward move",
    screenshot: null,
    tags: ["resistance", "reversal"],
    createdAt: new Date(),
    updatedAt: new Date(),
    tradingPlanId: "1",
    tradingPlan: mockTradingPlans[0],
  },
];

export default function Home() {
  const [trades, setTrades] = useState<TradeWithPlan[]>([]);
  const [tradingPlans, setTradingPlans] = useState<TradingPlanWithTrades[]>([]);
  const [stats, setStats] = useState<TradeStatsType>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalPnL: 0,
    averageWin: 0,
    averageLoss: 0,
    profitFactor: 0,
    maxDrawdown: 0,
    initialCapital: 1000,
    currentCapital: 1000,
    totalReturn: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<string>("");

  // Close Trade Dialog State
  const [closeTradeDialog, setCloseTradeDialog] = useState<{
    open: boolean;
    trade: TradeWithPlan | null;
  }>({
    open: false,
    trade: null,
  });

  // Edit Trade Dialog State
  const [editTradeDialog, setEditTradeDialog] = useState<{
    open: boolean;
    trade: TradeWithPlan | null;
  }>({
    open: false,
    trade: null,
  });

  // Load trading plans from database
  const loadTradingPlans = async () => {
    try {
      setLoading(true);
      const [plans, allTrades] = await Promise.all([
        fetchTradingPlans(),
        fetchTrades(),
      ]);

      setTradingPlans(plans);
      setTrades(allTrades);

      // Set first active plan or first plan as active
      const activePlanFromDb = plans.find((plan) => plan.isActive);
      if (activePlanFromDb) {
        setActivePlan(activePlanFromDb.id);
      } else if (plans.length > 0) {
        setActivePlan(plans[0].id);
      }
    } catch (error) {
      console.error("Error loading trading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load stats for active plan
  const loadStats = async () => {
    if (!activePlan) return;

    try {
      const newStats = await fetchStats(activePlan);
      setStats(newStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    loadTradingPlans();
  }, []);

  useEffect(() => {
    loadStats();
  }, [activePlan]);

  const activeTradingPlan = tradingPlans.find((plan) => plan.id === activePlan);
  const allTrades = tradingPlans.flatMap((plan) => plan.trades || []);

  const handleAddTrade = async (tradeInput: CreateTradeInput) => {
    try {
      const newTrade = await createTradeAPI(tradeInput);
      setTrades((prev) => [newTrade, ...prev]);
      // Reload stats after adding trade
      loadStats();
      console.log("Trade berhasil ditambahkan:", newTrade.symbol);
    } catch (error) {
      console.error("Error adding trade:", error);
      // You can add a toast notification here in the future
    }
  };

  const handleEditTrade = (trade: TradeWithPlan) => {
    setEditTradeDialog({
      open: true,
      trade,
    });
  };

  const handleDeleteTrade = async (tradeId: string) => {
    try {
      await deleteTradeAPI(tradeId);
      setTrades((prev) => prev.filter((trade) => trade.id !== tradeId));
      // Reload stats after deleting trade
      loadStats();
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const handleCloseTrade = (trade: TradeWithPlan) => {
    setCloseTradeDialog({
      open: true,
      trade,
    });
  };

  const handleAddTradingPlan = async (planInput: CreateTradingPlanInput) => {
    try {
      const newPlan = await createTradingPlanAPI(planInput);
      const newPlanWithTrades: TradingPlanWithTrades = {
        ...newPlan,
        trades: newPlan.trades || [],
      };
      setTradingPlans((prev) => [...prev, newPlanWithTrades]);

      // Set as active plan if it's the first one
      if (tradingPlans.length === 0) {
        setActivePlan(newPlan.id);
      }
    } catch (error) {
      console.error("Error adding trading plan:", error);
    }
  };

  const handleEditTradeSubmit = async (
    tradeId: string,
    updateData: Omit<UpdateTradeInput, 'id'>
  ) => {
    try {
      const updatedTrade = await updateTradeAPI({ id: tradeId, ...updateData });
      setTrades((prev) =>
        prev.map((trade) => (trade.id === tradeId ? updatedTrade : trade))
      );
      // Reload stats after updating trade
      loadStats();

      // Close the dialog
      setEditTradeDialog({ open: false, trade: null });
    } catch (error) {
      console.error("Error updating trade:", error);
    }
  };

  const handleCloseTradeSubmit = async (
    tradeId: string,
    exitPrice: number,
    exitTime?: Date
  ) => {
    try {
      const updatedTrade = await closeTradeAPI(
        tradeId,
        exitPrice,
        exitTime || new Date()
      );
      setTrades((prev) =>
        prev.map((trade) => (trade.id === tradeId ? updatedTrade : trade))
      );
      // Reload stats after closing trade
      loadStats();

      // Close the dialog
      setCloseTradeDialog({ open: false, trade: null });
    } catch (error) {
      console.error("Error closing trade:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Tradjo</h1>
          </div>
          <p className="text-gray-600">
            Track your trades, analyze performance, and improve your trading
            strategy
          </p>
        </div>

        <Tabs
          defaultValue="dashboard"
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="capital">Capital</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent
            value="dashboard"
            className="space-y-6"
          >
            <TradingStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Trades</CardTitle>
                      <CardDescription>
                        Your latest trading activity
                      </CardDescription>
                    </div>
                    <AddTradeForm
                      tradingPlans={tradingPlans}
                      onAddTrade={handleAddTrade}
                    />
                  </CardHeader>
                  <CardContent>
                    <TradesTable
                      trades={trades
                        .filter((trade) => trade.tradingPlanId === activePlan)
                        .slice(0, 5)}
                      onEditTrade={handleEditTrade}
                      onDeleteTrade={handleDeleteTrade}
                      onCloseTrade={handleCloseTrade}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Active Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeTradingPlan ? (
                      <TradingPlanCard plan={activeTradingPlan} />
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No active trading plan
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Trades Tab */}
          <TabsContent
            value="trades"
            className="space-y-6"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Trades</CardTitle>
                  <CardDescription>
                    Complete history of your trades
                  </CardDescription>
                </div>
                <AddTradeForm
                  tradingPlans={tradingPlans}
                  onAddTrade={handleAddTrade}
                />
              </CardHeader>
              <CardContent>
                <TradesTable
                  trades={trades}
                  onEditTrade={handleEditTrade}
                  onDeleteTrade={handleDeleteTrade}
                  onCloseTrade={handleCloseTrade}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent
            value="plans"
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Trading Plans</h2>
                <p className="text-muted-foreground">
                  Manage your trading strategies
                </p>
              </div>
              <AddTradingPlanForm onAddPlan={handleAddTradingPlan} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tradingPlans.map((plan) => (
                <TradingPlanCard
                  key={plan.id}
                  plan={plan}
                />
              ))}
            </div>
          </TabsContent>

          {/* Capital Tab */}
          <TabsContent
            value="capital"
            className="space-y-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Capital Management</h2>
              <p className="text-muted-foreground">Kelola modal trading Anda</p>
            </div>

            {activeTradingPlan ? (
              <CapitalManagement
                tradingPlanId={activeTradingPlan.id}
                initialCapital={activeTradingPlan.initialCapital}
                totalCapitalAdded={0} // Will be calculated from API
                currentCapital={stats.currentCapital}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    Pilih trading plan aktif untuk mengelola modal
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent
            value="analytics"
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Detailed analysis of your trading performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TradingStats stats={stats} />
                <div className="mt-6 text-center text-muted-foreground">
                  <p>Advanced analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Close Trade Dialog */}
        <CloseTradeDialog
          trade={closeTradeDialog.trade}
          open={closeTradeDialog.open}
          onOpenChange={(open) =>
            setCloseTradeDialog((prev) => ({ ...prev, open }))
          }
          onCloseTrade={handleCloseTradeSubmit}
        />

        {/* Edit Trade Dialog */}
        <EditTradeForm
          trade={editTradeDialog.trade}
          open={editTradeDialog.open}
          onOpenChange={(open) =>
            setEditTradeDialog((prev) => ({ ...prev, open }))
          }
          tradingPlans={tradingPlans}
          onEditTrade={handleEditTradeSubmit}
        />
      </div>
    </div>
  );
}
