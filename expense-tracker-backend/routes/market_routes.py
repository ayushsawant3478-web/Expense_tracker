from flask import Blueprint, jsonify
from datetime import datetime
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
import json

market_bp = Blueprint("market", __name__)

YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=2d"
MFAPI_LATEST_URL = "https://api.mfapi.in/mf/{code}/latest"
MFAPI_FALLBACK_URL = "https://api.mfapi.in/mf/{code}"

def fetch_json(url: str):
    try:
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urlopen(req, timeout=10) as resp:
            data = resp.read().decode("utf-8")
            return json.loads(data)
    except (HTTPError, URLError, json.JSONDecodeError):
        return None

def parse_yahoo(symbol: str, friendly_name: str):
    data = fetch_json(YAHOO_CHART_URL.format(symbol=symbol))
    if not data or not data.get("chart") or not data["chart"].get("result"):
        return {"name": friendly_name, "price": None, "change": None, "change_pct": None, "updated_at": None}
    res = data["chart"]["result"][0]
    meta = res.get("meta", {})
    closes = (res.get("indicators", {}).get("quote", [{}])[0].get("close", []) or [])
    closes = [c for c in closes if c is not None]
    if len(closes) == 0:
        price = meta.get("regularMarketPrice")
        prev = meta.get("previousClose")
    else:
        price = closes[-1]
        prev = closes[-2] if len(closes) > 1 else None
    change = None if price is None or prev is None else round(price - prev, 2)
    change_pct = None if change is None or prev in (None, 0) else round((change / prev) * 100, 2)
    ts = meta.get("regularMarketTime")
    updated_at = datetime.utcfromtimestamp(ts).isoformat() + "Z" if isinstance(ts, (int, float)) else datetime.utcnow().isoformat() + "Z"
    return {"name": friendly_name, "price": price, "change": change, "change_pct": change_pct, "updated_at": updated_at}

def parse_mf(code: str, friendly_name: str):
    latest = fetch_json(MFAPI_LATEST_URL.format(code=code))
    if latest and isinstance(latest, dict) and latest.get("data"):
        entry = latest["data"][0]
        nav = float(entry.get("nav")) if entry.get("nav") is not None else None
        date = entry.get("date")
        return {"name": friendly_name, "price": nav, "change": None, "change_pct": None, "updated_at": date}
    fallback = fetch_json(MFAPI_FALLBACK_URL.format(code=code))
    if fallback and isinstance(fallback, dict) and fallback.get("data"):
        data = fallback["data"]
        last = next((d for d in reversed(data) if d.get("nav") is not None), None)
        prev = next((d for d in reversed(data[:-1]) if d.get("nav") is not None), None) if len(data) > 1 else None
        nav = float(last["nav"]) if last and last.get("nav") else None
        change = None
        change_pct = None
        if last and prev and last.get("nav") and prev.get("nav"):
            change = round(float(last["nav"]) - float(prev["nav"]), 2)
            prev_nav = float(prev["nav"])
            change_pct = None if prev_nav == 0 else round((change / prev_nav) * 100, 2)
        updated_at = last.get("date") if last else None
        return {"name": friendly_name, "price": nav, "change": change, "change_pct": change_pct, "updated_at": updated_at}
    return {"name": friendly_name, "price": None, "change": None, "change_pct": None, "updated_at": None}

@market_bp.route("/market/indices", methods=["GET"])
def market_indices():
    items = [
        parse_yahoo("^NSEI", "Nifty 50"),
        parse_yahoo("^BSESN", "Sensex"),
    ]
    return jsonify(items), 200

@market_bp.route("/market/stocks", methods=["GET"])
def market_stocks():
    symbols = {
        "RELIANCE.NS": "Reliance Industries",
        "TCS.NS": "TCS",
        "HDFCBANK.NS": "HDFC Bank",
        "INFY.NS": "Infosys",
        "ICICIBANK.NS": "ICICI Bank",
        "EMBASSY.NS": "Embassy REIT",
        "MINDSPACE.NS": "Mindspace REIT",
    }
    items = []
    for sym, name in symbols.items():
        items.append(parse_yahoo(sym, name))
    return jsonify(items), 200

@market_bp.route("/market/sips", methods=["GET"])
def market_sips():
    codes = {
        "119551": "Mirae Asset Large Cap",
        "120503": "Axis Bluechip Fund",
        "125354": "Parag Parikh Flexi Cap",
        "118989": "SBI Small Cap Fund",
        "120594": "Motilal Oswal Nasdaq 100",
    }
    items = [parse_mf(code, name) for code, name in codes.items()]
    return jsonify(items), 200

@market_bp.route("/market/gold", methods=["GET"])
def market_gold():
    return jsonify([parse_yahoo("GC=F", "International Gold")]), 200

@market_bp.route("/market/elss", methods=["GET"])
def market_elss():
    codes = {
        "127042": "Mirae Asset Tax Saver ELSS",
        "120503": "Axis Long Term Equity ELSS",
        "119913": "DSP Tax Saver ELSS",
    }
    items = [parse_mf(code, name) for code, name in codes.items()]
    return jsonify(items), 200

@market_bp.route("/market/reits", methods=["GET"])
def market_reits():
    items = [
        parse_yahoo("EMBASSY.NS", "Embassy REIT"),
        parse_yahoo("MINDSPACE.NS", "Mindspace REIT"),
    ]
    return jsonify(items), 200

@market_bp.route("/market/all", methods=["GET"])
def market_all():
    payload = {
        "indices": [
            parse_yahoo("^NSEI", "Nifty 50"),
            parse_yahoo("^BSESN", "Sensex"),
        ],
        "stocks": [
            parse_yahoo("RELIANCE.NS", "Reliance Industries"),
            parse_yahoo("TCS.NS", "TCS"),
            parse_yahoo("HDFCBANK.NS", "HDFC Bank"),
            parse_yahoo("INFY.NS", "Infosys"),
            parse_yahoo("ICICIBANK.NS", "ICICI Bank"),
            parse_yahoo("EMBASSY.NS", "Embassy REIT"),
            parse_yahoo("MINDSPACE.NS", "Mindspace REIT"),
        ],
        "sips": [
            parse_mf("119551", "Mirae Asset Large Cap"),
            parse_mf("120503", "Axis Bluechip Fund"),
            parse_mf("125354", "Parag Parikh Flexi Cap"),
            parse_mf("118989", "SBI Small Cap Fund"),
            parse_mf("120594", "Motilal Oswal Nasdaq 100"),
        ],
        "gold": [parse_yahoo("GC=F", "International Gold")],
        "elss": [
            parse_mf("127042", "Mirae Asset Tax Saver ELSS"),
            parse_mf("120503", "Axis Long Term Equity ELSS"),
            parse_mf("119913", "DSP Tax Saver ELSS"),
        ],
        "reits": [
            parse_yahoo("EMBASSY.NS", "Embassy REIT"),
            parse_yahoo("MINDSPACE.NS", "Mindspace REIT"),
        ],
        "updated_at": datetime.utcnow().isoformat() + "Z",
    }
    return jsonify(payload), 200

