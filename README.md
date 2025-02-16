# Workbench

Find me at [Mattcooke.tech](https://mattcooke.tech)

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
yarn run dev
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

#### Features

- [NASA Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) integration
- [Hevy](https://api.hevyapp.com/docs/) integration

### Tools

- [Toast notifications](https://mui.com/components/snackbar/) for error handling
- [Material-UI](https://mui.com/) components
- [Dark theme](https://mui.com/customization/palette/) support

#### External APIs

- [NASA APOD API](https://api.nasa.gov/) - Get your API key [here](https://api.nasa.gov/)
- [Luxon](https://moment.github.io/luxon/#/) - A library for parsing, validating, manipulating, and displaying dates and times in JavaScript
- [Paper.js](https://paperjs.org/) - A library for creating and manipulating 2D shapes in JavaScript
- [OpenWeatherMap](https://openweathermap.org/api) - A weather API for getting weather data
- [Hevy](https://api.hevyapp.com/docs/) - A library for creating and manipulating 2D shapes in JavaScript
