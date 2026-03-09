CATEGORY_KEYWORDS = {
    "Food": [
        "swiggy","zomato","restaurant","cafe","food","pizza","burger",
        "biryani","hotel","dining","lunch","dinner","breakfast","snack",
        "dominos","mcdonalds","kfc","subway","barbeque","dhaba","canteen",
        "juice","chai","coffee","starbucks","bakery","grocery","vegetables",
        "fruits","milk","eggs","bread","supermarket","bigbasket","blinkit",
        "instamart","dunzo","zepto"
    ],
    "Travel": [
        "uber","ola","rapido","auto","taxi","bus","train","flight",
        "irctc","petrol","diesel","fuel","metro","cab","indigo","spicejet",
        "makemytrip","goibibo","redbus","toll","parking","bike","rickshaw"
    ],
    "Shopping": [
        "amazon","flipkart","myntra","ajio","meesho","nykaa","clothes",
        "shirt","shoes","dress","shopping","mall","market","h&m","zara",
        "westside","lifestyle","reliance trends","decathlon","electronics",
        "mobile","laptop","headphones","watch","jewellery"
    ],
    "Bills": [
        "electricity","water","gas","wifi","internet","broadband","airtel",
        "jio","vi","bsnl","recharge","mobile bill","dth","tata sky",
        "maintenance","society","rent","emi","loan","insurance","premium",
        "postpaid","landline"
    ],
    "Entertainment": [
        "netflix","amazon prime","hotstar","disney","spotify","youtube",
        "movie","cinema","pvr","inox","game","gaming","ps5","xbox",
        "concert","event","ticket","bookmyshow","party","club","bar",
        "alcohol","beer","wine"
    ],
    "Health": [
        "hospital","doctor","medicine","pharmacy","medplus","apollo",
        "clinic","health","fitness","gym","yoga","physio","dental",
        "eye","spectacles","diagnostic","lab","test","blood","xray",
        "vaccination","surgery","nursing","1mg","netmeds","pharmeasy"
    ],
    "Education": [
        "school","college","university","fees","tuition","course",
        "udemy","coursera","books","stationery","pen","notebook",
        "coaching","class","exam","certification","skillshare"
    ],
    "Other": []
}

INCOME_KEYWORDS = {
    "Salary": ["salary","ctc","payroll","company","employer","office"],
    "Freelance": ["freelance","client","project","upwork","fiverr","consulting"],
    "Investment": ["dividend","interest","returns","mutual fund","stocks","profit"],
    "Gift": ["gift","birthday","wedding","bonus","reward"]
}

def categorize_expense(description: str) -> str:
    d = description.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for k in keywords:
            if k in d:
                return category
    return "Other"

def categorize_income(description: str) -> str:
    d = description.lower()
    for source, keywords in INCOME_KEYWORDS.items():
        for k in keywords:
            if k in d:
                return source
    return "Other"
