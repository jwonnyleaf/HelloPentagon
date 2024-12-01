# HelloPentagon

An IUI Malware Detector.

## Run Locally

Clone the project

```bash
  git clone https://github.com/jwonnyleaf/HelloPentagon.git
```

Go to the project directory

```bash
  cd HelloPentagon
```

You need to make a .env file with the following contents:
```
OPENAI_API_KEY=
```

Install Front-end Dependencies

```bash
  cd frontend
  npm install
  npm run dev
```

Run Server

```bash
  cd backend
  docker-compose down --rmi all && docker-compose up --build --force-recreate
```
