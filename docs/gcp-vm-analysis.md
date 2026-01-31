# GCP VM 분석 보고서

> 작성: 2026-01-31 23:30 KST

## 1. VM 기본 정보

| 항목 | 값 |
|------|-----|
| **외부 IP** | `34.19.69.41` |
| **Reverse DNS** | `41.69.19.34.bc.googleusercontent.com` |
| **네트워크** | GOOGL-2 (NET-34-4-5-0-1) |
| **리전** | 미확인 (gcloud auth 필요) |
| **인스턴스 이름** | 미확인 |
| **SSH** | publickey 인증만 허용, 로컬 키로 접속 불가 |
| **발견 방법** | `~/.ssh/known_hosts`에서 ssh-ed25519 키 발견 |

## 2. 열린 포트

```
PORT     STATE    SERVICE
22/tcp   open     SSH
80/tcp   open     HTTP → 301 (HTTPS redirect)
443/tcp  open     HTTPS → Traefik
8080/tcp closed   (Traefik dashboard 외부 차단)
8443/tcp filtered
```

## 3. Traefik 상태

### 3.1 TLS 인증서
- **Default Cert Only**: `CN=TRAEFIK DEFAULT CERT`
- SAN: `c162c73c...traefik.default` (자동생성 해시)
- Let's Encrypt 인증서 **미설정**
- 모든 SNI 도메인 요청에 default cert 반환

### 3.2 라우팅
- HTTP(80) → HTTPS(443) 리다이렉트: ✅
- 라우팅 규칙: **미설정** (모든 호스트 패턴에 404 반환)
- 테스트한 Host 헤더:
  - `screen.eastsea.monster` → 404
  - `api.eastsea.monster` → 404
  - `traefik.eastsea.monster` → 404
  - `clawdbot.eastsea.monster` → 404
  - 기타 7개 서브도메인 → 모두 404

### 3.3 대시보드
- 외부 접속: 불가 (8080 closed)
- 내부 접속: 미확인 (SSH 불가)

## 4. DNS 현황

| 도메인 | 가리키는 곳 | 비고 |
|--------|------------|------|
| `eastsea.monster` | `185.199.108-111.153` | GitHub Pages |
| `screen.eastsea.monster` | 응답 없음 | 미설정 |
| `api.eastsea.monster` | 응답 없음 | 미설정 |
| `*.eastsea.monster` | 응답 없음 | 와일드카드 미설정 |

> ⚠️ GCP VM IP(34.19.69.41)를 가리키는 DNS 레코드 없음

## 5. 연동 서비스 (MiniPC)

| 서비스 | 상태 | 포트 | 비고 |
|--------|------|------|------|
| Screenshot Tool (Flask) | ✅ 실행중 | 5000 | systemd user service, python3 |
| Playwright | ✅ 설치됨 | - | 브라우저 자동화 |
| Clawdbot Node | ✅ 연결됨 | - | Tailscale 100.80.169.94 |

## 6. 아키텍처 (추정)

```
[인터넷 사용자]
     │
     ▼
[GCP VM: 34.19.69.41]
  └─ Traefik (80/443)
       │
       ▼ (Tailscale VPN 터널)
[MiniPC: 100.80.169.94]
  ├─ Screenshot Tool (:5000)
  ├─ Playwright (headless browser)
  └─ Clawdbot Node
```

## 7. SSH 접속 방법 (해결 필요)

### 현재 상황
- `~/.ssh/id_ed25519` 키 → rejected
- `~/.ssh/kjaylee-GitHub` 키 → rejected
- `~/.ssh/home` 키 → rejected
- 사용자 `kjaylee`, `spritz`, `root` 모두 실패

### 해결 방법
1. **gcloud compute ssh** (권장)
   ```bash
   gcloud auth login  # 브라우저 인증 필요
   gcloud compute instances list  # VM 인스턴스 확인
   gcloud compute ssh <인스턴스명> --zone <존>
   ```
2. **GCP Console에서 SSH 키 등록**
   - `~/.ssh/id_ed25519.pub` 내용을 VM 메타데이터에 추가
3. **GCP Console 브라우저 SSH**
   - https://console.cloud.google.com/ → Compute Engine → VM 인스턴스 → SSH

## 8. gcloud CLI 설치 상태

```
✅ Google Cloud SDK 554.0.0
   - bq 2.1.27
   - core 2026.01.23
   - gcloud-crc32c 1.0.0
   - gsutil 5.35
   
⚠️ 인증: 미완료 (gcloud auth login 필요)
   → 브라우저 OAuth 필요하므로 주인님께 요청
```

## 9. 다음 단계 (TODO)

### 즉시 (주인님 액션 필요)
1. **gcloud auth login** 실행 → 브라우저에서 Google 계정 인증
2. 인증 후:
   ```bash
   gcloud compute instances list  # VM 목록 확인
   gcloud compute ssh <인스턴스> --zone <존>  # SSH 접속
   ```

### VM 접속 후
1. **Traefik 설정 분석**
   - 설정 파일 위치: `/etc/traefik/`, Docker Compose 등
   - docker ps로 컨테이너 확인
   - Traefik 대시보드 (localhost:8080)
   
2. **DNS 설정**
   - `screen.eastsea.monster` → `34.19.69.41` A 레코드 추가
   - (또는 와일드카드 `*.service.eastsea.monster`)

3. **Let's Encrypt 설정**
   - Traefik ACME 자동 인증서 활성화
   - DNS challenge (Cloudflare) 또는 HTTP challenge

4. **라우팅 규칙 추가**
   - `screen.eastsea.monster` → MiniPC:5000 (Screenshot Tool)
   - Tailscale IP 또는 SSH 터널 경유

### 개선 권장사항
- [ ] Let's Encrypt 자동 인증서 (현재 자체서명)
- [ ] DNS 레코드 설정 (현재 미연결)
- [ ] Traefik 대시보드 BasicAuth 보호
- [ ] 방화벽 규칙 최소화 (필요 포트만)
- [ ] 모니터링/로깅 설정
- [ ] Tailscale ACL로 GCP VM ↔ MiniPC 접근 제한
