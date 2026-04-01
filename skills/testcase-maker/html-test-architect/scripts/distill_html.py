import sys
import re
from bs4 import BeautifulSoup

def distill_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')

    # 1. Tag Decomposition: Remove purely technical noise
    # We NO LONGER remove nav, footer, or aside as they contain critical testable paths.
    noise_tags = ['script', 'style', 'svg', 'head', 'link', 'noscript', 'iframe', 'canvas', 'path', 'meta']
    for tag in soup(noise_tags):
        tag.decompose()

    # 2. Attribute Pruning: Keep only semantic and interactive attributes
    semantic_attrs = [
        'id', 'class', 'name', 'type', 'value', 'placeholder', 'required', 
        'pattern', 'minlength', 'maxlength', 'min', 'max', 'role', 
        'data-testid', 'href', 'title', 'aria-label', 'aria-describedby', 
        'aria-invalid', 'aria-expanded', 'aria-haspopup', 'onclick'
    ]
    
    for tag in soup.find_all(True):
        attrs = dict(tag.attrs)
        new_attrs = {}
        for attr, val in attrs.items():
            # Keep specified semantic attributes or any data-/aria- attributes
            if attr in semantic_attrs or attr.startswith('aria-') or attr.startswith('data-'):
                new_attrs[attr] = val
        tag.attrs = new_attrs

    # 3. Whitespace Normalization
    distilled = soup.prettify()
    distilled = re.sub(r'\n\s*\n', '\n', distilled)
    
    return distilled.strip()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            # Set system to use utf-8 for output to avoid encoding errors
            sys.stdout.reconfigure(encoding='utf-8')
            print(distill_html(content))
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("Usage: python distill_html.py <html_file>")
