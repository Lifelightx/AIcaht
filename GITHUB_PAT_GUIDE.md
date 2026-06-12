# Generating a GitHub Personal Access Token (PAT)

To import private repositories into Astra AI, you need a Personal Access Token (PAT). This guide shows you how to generate one securely.

## Quick Method (Recommended)

1. **[Click here to generate a token with pre-filled settings](https://github.com/settings/tokens/new?description=Astra+AI+Repo+Import&scopes=repo)**.
2. Log in to your GitHub account if prompted.
3. Scroll down to the bottom of the page and click **Generate token**.
4. **Copy the token** (it will start with `ghp_`).
5. Paste it into the Astra AI import repository modal.

---

## Manual Method

If you prefer to generate the token manually, follow these steps:

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens).
2. Click **Generate new token** (choose the **classic** version).
3. Under **Note**, enter a descriptive name, such as `Astra AI Repo Import`.
4. Under **Expiration**, choose a duration (e.g., 30 days, or No expiration if you prefer not to rotate it frequently).
5. Under **Select scopes**, check the box for **`repo`** (Full control of private repositories).
   - *Astra AI only needs read access to clone the code, but GitHub's classic tokens bundle read/write together under the `repo` scope for private repositories.*
6. Scroll to the bottom and click **Generate token**.
7. **Copy your new token** immediately. You won't be able to see it again!
8. Paste the token into Astra AI.

## Security Note
Astra AI uses this token **only** during the repository import process to securely clone your code. It is not permanently stored or used for any other purposes.
