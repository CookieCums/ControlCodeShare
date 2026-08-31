# ControlCodeShare

A lightweight Flask web app for sharing and matching device control configurations.

The application stores profile data in a GitHub Gist and hosts uploaded control images through ImgBB, then lets users search for matching profiles using device and setup information.

## What it does

- Collects control-profile information through a web interface
- Matches profiles by claw style, game, device, and device size
- Stores profile records in a GitHub Gist
- Uploads control images to ImgBB
- Returns matching profiles through a results page
- Uses caching and response compression for repeated requests

## Stack

- **Python**
- **Flask**
- **GitHub Gist API**
- **ImgBB API**
- **HTML / CSS**

## Configuration

The application expects these environment variables:

```text
GITHUB_ACCESS_TOKEN
IMGBB_API_KEY
```

Do not put real API keys or access tokens in the repository.

The application uses a GitHub Gist containing `User_Data.json` as its profile data source.

## Run locally

### 1. Clone

```bash
git clone https://github.com/CookieCums/ControlCodeShare.git
cd ControlCodeShare
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure credentials

Set `GITHUB_ACCESS_TOKEN` and `IMGBB_API_KEY` in your environment.

### 4. Start the server

```bash
python main.py
```

The application listens on port `10000`.

## Repository structure

```text
ControlCodeShare/
├── main.py
├── requirements.txt
├── static/
└── templates/
```

## Data flow

```text
User
  │
  ├── Search profile ──► Flask ──► GitHub Gist
  │                                  │
  │                                  └── User_Data.json
  │
  └── Submit profile ─► Flask ──► ImgBB (control image)
                              │
                              └── GitHub Gist (profile data)
```

## Links

- [Source code](https://github.com/CookieCums/ControlCodeShare/blob/main/main.py)
- [Dependencies](https://github.com/CookieCums/ControlCodeShare/blob/main/requirements.txt)
- [Templates](https://github.com/CookieCums/ControlCodeShare/tree/main/templates)
- [Static files](https://github.com/CookieCums/ControlCodeShare/tree/main/static)

## Notes

This README documents the current implementation. It does not change or imply additional application functionality.
