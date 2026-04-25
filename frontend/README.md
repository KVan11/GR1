# Frontend (React + Vite) ket noi Express backend

Tai lieu nay huong dan cau hinh giao dien de lam viec voi API Express ma khong can thay doi cau truc backend.

## Kien truc ket noi

- Frontend goi API qua duong dan tuong doi `/api`.
- Vite dev server proxy `/api` sang `http://localhost:3000` (Express).
- Backend giu nguyen cac route:
  - `/api/auth`
  - `/api/post`
  - `/api/vote`

## Chay du an local

1. Chay backend (Express) tai cong `3000`.
2. Chay frontend Vite:

```bash
npm install
npm run dev
```

Mac dinh frontend se goi qua proxy den Express.

## Tuy chinh endpoint API (tuy chon)

Neu muon goi truc tiep API (khong qua proxy), tao file `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Neu khong khai bao `VITE_API_URL`, frontend se dung gia tri mac dinh la `/api`.
