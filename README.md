# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 6주차 API 연동

맛집 목록·상세·인기 목록과 새 맛집 등록은 Render API를 사용합니다.
기존 제보와 좋아요는 현재 브라우저의 LocalStorage에 보관됩니다.

- 서버: https://pwd-week6-0p9u.onrender.com
- 관리자: `/admin` (등록 가능, 서버에서 지원하지 않는 수정·삭제는 비활성화)
- 제보 관리: `/submissions` (승인하면 Render에 맛집 등록)
- 로컬: `.env.example`을 참고해 `.env.local`에 `VITE_API_BASE_URL`을 지정합니다.
- Vercel: Production과 Preview의 `VITE_API_BASE_URL`에 위 서버 주소를 설정합니다.
- 검사: `npm run typecheck`, `npm run lint`, `npm run build`

이 프로젝트는 BrowserRouter를 사용하며 Vercel의 `vercel.json` rewrite로 상세 주소 새로고침을 지원합니다.
Render에 새로 등록한 맛집은 서버 재시작 시 초기 데이터로 돌아갑니다.
