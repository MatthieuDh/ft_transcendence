import requests
import threading
import time

BASE_URL = "https://localhost/api"

LOGIN_URL = f"{BASE_URL}/auth/login"
TEST_URL = f"{BASE_URL}/projects"   # change to any protected endpoint

USERNAME = "joske_vermeulen"
PASSWORD = "@xrkWEI&tP8hGlRpKvqq"

TOTAL_REQUESTS = 100
THREADS = 20

lock = threading.Lock()

results = {
    "200": 0,
    "201": 0,
    "401": 0,
    "429": 0,
    "503": 0,
    "other": 0
}

# Disable SSL warnings for self-signed certs
requests.packages.urllib3.disable_warnings()


def login():
    payload = {
        "username": USERNAME,
        "password": PASSWORD
    }

    r = requests.post(LOGIN_URL, json=payload, verify=False)

    print("Login status:", r.status_code)

    if r.status_code != 200:
        print("Login failed:", r.text)
        return None

    try:
        data = r.json()
        token = data.get("access_token") or data.get("token")
        return token
    except Exception:
        return None


def send_request(i, token):
    headers = {}

    if token:
        headers["Authorization"] = f"Bearer {token}"

    try:
        r = requests.get(TEST_URL, headers=headers, verify=False)
        status = str(r.status_code)

        with lock:
            if status in results:
                results[status] += 1
            else:
                results["other"] += 1

        print(f"[{i}] {status}")

    except Exception as e:
        with lock:
            results["other"] += 1
        print(f"[{i}] ERROR: {e}")


def worker(start, end, token):
    for i in range(start, end):
        send_request(i, token)


def main():
    print("Logging in...")
    token = login()

    if not token:
        print("No token received. Exiting.")
        return

    print("Token received. Starting stress test...\n")

    threads = []
    chunk = TOTAL_REQUESTS // THREADS

    start_time = time.time()

    for i in range(THREADS):
        start = i * chunk
        end = start + chunk
        t = threading.Thread(target=worker, args=(start, end, token))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    end_time = time.time()

    print("\n--- RESULTS ---")
    print(results)
    print(f"Time: {end_time - start_time:.2f}s")


if __name__ == "__main__":
    main()
