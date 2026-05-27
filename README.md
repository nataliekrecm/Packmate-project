# PackMate 🎒

PackMate is an application for managing packing lists for your trips. You can create trips, manage a global item catalog, and track what you've already packed.

## Tech stack

**Backend**
- Node.js
- Express.js
- AJV (input validation)
- File-based storage (JSON files)

**Frontend**
- React 19
- React Router v7
- Bootstrap 5

## How to run

### Backend
```bash
cd server
npm install
node app.js
```
Server runs on http://localhost:8888

### Frontend
```bash
cd client
npm install
npm start
```
App runs on http://localhost:3000

## Frontend routes

| Route | Description |
|---|---|
| `/` | Dashboard — list of all trips |
| `/trip/:id` | Trip detail — packing list for a specific trip |
| `/items` | Item catalog — manage reusable items |

## API Endpoints

### Trip
- `GET /trip/list` — Get all trips
- `GET /trip/get?id=` — Get a specific trip
- `POST /trip/create` — Create a new trip
- `POST /trip/update` — Update a trip
- `POST /trip/delete` — Delete a trip
- `POST /trip/addItem` — Add an item to a trip's packing list
- `POST /trip/removeItem` — Remove an item from a trip's packing list
- `POST /trip/updateItemStatus` — Mark an item as packed/unpacked

### Item
- `GET /item/list` — Get all items from the catalog
- `GET /item/get?id=` — Get a specific item
- `POST /item/create` — Add a new item to the catalog
- `POST /item/update` — Update an item
- `POST /item/delete` — Delete an item
