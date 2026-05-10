from playwright.sync_api import sync_playwright

def test_page():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:5174/critics")
        page.wait_for_timeout(2000)

        # Check if the page is completely blank white screen
        body_text = page.locator("body").inner_text()
        print(f"Body text length: {len(body_text)}")
        if len(body_text) < 10:
             print("Body text is almost empty. The app might be crashed.")
        else:
             print("Body text found. App is running.")
             print(body_text[:200])
        browser.close()

if __name__ == "__main__":
    test_page()
