# CSV Vault

Zero-knowledge encrypted CSV storage with client-side encryption only.

## Security

- **AES-256-GCM** encryption
- **PBKDF2** key derivation (100,000 iterations)
- **Unique salt & IV** per encryption
- Zero-knowledge: passphrase never leaves browser
- Server stores only encrypted data

## Usage

### 1. Encrypt Your Data (Local)

Open `encrypt-tool.html` in your browser:

1. Add tabs with names (e.g., "Portfolio", "Trades")
2. Paste CSV data into each tab
3. Enter a strong passphrase
4. Click "Encrypt & Generate Payload"
5. Copy the generated encrypted string

### 2. Publish (Public Page)

1. Open `public/index.html`
2. Replace the placeholder:
   ```javascript
   const ENCRYPTED_DATA = 'PASTE_YOUR_ENCRYPTED_BASE64_HERE';
   ```
3. Push to your GitHub Pages repo

### 3. View Your Data

- Visit your public page
- Enter passphrase to decrypt
- View data in tabbed tables

## Files

```
csv-vault/
├── encrypt-tool.html    # Local encryption tool
├── public/
│   └── index.html       # Public viewing page
└── README.md
```

## Important

- **Never forget your passphrase** — it cannot be recovered
- Store passphrase in a password manager
- The encrypted blob is visible in page source (but useless without passphrase)
