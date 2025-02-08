#### Running Locally

1. Clone the repository
2. Install dependencies:

```bash
    yarn install
```

3. Create a `.env` file and add the following:

```bash
    cp .env.example .env
```

4. Run the development server:

```bash
    yarn dev
```

5. Open your browser and navigate to `http://localhost:3001` to view the application.

## Deploying to Vercel

1. Run the following command to build the application:

```bash
    yarn build
```

2. Run the following command to deploy the application to Vercel:

```bash
    vercel
```

3. Open your browser and navigate to `https://<your-project-name>.vercel.app` to view the application.
