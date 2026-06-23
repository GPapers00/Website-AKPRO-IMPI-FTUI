import urllib.request
import urllib.parse
import json
import re
import ssl
import os
from datetime import datetime

def load_env():
    # Simple .env parser to avoid external dependencies like python-dotenv
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    return env_vars

def scrape_opportunities():
    print("Scraping https://international.ui.ac.id/studex-opportunities/ ...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    url = 'https://international.ui.ac.id/studex-opportunities/'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    rows = re.findall(r'<tr.*?>(.*?)</tr>', html, re.DOTALL | re.IGNORECASE)
    
    opportunities = []
    
    for row in rows:
        cols = re.findall(r'<t[dh].*?>(.*?)</t[dh]>', row, re.DOTALL | re.IGNORECASE)
        # Clean HTML tags and decode entities
        clean_cols = []
        for c in cols:
            text = re.sub(r'<[^>]+>', '', c).strip()
            text = text.replace('&amp;', '&').replace('&#8211;', '-').replace('&#8217;', "'")
            clean_cols.append(text)
            
        status_text = ' '.join(clean_cols).upper()
        if 'TO BE OPENED' in status_text or 'OPEN' in status_text:
            if 'NO' in clean_cols and 'STATUS' in [c.upper() for c in clean_cols]:
                continue # Skip header
                
            if len(clean_cols) >= 10:
                note = clean_cols[8]
                status_col = clean_cols[9].upper()
                
                if status_col in ('OPEN', 'TO BE OPENED'):
                    # Filter for Engineering
                    note_lower = note.lower()
                    is_excluded = False
                    
                    if 'faculty of economics and business' in note_lower and 'engineering' not in note_lower:
                        is_excluded = True
                    if 'faculty of humanities' in note_lower and 'engineering' not in note_lower:
                        is_excluded = True
                    if 'faculty of law' in note_lower and 'engineering' not in note_lower:
                        is_excluded = True
                        
                    if not is_excluded:
                        # Find link if available
                        link_match = re.search(r'href=[\'"]?([^\'" >]+)', cols[7])
                        link = link_match.group(1) if link_match else ""
                        
                        try:
                            item_id = int(clean_cols[0])
                        except ValueError:
                            continue
                            
                        deadline_str = clean_cols[4]
                        
                        # Check if deadline has already passed
                        expired = False
                        try:
                            # Look for a date like "12 June 2026"
                            match = re.search(r'(\d{1,2}\s+[a-zA-Z]+\s+\d{4})', deadline_str)
                            if match:
                                dt = datetime.strptime(match.group(1), "%d %B %Y")
                                if dt < datetime.now():
                                    expired = True
                        except Exception:
                            pass
                            
                        if expired:
                            continue
                            
                        opportunities.append({
                            "id": item_id,
                            "program_name": clean_cols[1],
                            "country": clean_cols[2],
                            "university": clean_cols[3],
                            "deadline": deadline_str,
                            "period": clean_cols[5],
                            "level": clean_cols[6],
                            "link": link,
                            "notes": note,
                            "status": status_col
                        })
                        
    return opportunities

def update_supabase(opportunities):
    env_vars = load_env()
    supabase_url = env_vars.get("SUPABASE_URL") or os.environ.get("SUPABASE_URL")
    supabase_key = env_vars.get("SUPABASE_KEY") or os.environ.get("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env file or environment.")
        return

    print(f"Pushing {len(opportunities)} opportunities to Supabase...")
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    # 1. Delete all existing rows to ensure a clean sync
    delete_url = f"{supabase_url}/rest/v1/open_opportunities?id=gt.0"
    delete_req = urllib.request.Request(delete_url, method='DELETE')
    delete_req.add_header('apikey', supabase_key)
    delete_req.add_header('Authorization', f'Bearer {supabase_key}')
    try:
        urllib.request.urlopen(delete_req, context=ctx)
        print("Cleared old data.")
    except Exception as e:
        print(f"Warning/Error clearing old data (might be empty): {e}")

    # 2. Insert new rows
    if not opportunities:
        print("No open opportunities to insert.")
        return
        
    insert_url = f"{supabase_url}/rest/v1/open_opportunities"
    data = json.dumps(opportunities).encode('utf-8')
    insert_req = urllib.request.Request(insert_url, data=data, method='POST')
    insert_req.add_header('apikey', supabase_key)
    insert_req.add_header('Authorization', f'Bearer {supabase_key}')
    insert_req.add_header('Content-Type', 'application/json')
    insert_req.add_header('Prefer', 'return=minimal')
    
    try:
        urllib.request.urlopen(insert_req, context=ctx)
        print("Successfully updated Supabase with fresh data!")
    except Exception as e:
        print(f"Error inserting data: {e}")

if __name__ == '__main__':
    try:
        data = scrape_opportunities()
        update_supabase(data)
    except Exception as e:
        print(f"Scraper failed: {e}")
