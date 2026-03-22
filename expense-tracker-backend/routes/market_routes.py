from flask import Blueprint, jsonify
from datetime import datetime
from urllib.request import urlopen, Request
import json
import ssl
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeout

market_bp = Blueprint("market", __name__)

YAHOO_CHART_URL = "https://query2.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=2d"
MFAPI_LATEST_URL = "https://api.mfapi.in/mf/{code}/latest"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
}

def fetch_json(url: str, timeout: int = 5):
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=timeout, context=ctx) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"fetch_json failed {url}: {type(e).__name__}")
        return None

def parse_yahoo(symbol: str, friendly_name: str):
    empty = {"name": friendly_name, "price": None, "change": None, "change_pct": None, "updated_at": None}
    try:
        data = fetch_json(YAHOO_CHART_URL.format(symbol=symbol))
        if not data or not data.get("chart") or not data["chart"].get("result"):
            return empty
        meta = data["chart"]["result"][0].get("meta", {})
        price = meta.get("regularMarketPrice")
        prev = meta.get("previousClose")
        change = round(price - prev, 2) if price and prev else None
        change_pct = round((change / prev) * 100, 2) if change and prev else None
        ts = meta.get("regularMarketTime")
        updated_at = datetime.utcfromtimestamp(ts).isoformat() + "Z" if isinstance(ts, (int, float)) else None
        return {"name": friendly_name, "price": price, "change": change, "change_pct": change_pct, "updated_at": updated_at}
    except Exception as e:
        print(f"parse_yahoo error {symbol}: {e}")
        return empty

def parse_mf(code: str, friendly_name: str):
    empty = {"name": friendly_name, "price": None, "change": None, "change_pct": None, "updated_at": None}
    try:
        # Only try latest — no fallback to avoid double timeout
        data = fetch_json(MFAPI_LATEST_URL.format(code=code), timeout=4)
        if not data or not data.get("data"):
            return empty
        entries = data["data"]
        nav = float(entries[0]["nav"]) if entries and entries[0].get("nav") else None
        prev_nav = float(entries[1]["nav"]) if len(entries) > 1 and entries[1].get("nav") else None
        change = round(nav - prev_nav, 2) if nav and prev_nav else None
        change_pct = round((change / prev_nav) * 100, 2) if change and prev_nav else None
        return {
            "name": friendly_name,
            "price": nav,
            "change": change,
            "change_pct": change_pct,
            "updated_at": entries[0].get("date")
        }
    except Exception as e:
        print(f"parse_mf error {code}: {e}")
        return empty

def fetch_all_concurrent():
    """Fetch all market data concurrently to avoid sequential timeouts"""
    tasks = {
        "nifty": (parse_yahoo, ("^NSEI", "Nifty 50")),
        "sensex": (parse_yahoo, ("^BSESN", "Sensex")),
        "reliance": (parse_yahoo, ("RELIANCE.NS", "Reliance Industries")),
        "tcs": (parse_yahoo, ("TCS.NS", "TCS")),
        "hdfc": (parse_yahoo, ("HDFCBANK.NS", "HDFC Bank")),
        "infy": (parse_yahoo, ("INFY.NS", "Infosys")),
        "icici": (parse_yahoo, ("ICICIBANK.NS", "ICICI Bank")),
        "gold": (parse_yahoo, ("GC=F", "International Gold")),
        "embassy": (parse_yahoo, ("EMBASSY.NS", "Embassy REIT")),
        "mindspace": (parse_yahoo, ("MINDSPACE.NS", "Mindspace REIT")),
        "mirae": (parse_mf, ("119551", "Mirae Asset Large Cap")),
        "axis": (parse_mf, ("120503", "Axis Bluechip Fund")),
        "parag": (parse_mf, ("125354", "Parag Parikh Flexi Cap")),
        "sbi": (parse_mf, ("118989", "SBI Small Cap Fund")),
        "motilal": (parse_mf, ("120594", "Motilal Oswal Nasdaq 100")),
        "mirae_elss": (parse_mf, ("127042", "Mirae Asset Tax Saver ELSS")),
        "dsp_elss": (parse_mf, ("119913", "DSP Tax Saver ELSS")),
    }

    results = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {
            key: executor.submit(func, *args)
            for key, (func, args) in tasks.items()
        }
        for key, future in futures.items():
            try:
                results[key] = future.result(timeout=8)
            except Exception:
                func, args = tasks[key]
                results[key] = {"name": args[1], "price": None, "change": None, "change_pct": None, "updated_at": None}

    return results

@market_bp.route("/market/all", methods=["GET"])
def market_all():
    try:
        r = fetch_all_concurrent()
        payload = {
            "indices": [r["nifty"], r["sensex"]],
            "stocks": [r["reliance"], r["tcs"], r["hdfc"], r["infy"], r["icici"]],
            "sips": [r["mirae"], r["axis"], r["parag"], r["sbi"], r["motilal"]],
            "gold": [r["gold"]],
            "elss": [r["mirae_elss"], r["dsp_elss"]],
            "reits": [r["embassy"], r["mindspace"]],
            "updated_at": datetime.utcnow().isoformat() + "Z",
        }
        return jsonify(payload), 200
    except Exception as e:
        print(f"market_all error: {e}")
        return jsonify({
            "indices": [], "stocks": [], "sips": [],
            "gold": [], "elss": [], "reits": [],
            "updated_at": datetime.utcnow().isoformat() + "Z"
        }), 200

@market_bp.route("/market/indices", methods=["GET"])
def market_indices():
    return jsonify([parse_yahoo("^NSEI", "Nifty 50"), parse_yahoo("^BSESN", "Sensex")]), 200

@market_bp.route("/market/stocks", methods=["GET"])
def market_stocks():
    return jsonify([
        parse_yahoo("RELIANCE.NS", "Reliance Industries"),
        parse_yahoo("TCS.NS", "TCS"),
        parse_yahoo("HDFCBANK.NS", "HDFC Bank"),
        parse_yahoo("INFY.NS", "Infosys"),
        parse_yahoo("ICICIBANK.NS", "ICICI Bank"),
    ]), 200

@market_bp.route("/market/sips", methods=["GET"])
def market_sips():
    return jsonify([
        parse_mf("119551", "Mirae Asset Large Cap"),
        parse_mf("120503", "Axis Bluechip Fund"),
        parse_mf("125354", "Parag Parikh Flexi Cap"),
        parse_mf("118989", "SBI Small Cap Fund"),
        parse_mf("120594", "Motilal Oswal Nasdaq 100"),
    ]), 200

@market_bp.route("/market/gold", methods=["GET"])
def market_gold():
    return jsonify([parse_yahoo("GC=F", "International Gold")]), 200

@market_bp.route("/market/elss", methods=["GET"])
def market_elss():
    return jsonify([
        parse_mf("127042", "Mirae Asset Tax Saver ELSS"),
        parse_mf("119913", "DSP Tax Saver ELSS"),
    ]), 200

@market_bp.route("/market/reits", methods=["GET"])
def market_reits():
    return jsonify([
        parse_yahoo("EMBASSY.NS", "Embassy REIT"),
        parse_yahoo("MINDSPACE.NS", "Mindspace REIT"),
    ]), 200