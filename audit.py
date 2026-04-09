import csv
import json
from datetime import datetime, timedelta, date as dt_date
from collections import defaultdict
import statistics

trades = []
with open("/Users/billkim/polymarket-mm/snapshots/harvest_position_ledger.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        trades.append(row)

week_trades = []
for t in trades:
    cd = t["close_date_cdt"].strip()
    if cd >= "2026-04-01" and cd <= "2026-04-06":
        week_trades.append(t)

print("=" * 70)
print("POLYMARKET BOT PERFORMANCE AUDIT: April 1-6, 2026")
print("=" * 70)
print()

def classify_market(question):
    q = question.lower()
    if "bitcoin" in q or "ethereum" in q or "btc" in q or "eth" in q:
        if "dip" in q:
            return "crypto_dip"
        elif "reach" in q or "above" in q:
            return "crypto_reach"
        else:
            return "crypto_other"
    elif "temperature" in q or "weather" in q:
        return "weather"
    elif "apple" in q or "aapl" in q:
        return "stock"
    else:
        return "other"

def parse_dt(s):
    s = s.strip().replace(" CDT", "").replace(" CST", "")
    for fmt in ["%Y-%m-%d %I:%M:%S %p", "%Y-%m-%d %H:%M:%S"]:
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            continue
    return None

daily_pnl = defaultdict(float)
daily_trades = defaultdict(list)
market_stats = defaultdict(lambda: {"wins": 0, "losses": 0, "profit": 0.0, "edges": [], "hold_hours": [], "costs": []})
all_edges = []
all_hold_hours = []
all_costs = []
all_profits = []
max_single_cost = 0
max_single_name = ""

print("COMPLETED TRADES THIS WEEK")
print("-" * 70)

for i, t in enumerate(week_trades):
    question = t["question"]
    entry_price = float(t["entry_price"])
    shares = float(t["shares"])
    cost = float(t["cost"])
    payout = float(t["payout"])
    realized_profit = float(t["realized_profit"])
    result = t["result"]
    exit_reason = t["exit_reason"]
    close_date = t["close_date_cdt"].strip()

    exit_price = payout / shares if shares > 0 else 0
    edge_at_entry = 1.00 - entry_price
    mtype = classify_market(question)

    entered = parse_dt(t["entered_at_cdt"])
    closed = parse_dt(t["closed_at_cdt"])
    hold_hours = 0
    if entered and closed:
        hold_hours = (closed - entered).total_seconds() / 3600

    short_q = question[:58]
    print("Trade #%d: %s" % (i+1, short_q))
    print("  Type: %s | Result: %s | Exit: %s" % (mtype, result, exit_reason))
    print("  Entry: $%.3f | Exit: $%.4f | Edge: %.1f%%" % (entry_price, exit_price, edge_at_entry*100))
    print("  Cost: $%.2f | Payout: $%.2f | Profit: $%.4f" % (cost, payout, realized_profit))
    print("  Hold: %.1f hours" % hold_hours)
    print()

    daily_pnl[close_date] += realized_profit
    daily_trades[close_date].append(t)

    ms = market_stats[mtype]
    if result == "win":
        ms["wins"] += 1
    else:
        ms["losses"] += 1
    ms["profit"] += realized_profit
    ms["edges"].append(edge_at_entry)
    ms["hold_hours"].append(hold_hours)
    ms["costs"].append(cost)

    all_edges.append(edge_at_entry)
    all_hold_hours.append(hold_hours)
    all_costs.append(cost)
    all_profits.append(realized_profit)

    if cost > max_single_cost:
        max_single_cost = cost
        max_single_name = question

print()
print("DAILY P&L BREAKDOWN (by close_date_cdt)")
print("-" * 70)
total_week_profit = 0
for date_key in sorted(daily_pnl.keys()):
    n = len(daily_trades[date_key])
    profit = daily_pnl[date_key]
    total_week_profit += profit
    print("  %s: $%+.4f  (%d trades closed)" % (date_key, profit, n))
print("       TOTAL: $%+.4f" % total_week_profit)
print()

print("WIN/LOSS RATE BY MARKET TYPE")
print("-" * 70)
for mtype in sorted(market_stats.keys()):
    ms = market_stats[mtype]
    total = ms["wins"] + ms["losses"]
    wr = (ms["wins"] / total * 100) if total > 0 else 0
    avg_e = sum(ms["edges"]) / len(ms["edges"]) * 100 if ms["edges"] else 0
    avg_h = sum(ms["hold_hours"]) / len(ms["hold_hours"]) if ms["hold_hours"] else 0
    avg_c = sum(ms["costs"]) / len(ms["costs"]) if ms["costs"] else 0
    print("  %-15s: %dW / %dL  (%d%% win)  Profit: $%+.2f  AvgEdge: %.1f%%  AvgHold: %.1fh  AvgSize: $%.2f" % (mtype, ms["wins"], ms["losses"], wr, ms["profit"], avg_e, avg_h, avg_c))
print()

print("AGGREGATE STATISTICS")
print("-" * 70)
n = len(week_trades)
wins = sum(1 for t in week_trades if t["result"] == "win")
losses = n - wins
if n > 0:
    print("  Total trades closed: %d" % n)
    print("  Wins: %d  Losses: %d  Win rate: %.1f%%" % (wins, losses, wins/n*100))
    print("  Total realized profit: $%.4f" % total_week_profit)
    avg_edge = sum(all_edges)/len(all_edges)*100
    avg_hold = sum(all_hold_hours)/len(all_hold_hours)
    avg_profit = sum(all_profits)/len(all_profits)
    print("  Average edge at entry: %.2f%%" % avg_edge)
    print("  Average hold time: %.1f hours" % avg_hold)
    print("  Average profit per trade: $%.4f" % avg_profit)
    sorted_p = sorted(all_profits)
    print("  Median profit: $%.4f" % sorted_p[len(sorted_p)//2])
    print("  Min profit: $%.4f  Max profit: $%.4f" % (min(all_profits), max(all_profits)))
print()

print("EXPOSURE ANALYSIS")
print("-" * 70)
total_cost = sum(all_costs)
avg_cost = total_cost / len(all_costs) if all_costs else 0
print("  Total capital deployed (sum of costs): $%.2f" % total_cost)
print("  Average position size: $%.2f" % avg_cost)
print("  Largest single position: $%.2f" % max_single_cost)
print("    Market: %s" % max_single_name[:65])

dates_in_week = []
d = dt_date(2026, 4, 1)
while d <= dt_date(2026, 4, 6):
    dates_in_week.append(d)
    d += timedelta(days=1)

print("  Daily exposure (capital at risk):")
daily_exp_vals = []
for dd in dates_in_week:
    exp = 0
    for t in week_trades:
        entered = parse_dt(t["entered_at_cdt"])
        closed = parse_dt(t["closed_at_cdt"])
        if entered and closed:
            if entered.date() <= dd <= closed.date():
                exp += float(t["cost"])
    daily_exp_vals.append(exp)
    print("    %s: $%.2f" % (dd.isoformat(), exp))
avg_daily_exp = sum(daily_exp_vals) / len(daily_exp_vals) if daily_exp_vals else 0
print("  Average daily exposure: $%.2f" % avg_daily_exp)
if avg_daily_exp > 0:
    print("  Return on avg exposure: %.2f%%" % (total_week_profit / avg_daily_exp * 100))
print()

print("RISK METRICS")
print("-" * 70)
print("  Largest single position: $%.2f (%s)" % (max_single_cost, max_single_name[:50]))

cumulative = []
running = 0
for date_key in sorted(daily_pnl.keys()):
    running += daily_pnl[date_key]
    cumulative.append((date_key, running))

peak = 0
max_dd = 0
for date_key, cum in cumulative:
    if cum > peak:
        peak = cum
    dd = peak - cum
    if dd > max_dd:
        max_dd = dd
print("  Max drawdown within week: $%.4f" % max_dd)
print("  Sharpe proxy (avg daily profit / stdev daily profit):")
daily_vals = [daily_pnl[d] for d in sorted(daily_pnl.keys())]
if len(daily_vals) > 1:
    avg_d = statistics.mean(daily_vals)
    std_d = statistics.stdev(daily_vals)
    if std_d > 0:
        print("    Avg daily profit: $%.4f" % avg_d)
        print("    Stdev daily profit: $%.4f" % std_d)
        print("    Daily Sharpe: %.2f" % (avg_d / std_d))
print()

print("DAILY PURE PROFIT TRACKER (from state.json daily_history)")
print("-" * 70)
with open("/Users/billkim/polymarket-mm/state.json") as f:
    state = json.load(f)
dh = state.get("daily_history", [])
prev = None
for entry in dh:
    d = entry["date"]
    pp = entry["pure_profit"]
    if d == "2026-03-31":
        prev = pp
    if d >= "2026-04-01" and d <= "2026-04-06":
        daily_delta = pp - prev if prev is not None else 0
        print("  %s: pure_profit = $%.2f  (daily change: $%+.2f)" % (d, pp, daily_delta))
        prev = pp

apr1_val = None
apr6_val = None
for entry in dh:
    if entry["date"] == "2026-04-01":
        apr1_val = entry["pure_profit"]
    if entry["date"] == "2026-04-06":
        apr6_val = entry["pure_profit"]
if apr1_val is not None and apr6_val is not None:
    print("  Week total change: $%.2f -> $%.2f = $%+.2f" % (apr1_val, apr6_val, apr6_val - apr1_val))
print()

print("CURRENT BOT STATE")
print("-" * 70)
print("  Mode: %s  Running: %s  Status: %s" % (state["mode"], state["running"], state["status"]))
print("  Current exposure: $%.2f" % state["exposure"])
pos = state.get("positions", {})
print("  Open positions: %d (value: $%.2f)" % (pos.get("count", 0), pos.get("total_value", 0)))
for h in pos.get("held", []):
    print("    - %s: %s x%.2f @ $%.3f (unrealized: $%.2f)" % (h["title"][:50], h["outcome"], h["size"], h["avg_price"], h["unrealized_pnl"]))
apnl = state.get("actual_pnl", {})
print("  Actual P&L tracker:")
print("    Total bought: $%.2f  Total sold: $%.2f" % (apnl.get("total_bought", 0), apnl.get("total_sold", 0)))
print("    Net cash: $%.2f  Pure profit (all-time): $%.2f" % (apnl.get("net_cash", 0), apnl.get("pure_profit", 0)))
print("    Today pure profit: $%.2f" % apnl.get("today_pure_profit", 0))
print("    Buy count: %d  Sell count: %d" % (apnl.get("buy_count", 0), apnl.get("sell_count", 0)))
print()
print("=" * 70)
print("END OF AUDIT")
print("=" * 70)
