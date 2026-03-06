# curl API Test Checklist

This file provides a full end-to-end API test flow for the backend.

## 1) Prerequisites

- Start backend service:

```bash
cd backend
npm run dev
```

- Open a new terminal for the commands below.
- Optional: install `jq` to parse JSON more easily.

## 2) Variables

```bash
BASE_URL="http://localhost:3001"
EMAIL="curl_user@example.com"
PASSWORD="password123"
NAME="Curl User"
QUERY="research assistant"
```

## 3) Health Check

```bash
curl -i "$BASE_URL/api/health"
```

Expected: `200 OK`

## 4) Register (idempotent)

```bash
curl -i -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\"}"
```

Expected: `201 Created` (or `409 Conflict` if already exists)

## 5) Login and Save Token

```bash
LOGIN_JSON=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_JSON"
TOKEN=$(echo "$LOGIN_JSON" | jq -r '.token')
USER_ID=$(echo "$LOGIN_JSON" | jq -r '.user.id')
echo "TOKEN=${TOKEN:0:24}..."
echo "USER_ID=$USER_ID"
```

Expected: token is non-empty

## 6) Get Current User

```bash
curl -i "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

Expected: `200 OK`

## 7) Refresh Token

```bash
REFRESH_JSON=$(curl -s -X POST "$BASE_URL/api/auth/refresh" \
  -H "Authorization: Bearer $TOKEN")

echo "$REFRESH_JSON"
NEW_TOKEN=$(echo "$REFRESH_JSON" | jq -r '.token')
TOKEN=${NEW_TOKEN:-$TOKEN}
```

Expected: `200 OK` and new token

## 8) Update Profile

```bash
curl -i -X PUT "$BASE_URL/api/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Curl User Updated"}'
```

Expected: `200 OK`

## 9) Update Password (no-op change for test)

```bash
curl -i -X PUT "$BASE_URL/api/users/me/password" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"currentPassword\":\"$PASSWORD\",\"newPassword\":\"$PASSWORD\"}"
```

Expected: `200 OK`

## 10) Get/Update Preferences

```bash
curl -i "$BASE_URL/api/users/me/preferences" \
  -H "Authorization: Bearer $TOKEN"

curl -i -X PUT "$BASE_URL/api/users/me/preferences" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"theme":"dark","language":"zh-CN","notifications":true}'
```

Expected: both `200 OK`

## 11) Search Papers (with filters)

```bash
SEARCH_JSON=$(curl -s "$BASE_URL/api/papers/search?query=$QUERY&sortBy=relevance&page=1&pageSize=5&type=conference" \
  -H "Authorization: Bearer $TOKEN")

echo "$SEARCH_JSON"
PAPER_ID=$(echo "$SEARCH_JSON" | jq -r '.results[0].id')
echo "PAPER_ID=$PAPER_ID"
```

Expected: `results` array and `facets` object

## 12) Generate Report

```bash
curl -i -X POST "$BASE_URL/api/reports/generate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query":"research assistant",
    "reportType":"summary",
    "papers":[
      {
        "id":"demo-paper",
        "title":"Demo Paper",
        "authors":["Alice","Bob"],
        "publicationYear":2025,
        "source":"Test Source",
        "abstract":"Demo abstract",
        "relevanceScore":90,
        "type":"journal"
      }
    ]
  }'
```

Expected: `200 OK` and JSON with `reportContent`

## 13) Read/Delete/Clear History

```bash
HISTORY_JSON=$(curl -s "$BASE_URL/api/users/me/history" \
  -H "Authorization: Bearer $TOKEN")

echo "$HISTORY_JSON"
HISTORY_ID=$(echo "$HISTORY_JSON" | jq -r '.items[0].id')
echo "HISTORY_ID=$HISTORY_ID"

curl -i -X DELETE "$BASE_URL/api/users/me/history/$HISTORY_ID" \
  -H "Authorization: Bearer $TOKEN"

curl -i -X DELETE "$BASE_URL/api/users/me/history" \
  -H "Authorization: Bearer $TOKEN"
```

Expected: delete single `200 OK`, clear all `200 OK`

## 14) Negative Cases

```bash
curl -i -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"wrong-password\"}"

curl -i "$BASE_URL/api/users/me"
```

Expected: first `401`, second `401`

## 15) Cleanup Account

```bash
curl -i -X DELETE "$BASE_URL/api/users/me" \
  -H "Authorization: Bearer $TOKEN"

curl -i -X POST "$BASE_URL/api/auth/logout"
```

Expected: account deletion `200 OK`, logout `200 OK`

## 16) Windows PowerShell Tips

- For multiline JSON in PowerShell, prefer here-strings (`@' ... '@`) and pass with `-Body`.
- If `jq` is unavailable, inspect output manually or parse via `ConvertFrom-Json`.
