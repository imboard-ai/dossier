// Environment variables are required and set via Vercel project settings
const config = {
  content: {
    org: 'imboard-ai',
    repo: 'dossier-content',
    branch: 'main',
    botToken: process.env.GITHUB_BOT_TOKEN as string,
  },

  auth: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scopes: 'read:user read:org',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      apiUrl: 'https://api.github.com',
    },
    jwt: {
      secret: process.env.JWT_SECRET as string,
    },
  },

  cdnBaseUrl: 'https://cdn.jsdelivr.net/gh',

  getCdnUrl(path: string): string {
    const { org, repo } = this.content;
    return `${this.cdnBaseUrl}/${org}/${repo}/${path}`;
  },

  getManifestUrl(): string {
    const { org, repo, branch } = this.content;
    return `https://raw.githubusercontent.com/${org}/${repo}/${branch}/index.json`;
  },
};

export default config;
