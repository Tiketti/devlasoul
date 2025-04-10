# Dev La Soul

3 commits high and rising.

## Development

```sh
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Deployment

The site is automatically deployed to Cloudflare Pages on every merge to main.

### Setup

1. Create a new project in Cloudflare Pages
2. Add repository secrets in GitHub:
   - `CLOUDFLARE_API_TOKEN` - Create in Cloudflare Dashboard > My Profile > API Tokens
     - Required permissions:
       - Account.Cloudflare Pages: Edit
       - Zone.Zone: Read
       - Zone.DNS: Edit
   - `CLOUDFLARE_ACCOUNT_ID` - Find in Cloudflare Dashboard > Account Home > Workers & Pages