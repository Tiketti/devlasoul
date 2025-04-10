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

## Assets

The site uses SVG source files for favicons and social media images. To generate the PNG versions:

```sh
pnpm generate-images
```

This will create:
- `favicon.png` (32x32) - Alternative favicon for browsers that don't support SVG
- `apple-touch-icon.png` (180x180) - Icon for iOS devices
- `og-image.png` (1200x630) - Preview image for social media shares

Source files are in `public/`:
- `favicon.svg` - Source for favicon and apple-touch-icon
- `og-image.svg` - Source for social media preview image

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