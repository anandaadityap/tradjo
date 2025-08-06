"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import { TradeWithPlan, TradeStatus, TradeType } from "@/lib/types";

interface TradesTableProps {
  trades: TradeWithPlan[];
  onEditTrade?: (trade: TradeWithPlan) => void;
  onDeleteTrade?: (tradeId: string) => void;
  onCloseTrade?: (trade: TradeWithPlan) => void;
}

export function TradesTable({
  trades,
  onEditTrade,
  onDeleteTrade,
  onCloseTrade,
}: TradesTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getStatusBadge = (status: TradeStatus) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, icon: Clock, label: "Pending" },
      OPEN: { variant: "default" as const, icon: TrendingUp, label: "Open" },
      CLOSED: {
        variant: "outline" as const,
        icon: CheckCircle,
        label: "Closed",
      },
      CANCELLED: {
        variant: "destructive" as const,
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant}
        className="flex items-center gap-1"
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: TradeType) => {
    return (
      <Badge
        variant={type === "BUY" ? "default" : "secondary"}
        className={
          type === "BUY"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-red-100 text-red-800 hover:bg-red-200"
        }
      >
        {type === "BUY" ? (
          <TrendingUp className="h-3 w-3 mr-1" />
        ) : (
          <TrendingDown className="h-3 w-3 mr-1" />
        )}
        {type}
      </Badge>
    );
  };

  const getPnLDisplay = (pnl: number | null) => {
    if (pnl === null) return <span className="text-muted-foreground">-</span>;

    return (
      <span
        className={
          pnl >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"
        }
      >
        {formatCurrency(pnl)}
      </span>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>P&L</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-8 text-muted-foreground"
              >
                No trades found. Start by adding your first trade!
              </TableCell>
            </TableRow>
          ) : (
            trades.map((trade) => (
              <TableRow
                key={trade.id}
                className="hover:bg-muted/50"
              >
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>{getTypeBadge(trade.type)}</TableCell>
                <TableCell>{getStatusBadge(trade.status)}</TableCell>
                <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                <TableCell>
                  {trade.exitPrice ? (
                    formatCurrency(trade.exitPrice)
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>{formatCurrency(trade.riskAmount)}</TableCell>
                <TableCell>{getPnLDisplay(trade.pnl)}</TableCell>
                <TableCell>{formatDateTime(trade.entryTime)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {trade.status === "OPEN" && onCloseTrade && (
                        <DropdownMenuItem
                          onClick={() => {
                            console.log("Closing trade:", trade);
                            onCloseTrade(trade);
                          }}
                          className="text-green-600"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Close Trade
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEditTrade?.(trade)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteTrade?.(trade.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
