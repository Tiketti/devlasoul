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

The site uses two types of image assets:

### Static Images
SVG source files are used for favicons and device-specific icons. These are generated manually when the favicon changes:

```sh
pnpm generate:favicon
```

This creates:
- `favicon.png` (32x32) - Alternative favicon for browsers that don't support SVG
- `apple-touch-icon.png` (180x180) - Icon for iOS devices

Source file: `public/favicon.svg`

> Note: Favicon generation is manual and not part of the build process since these rarely change.

### OpenGraph Image
The social media preview image is generated dynamically from the site's content:

```sh
pnpm generate:og
```

This creates:
- `og-image.svg` - Vector source with current site content
- `og-image.png` (1200x630) - Rasterized version for social media

The OG image automatically reflects the current site title, taglines, and styling, and is regenerated with every build.

## Deployment

The site is automatically deployed to Cloudflare Pages on every merge to main.

Node version is set to 22 in Cloudflare Pages using its environment variables:

> Pages > (project) > Settings > Variables and Secrets > `NODE_VERSION=22`.

### Setup

1. Create a new project in Cloudflare Pages
2. Add repository secrets in GitHub:
- `CLOUDFLARE_API_TOKEN` - Create in Cloudflare Dashboard > My Profile > API Tokens
   - Required permissions:
     - Account.Cloudflare Pages: Edit
     - Zone.Zone: Read
     - Zone.DNS: Edit
 - `CLOUDFLARE_ACCOUNT_ID` - Find in Cloudflare Dashboard > Account Home > Workers & Pages