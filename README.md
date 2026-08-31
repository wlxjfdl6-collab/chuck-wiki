# CHUCK WIKI

CHUCK의 음악, 이미지, 기억, 철학과 세계관을 한국어와 이탈리아어로 연결하는 공개 Quartz 위키입니다.

- 한국어: `/ko/`
- Italiano: `/it/`
- 공개 원본: `C:\Users\CHUCK\Documents\CHUCK Vault\40_PUBLIC_WIKI`
- Quartz 프로젝트: `C:\Users\CHUCK\Documents\CHUCK-Quartz`

## 안전한 공개 흐름

Quartz는 전체 Obsidian 볼트를 읽지 않습니다. `40_PUBLIC_WIKI`만 동기화하며, Markdown은 frontmatter에 `publish: true`가 있어야 복사됩니다. 첨부파일은 `assets/` 폴더 안의 허용된 미디어 형식만 복사됩니다.

```bash
npm run build:wiki
```

위 명령은 공개 승인 파일을 `content/`로 동기화한 뒤 사이트를 빌드합니다.

```bash
npx quartz build --serve
```

로컬 미리보기는 `http://localhost:8080`에서 확인합니다.

## 배포

`v5` 브랜치에 push하면 `.github/workflows/deploy.yml`이 GitHub Pages로 자동 배포합니다.
