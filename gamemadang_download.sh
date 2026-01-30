#!/bin/bash
set -e
BASE="/volume1/미디어/gamemadang"
COOKIE="1:13e_1=1:13e_1_to_9b:2655"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
REF="https://gamemadang.or.kr/"
LOG="$BASE/download.log"
DONE=0
SKIP=0
FAIL=0

echo "=== Gamemadang Download Start: $(date) ===" >> "$LOG"

# [1/158] A Sloth's Journey 외 4
if [ -f "$BASE/2D/A_Sloths_Journey_외_4_PKGE_1724051462775.zip" ]; then
  echo "[SKIP] A_Sloths_Journey_외_4_PKGE_1724051462775.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [1/158] A_Sloths_Journey_외_4_PKGE_1724051462775.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/A_Sloths_Journey_외_4_PKGE_1724051462775.zip" "https://gamemadang.or.kr/upload/pkge/pkge_61711819873941476.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] A_Sloths_Journey_외_4_PKGE_1724051462775.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [2/158] 쓰리매치퍼즐프로젝트
if [ -f "$BASE/2D/쓰리매치퍼즐프로젝트_PKGE_1724043344389.zip" ]; then
  echo "[SKIP] 쓰리매치퍼즐프로젝트_PKGE_1724043344389.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [2/158] 쓰리매치퍼즐프로젝트_PKGE_1724043344389.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/쓰리매치퍼즐프로젝트_PKGE_1724043344389.zip" "https://gamemadang.or.kr/upload/pkge/pkge_67845411314520418.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 쓰리매치퍼즐프로젝트_PKGE_1724043344389.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [3/158] 카드오델로
if [ -f "$BASE/2D/카드오델로_PKGE_1724042380506.zip" ]; then
  echo "[SKIP] 카드오델로_PKGE_1724042380506.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [3/158] 카드오델로_PKGE_1724042380506.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/카드오델로_PKGE_1724042380506.zip" "https://gamemadang.or.kr/upload/pkge/pkge_61696660923875807.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 카드오델로_PKGE_1724042380506.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [4/158] 스톤에이지
if [ -f "$BASE/2D/스톤에이지_PKGE_1723621738014.zip" ]; then
  echo "[SKIP] 스톤에이지_PKGE_1723621738014.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [4/158] 스톤에이지_PKGE_1723621738014.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/스톤에이지_PKGE_1723621738014.zip" "https://gamemadang.or.kr/upload/pkge/pkge_61424549127604669.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 스톤에이지_PKGE_1723621738014.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [5/158] 그랜드쥬얼캐슬
if [ -f "$BASE/2D/그랜드쥬얼캐슬_PKGE_1681264035012.zip" ]; then
  echo "[SKIP] 그랜드쥬얼캐슬_PKGE_1681264035012.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [5/158] 그랜드쥬얼캐슬_PKGE_1681264035012.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/그랜드쥬얼캐슬_PKGE_1681264035012.zip" "https://gamemadang.or.kr/upload/pkge/pkge_31633845329684591.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 그랜드쥬얼캐슬_PKGE_1681264035012.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [6/158] 레전드매지컬쥬얼스
if [ -f "$BASE/2D/레전드매지컬쥬얼스_PKGE_1681264016742.zip" ]; then
  echo "[SKIP] 레전드매지컬쥬얼스_PKGE_1681264016742.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [6/158] 레전드매지컬쥬얼스_PKGE_1681264016742.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/레전드매지컬쥬얼스_PKGE_1681264016742.zip" "https://gamemadang.or.kr/upload/pkge/pkge_31539423023115534.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 레전드매지컬쥬얼스_PKGE_1681264016742.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [7/158] 지옥도
if [ -f "$BASE/2D/지옥도_PKGE_1681263957331.zip" ]; then
  echo "[SKIP] 지옥도_PKGE_1681263957331.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [7/158] 지옥도_PKGE_1681263957331.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/지옥도_PKGE_1681263957331.zip" "https://gamemadang.or.kr/upload/pkge/pkge_31539369626201738.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 지옥도_PKGE_1681263957331.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [8/158] 러닝프린스
if [ -f "$BASE/2D/러닝프린스_PKGE_1681263931274.zip" ]; then
  echo "[SKIP] 러닝프린스_PKGE_1681263931274.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [8/158] 러닝프린스_PKGE_1681263931274.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/러닝프린스_PKGE_1681263931274.zip" "https://gamemadang.or.kr/upload/pkge/pkge_31539324723720500.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 러닝프린스_PKGE_1681263931274.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [9/158] 로그던전 외 1종
if [ -f "$BASE/2D/로그던전_외_1종_PKGE_1681263893599.zip" ]; then
  echo "[SKIP] 로그던전_외_1종_PKGE_1681263893599.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [9/158] 로그던전_외_1종_PKGE_1681263893599.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/로그던전_외_1종_PKGE_1681263893599.zip" "https://gamemadang.or.kr/upload/pkge/pkge_31471893956271505.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 로그던전_외_1종_PKGE_1681263893599.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [10/158] 해적질은 끝이없다
if [ -f "$BASE/2D/해적질은_끝이없다_PKGE_1681263856573.zip" ]; then
  echo "[SKIP] 해적질은_끝이없다_PKGE_1681263856573.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [10/158] 해적질은_끝이없다_PKGE_1681263856573.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/해적질은_끝이없다_PKGE_1681263856573.zip" "https://gamemadang.or.kr/upload/pkge/pkge_31538610223428336.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 해적질은_끝이없다_PKGE_1681263856573.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [11/158] Hello Witch
if [ -f "$BASE/2D/Hello_Witch_PKGE_1681263821778.zip" ]; then
  echo "[SKIP] Hello_Witch_PKGE_1681263821778.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [11/158] Hello_Witch_PKGE_1681263821778.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Hello_Witch_PKGE_1681263821778.zip" "https://gamemadang.or.kr/upload/pkge/pkge_31467779189739547.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Hello_Witch_PKGE_1681263821778.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [12/158] Endless Space
if [ -f "$BASE/2D/Endless_Space_PKGE_1681263766176.zip" ]; then
  echo "[SKIP] Endless_Space_PKGE_1681263766176.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [12/158] Endless_Space_PKGE_1681263766176.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Endless_Space_PKGE_1681263766176.zip" "https://gamemadang.or.kr/upload/pkge/pkge_31468024925181035.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Endless_Space_PKGE_1681263766176.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [13/158] 폐쇄된 생체실험구역
if [ -f "$BASE/2D/폐쇄된_생체실험구역_PKGE_1674181135325.zip" ]; then
  echo "[SKIP] 폐쇄된_생체실험구역_PKGE_1674181135325.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [13/158] 폐쇄된_생체실험구역_PKGE_1674181135325.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/폐쇄된_생체실험구역_PKGE_1674181135325.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12289807782825148.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 폐쇄된_생체실험구역_PKGE_1674181135325.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [14/158] 몬스터 디펜스 워
if [ -f "$BASE/2D/몬스터_디펜스_워_PKGE_1674180658979.zip" ]; then
  echo "[SKIP] 몬스터_디펜스_워_PKGE_1674180658979.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [14/158] 몬스터_디펜스_워_PKGE_1674180658979.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/몬스터_디펜스_워_PKGE_1674180658979.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11835458976470374.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 몬스터_디펜스_워_PKGE_1674180658979.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [15/158] 상상나래동물농장
if [ -f "$BASE/2D/상상나래동물농장_PKGE_1674180430780.zip" ]; then
  echo "[SKIP] 상상나래동물농장_PKGE_1674180430780.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [15/158] 상상나래동물농장_PKGE_1674180430780.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/상상나래동물농장_PKGE_1674180430780.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11835232093457491.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 상상나래동물농장_PKGE_1674180430780.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [16/158] 요마열애전
if [ -f "$BASE/2D/요마열애전_PKGE_1674180162085.zip" ]; then
  echo "[SKIP] 요마열애전_PKGE_1674180162085.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [16/158] 요마열애전_PKGE_1674180162085.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/요마열애전_PKGE_1674180162085.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12289741988956942.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 요마열애전_PKGE_1674180162085.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [17/158] darktower defense
if [ -f "$BASE/2D/darktower_defense_PKGE_1674179136981.zip" ]; then
  echo "[SKIP] darktower_defense_PKGE_1674179136981.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [17/158] darktower_defense_PKGE_1674179136981.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/darktower_defense_PKGE_1674179136981.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11833937282597912.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] darktower_defense_PKGE_1674179136981.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [18/158] StepStep
if [ -f "$BASE/2D/StepStep_PKGE_1674117937457.zip" ]; then
  echo "[SKIP] StepStep_PKGE_1674117937457.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [18/158] StepStep_PKGE_1674117937457.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/StepStep_PKGE_1674117937457.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11772737982017151.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] StepStep_PKGE_1674117937457.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [19/158] PlanA
if [ -f "$BASE/2D/PlanA_PKGE_1674117585410.zip" ]; then
  echo "[SKIP] PlanA_PKGE_1674117585410.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [19/158] PlanA_PKGE_1674117585410.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/PlanA_PKGE_1674117585410.zip" "https://gamemadang.or.kr/upload/pkge/pkge_37587395661345296.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] PlanA_PKGE_1674117585410.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [20/158] Pinpang
if [ -f "$BASE/2D/Pinpang_PKGE_1674115554547.zip" ]; then
  echo "[SKIP] Pinpang_PKGE_1674115554547.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [20/158] Pinpang_PKGE_1674115554547.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Pinpang_PKGE_1674115554547.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11770356648535690.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Pinpang_PKGE_1674115554547.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [21/158] 닌자 뱀파이어헌터
if [ -f "$BASE/2D/닌자_뱀파이어헌터_PKGE_1674114961876.zip" ]; then
  echo "[SKIP] 닌자_뱀파이어헌터_PKGE_1674114961876.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [21/158] 닌자_뱀파이어헌터_PKGE_1674114961876.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/닌자_뱀파이어헌터_PKGE_1674114961876.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11769764976428468.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 닌자_뱀파이어헌터_PKGE_1674114961876.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [22/158] 기사단 데몬슬레이어
if [ -f "$BASE/2D/기사단_데몬슬레이어_PKGE_1674114499294.zip" ]; then
  echo "[SKIP] 기사단_데몬슬레이어_PKGE_1674114499294.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [22/158] 기사단_데몬슬레이어_PKGE_1674114499294.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/기사단_데몬슬레이어_PKGE_1674114499294.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12289968715579138.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 기사단_데몬슬레이어_PKGE_1674114499294.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [23/158] 로그런-어비스타워
if [ -f "$BASE/2D/로그런-어비스타워_PKGE_1674113809058.zip" ]; then
  echo "[SKIP] 로그런-어비스타워_PKGE_1674113809058.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [23/158] 로그런-어비스타워_PKGE_1674113809058.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/로그런-어비스타워_PKGE_1674113809058.zip" "https://gamemadang.or.kr/upload/pkge/pkge_5276407480702005.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 로그런-어비스타워_PKGE_1674113809058.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [24/158] 슈퍼나이트
if [ -f "$BASE/2D/슈퍼나이트_PKGE_1674113527722.zip" ]; then
  echo "[SKIP] 슈퍼나이트_PKGE_1674113527722.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [24/158] 슈퍼나이트_PKGE_1674113527722.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/슈퍼나이트_PKGE_1674113527722.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11768329439841567.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 슈퍼나이트_PKGE_1674113527722.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [25/158] Bubble Hit
if [ -f "$BASE/2D/Bubble_Hit_PKGE_1674112789608.zip" ]; then
  echo "[SKIP] Bubble_Hit_PKGE_1674112789608.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [25/158] Bubble_Hit_PKGE_1674112789608.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Bubble_Hit_PKGE_1674112789608.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11767590952241409.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Bubble_Hit_PKGE_1674112789608.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [26/158] 메이킹오브킹덤
if [ -f "$BASE/2D/메이킹오브킹덤_PKGE_1674112474507.zip" ]; then
  echo "[SKIP] 메이킹오브킹덤_PKGE_1674112474507.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [26/158] 메이킹오브킹덤_PKGE_1674112474507.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/메이킹오브킹덤_PKGE_1674112474507.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11767275381570454.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 메이킹오브킹덤_PKGE_1674112474507.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [27/158] high jump
if [ -f "$BASE/2D/high_jump_PKGE_1674111869498.zip" ]; then
  echo "[SKIP] high_jump_PKGE_1674111869498.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [27/158] high_jump_PKGE_1674111869498.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/high_jump_PKGE_1674111869498.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11766671334318820.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] high_jump_PKGE_1674111869498.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [28/158] 용사는 알바중
if [ -f "$BASE/2D/용사는_알바중_PKGE_1674111586458.zip" ]; then
  echo "[SKIP] 용사는_알바중_PKGE_1674111586458.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [28/158] 용사는_알바중_PKGE_1674111586458.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/용사는_알바중_PKGE_1674111586458.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11766388822301604.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 용사는_알바중_PKGE_1674111586458.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [29/158] stealth
if [ -f "$BASE/2D/stealth_PKGE_1674110918508.zip" ]; then
  echo "[SKIP] stealth_PKGE_1674110918508.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [29/158] stealth_PKGE_1674110918508.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/stealth_PKGE_1674110918508.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11765718492330371.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] stealth_PKGE_1674110918508.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [30/158] 웰리의 모험
if [ -f "$BASE/2D/웰리의_모험_PKGE_1674109752142.zip" ]; then
  echo "[SKIP] 웰리의_모험_PKGE_1674109752142.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [30/158] 웰리의_모험_PKGE_1674109752142.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/웰리의_모험_PKGE_1674109752142.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11764552998269163.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 웰리의_모험_PKGE_1674109752142.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [31/158] Monster Killer
if [ -f "$BASE/2D/Monster_Killer_PKGE_1674108606610.zip" ]; then
  echo "[SKIP] Monster_Killer_PKGE_1674108606610.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [31/158] Monster_Killer_PKGE_1674108606610.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Monster_Killer_PKGE_1674108606610.zip" "https://gamemadang.or.kr/upload/pkge/pkge_30305625329892315.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Monster_Killer_PKGE_1674108606610.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [32/158] 오크워
if [ -f "$BASE/2D/오크워_PKGE_1674106002718.zip" ]; then
  echo "[SKIP] 오크워_PKGE_1674106002718.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [32/158] 오크워_PKGE_1674106002718.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/오크워_PKGE_1674106002718.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12288823533211899.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 오크워_PKGE_1674106002718.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [33/158] 인섹트서바이벌
if [ -f "$BASE/2D/인섹트서바이벌_PKGE_1674105643296.zip" ]; then
  echo "[SKIP] 인섹트서바이벌_PKGE_1674105643296.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [33/158] 인섹트서바이벌_PKGE_1674105643296.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/인섹트서바이벌_PKGE_1674105643296.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12274136871692311.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 인섹트서바이벌_PKGE_1674105643296.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [34/158] Fruit pop 외 1종
if [ -f "$BASE/2D/Fruit_pop_외_1종_PKGE_1674104495219.zip" ]; then
  echo "[SKIP] Fruit_pop_외_1종_PKGE_1674104495219.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [34/158] Fruit_pop_외_1종_PKGE_1674104495219.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Fruit_pop_외_1종_PKGE_1674104495219.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11759297104000041.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Fruit_pop_외_1종_PKGE_1674104495219.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [35/158] 몬스터팡
if [ -f "$BASE/2D/몬스터팡_PKGE_1674098415614.zip" ]; then
  echo "[SKIP] 몬스터팡_PKGE_1674098415614.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [35/158] 몬스터팡_PKGE_1674098415614.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/몬스터팡_PKGE_1674098415614.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11753214077135751.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 몬스터팡_PKGE_1674098415614.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [36/158] 퍼즐매치
if [ -f "$BASE/2D/퍼즐매치_PKGE_1674097468279.zip" ]; then
  echo "[SKIP] 퍼즐매치_PKGE_1674097468279.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [36/158] 퍼즐매치_PKGE_1674097468279.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/퍼즐매치_PKGE_1674097468279.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11752270453874936.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 퍼즐매치_PKGE_1674097468279.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [37/158] 애니멀런
if [ -f "$BASE/2D/애니멀런_PKGE_1674096662755.zip" ]; then
  echo "[SKIP] 애니멀런_PKGE_1674096662755.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [37/158] 애니멀런_PKGE_1674096662755.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/애니멀런_PKGE_1674096662755.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11751461390217787.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 애니멀런_PKGE_1674096662755.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [38/158] cooking house
if [ -f "$BASE/2D/cooking_house_PKGE_1674031488662.zip" ]; then
  echo "[SKIP] cooking_house_PKGE_1674031488662.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [38/158] cooking_house_PKGE_1674031488662.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/cooking_house_PKGE_1674031488662.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11750871003905088.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] cooking_house_PKGE_1674031488662.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [39/158] 무한 성장 스토리
if [ -f "$BASE/2D/무한_성장_스토리_PKGE_1674031235753.zip" ]; then
  echo "[SKIP] 무한_성장_스토리_PKGE_1674031235753.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [39/158] 무한_성장_스토리_PKGE_1674031235753.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/무한_성장_스토리_PKGE_1674031235753.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11750655235840970.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 무한_성장_스토리_PKGE_1674031235753.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [40/158] 느긋하고 싶었던 나의 농장생활
if [ -f "$BASE/2D/느긋하고_싶었던_나의_농장생활_PKGE_1674030987818.zip" ]; then
  echo "[SKIP] 느긋하고_싶었던_나의_농장생활_PKGE_1674030987818.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [40/158] 느긋하고_싶었던_나의_농장생활_PKGE_1674030987818.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/느긋하고_싶었던_나의_농장생활_PKGE_1674030987818.zip" "https://gamemadang.or.kr/upload/pkge/pkge_55631807392318987.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 느긋하고_싶었던_나의_농장생활_PKGE_1674030987818.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [41/158] 캠퍼스 로맨스 라이프
if [ -f "$BASE/2D/캠퍼스_로맨스_라이프_PKGE_1674030465959.zip" ]; then
  echo "[SKIP] 캠퍼스_로맨스_라이프_PKGE_1674030465959.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [41/158] 캠퍼스_로맨스_라이프_PKGE_1674030465959.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/캠퍼스_로맨스_라이프_PKGE_1674030465959.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12290016812527146.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 캠퍼스_로맨스_라이프_PKGE_1674030465959.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [42/158] 서울이스케이프
if [ -f "$BASE/2D/서울이스케이프_PKGE_1674029795764.zip" ]; then
  echo "[SKIP] 서울이스케이프_PKGE_1674029795764.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [42/158] 서울이스케이프_PKGE_1674029795764.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/서울이스케이프_PKGE_1674029795764.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12273394429296588.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 서울이스케이프_PKGE_1674029795764.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [43/158] 아이엠 디펜스
if [ -f "$BASE/2D/아이엠_디펜스_PKGE_1674020174541.zip" ]; then
  echo "[SKIP] 아이엠_디펜스_PKGE_1674020174541.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [43/158] 아이엠_디펜스_PKGE_1674020174541.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/아이엠_디펜스_PKGE_1674020174541.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11750175090497204.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 아이엠_디펜스_PKGE_1674020174541.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [44/158] 워라하
if [ -f "$BASE/2D/워라하_PKGE_1673922401407.zip" ]; then
  echo "[SKIP] 워라하_PKGE_1673922401407.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [44/158] 워라하_PKGE_1673922401407.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/워라하_PKGE_1673922401407.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11577126002342002.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 워라하_PKGE_1673922401407.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [45/158] King of Quiz
if [ -f "$BASE/2D/King_of_Quiz_PKGE_1673916041723.zip" ]; then
  echo "[SKIP] King_of_Quiz_PKGE_1673916041723.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [45/158] King_of_Quiz_PKGE_1673916041723.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/King_of_Quiz_PKGE_1673916041723.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11570766818613952.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] King_of_Quiz_PKGE_1673916041723.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [46/158] Action Kids
if [ -f "$BASE/2D/Action_Kids_PKGE_1673915495498.zip" ]; then
  echo "[SKIP] Action_Kids_PKGE_1673915495498.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [46/158] Action_Kids_PKGE_1673915495498.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Action_Kids_PKGE_1673915495498.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11570221165381244.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Action_Kids_PKGE_1673915495498.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [47/158] 베지파밍팝
if [ -f "$BASE/2D/베지파밍팝_PKGE_1673851787034.zip" ]; then
  echo "[SKIP] 베지파밍팝_PKGE_1673851787034.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [47/158] 베지파밍팝_PKGE_1673851787034.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/베지파밍팝_PKGE_1673851787034.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11506591490888006.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 베지파밍팝_PKGE_1673851787034.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [48/158] 포테이두치
if [ -f "$BASE/2D/포테이두치_PKGE_1673847236465.zip" ]; then
  echo "[SKIP] 포테이두치_PKGE_1673847236465.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [48/158] 포테이두치_PKGE_1673847236465.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/포테이두치_PKGE_1673847236465.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11502040092041967.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 포테이두치_PKGE_1673847236465.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [49/158] 보스러쉬 히어로즈
if [ -f "$BASE/2D/보스러쉬_히어로즈_PKGE_1673833705410.zip" ]; then
  echo "[SKIP] 보스러쉬_히어로즈_PKGE_1673833705410.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [49/158] 보스러쉬_히어로즈_PKGE_1673833705410.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/보스러쉬_히어로즈_PKGE_1673833705410.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12271717005689620.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 보스러쉬_히어로즈_PKGE_1673833705410.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [50/158] 몽글이의 여정
if [ -f "$BASE/2D/몽글이의_여정_PKGE_1673830922153.zip" ]; then
  echo "[SKIP] 몽글이의_여정_PKGE_1673830922153.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [50/158] 몽글이의_여정_PKGE_1673830922153.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/몽글이의_여정_PKGE_1673830922153.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11485725562181920.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 몽글이의_여정_PKGE_1673830922153.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi
echo "=== Progress: 50/158 done=$DONE skip=$SKIP fail=$FAIL ===" >> "$LOG"

# [51/158] 샌드레이더
if [ -f "$BASE/2D/샌드레이더_PKGE_1673829252179.zip" ]; then
  echo "[SKIP] 샌드레이더_PKGE_1673829252179.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [51/158] 샌드레이더_PKGE_1673829252179.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/샌드레이더_PKGE_1673829252179.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11484051882514054.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 샌드레이더_PKGE_1673829252179.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [52/158] 몬스터태그
if [ -f "$BASE/2D/몬스터태그_PKGE_1673491083565.zip" ]; then
  echo "[SKIP] 몬스터태그_PKGE_1673491083565.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [52/158] 몬스터태그_PKGE_1673491083565.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/몬스터태그_PKGE_1673491083565.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11145888241299277.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 몬스터태그_PKGE_1673491083565.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [53/158] 그리다만 녀석들
if [ -f "$BASE/2D/그리다만_녀석들_PKGE_1673490498160.zip" ]; then
  echo "[SKIP] 그리다만_녀석들_PKGE_1673490498160.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [53/158] 그리다만_녀석들_PKGE_1673490498160.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/그리다만_녀석들_PKGE_1673490498160.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12271448768935727.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 그리다만_녀석들_PKGE_1673490498160.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [54/158] Tap Tap Pets
if [ -f "$BASE/2D/Tap_Tap_Pets_PKGE_1673401328048.zip" ]; then
  echo "[SKIP] Tap_Tap_Pets_PKGE_1673401328048.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [54/158] Tap_Tap_Pets_PKGE_1673401328048.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Tap_Tap_Pets_PKGE_1673401328048.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11056094114329453.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Tap_Tap_Pets_PKGE_1673401328048.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [55/158] Galaxy Jump
if [ -f "$BASE/2D/Galaxy_Jump_PKGE_1673400303889.zip" ]; then
  echo "[SKIP] Galaxy_Jump_PKGE_1673400303889.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [55/158] Galaxy_Jump_PKGE_1673400303889.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Galaxy_Jump_PKGE_1673400303889.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11055036498203783.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Galaxy_Jump_PKGE_1673400303889.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [56/158] 애니멀카페 외 1종
if [ -f "$BASE/2D/애니멀카페_외_1종_PKGE_1673326386272.zip" ]; then
  echo "[SKIP] 애니멀카페_외_1종_PKGE_1673326386272.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [56/158] 애니멀카페_외_1종_PKGE_1673326386272.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/애니멀카페_외_1종_PKGE_1673326386272.zip" "https://gamemadang.or.kr/upload/pkge/pkge_10981119910208710.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 애니멀카페_외_1종_PKGE_1673326386272.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [57/158] 싸이버펑크
if [ -f "$BASE/2D/싸이버펑크_PKGE_1672984304051.zip" ]; then
  echo "[SKIP] 싸이버펑크_PKGE_1672984304051.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [57/158] 싸이버펑크_PKGE_1672984304051.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/싸이버펑크_PKGE_1672984304051.zip" "https://gamemadang.or.kr/upload/pkge/pkge_10644600227912741.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 싸이버펑크_PKGE_1672984304051.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [58/158] 잘못 열린 세계 외 1종
if [ -f "$BASE/2D/잘못_열린_세계_외_1종_PKGE_1672880181244.zip" ]; then
  echo "[SKIP] 잘못_열린_세계_외_1종_PKGE_1672880181244.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [58/158] 잘못_열린_세계_외_1종_PKGE_1672880181244.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/잘못_열린_세계_외_1종_PKGE_1672880181244.zip" "https://gamemadang.or.kr/upload/pkge/pkge_10636292159766887.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 잘못_열린_세계_외_1종_PKGE_1672880181244.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [59/158] 프로젝트S1
if [ -f "$BASE/2D/프로젝트S1_PKGE_1672813282298.zip" ]; then
  echo "[SKIP] 프로젝트S1_PKGE_1672813282298.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [59/158] 프로젝트S1_PKGE_1672813282298.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/프로젝트S1_PKGE_1672813282298.zip" "https://gamemadang.or.kr/upload/pkge/pkge_10551145880683188.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 프로젝트S1_PKGE_1672813282298.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [60/158] 아카펠라즈
if [ -f "$BASE/2D/아카펠라즈_PKGE_1672714021290.zip" ]; then
  echo "[SKIP] 아카펠라즈_PKGE_1672714021290.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [60/158] 아카펠라즈_PKGE_1672714021290.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/아카펠라즈_PKGE_1672714021290.zip" "https://gamemadang.or.kr/upload/pkge/pkge_10368756073693426.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 아카펠라즈_PKGE_1672714021290.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [61/158] 비주얼노벨
if [ -f "$BASE/2D/비주얼노벨_PKGE_1672635363868.zip" ]; then
  echo "[SKIP] 비주얼노벨_PKGE_1672635363868.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [61/158] 비주얼노벨_PKGE_1672635363868.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/비주얼노벨_PKGE_1672635363868.zip" "https://gamemadang.or.kr/upload/pkge/pkge_10290093111552186.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 비주얼노벨_PKGE_1672635363868.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [62/158] 프로젝트S2
if [ -f "$BASE/2D/프로젝트S2_PKGE_1648710855932.zip" ]; then
  echo "[SKIP] 프로젝트S2_PKGE_1648710855932.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [62/158] 프로젝트S2_PKGE_1648710855932.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/프로젝트S2_PKGE_1648710855932.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1163988307651637.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 프로젝트S2_PKGE_1648710855932.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [63/158] 장미를 찾아서 외 1종
if [ -f "$BASE/2D/장미를_찾아서_외_1종_PKGE_1648710701256.zip" ]; then
  echo "[SKIP] 장미를_찾아서_외_1종_PKGE_1648710701256.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [63/158] 장미를_찾아서_외_1종_PKGE_1648710701256.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/장미를_찾아서_외_1종_PKGE_1648710701256.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1163837064668079.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 장미를_찾아서_외_1종_PKGE_1648710701256.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [64/158] 퐁이의 과일왕국
if [ -f "$BASE/2D/퐁이의_과일왕국_PKGE_1648710492758.zip" ]; then
  echo "[SKIP] 퐁이의_과일왕국_PKGE_1648710492758.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [64/158] 퐁이의_과일왕국_PKGE_1648710492758.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/퐁이의_과일왕국_PKGE_1648710492758.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1163557788034693.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 퐁이의_과일왕국_PKGE_1648710492758.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [65/158] 쿠키프랜즈 외 1종
if [ -f "$BASE/2D/쿠키프랜즈_외_1종_PKGE_1648710348597.zip" ]; then
  echo "[SKIP] 쿠키프랜즈_외_1종_PKGE_1648710348597.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [65/158] 쿠키프랜즈_외_1종_PKGE_1648710348597.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/쿠키프랜즈_외_1종_PKGE_1648710348597.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1163270028607285.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 쿠키프랜즈_외_1종_PKGE_1648710348597.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [66/158] 고스트헌터
if [ -f "$BASE/2D/고스트헌터_PKGE_1648710263396.zip" ]; then
  echo "[SKIP] 고스트헌터_PKGE_1648710263396.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [66/158] 고스트헌터_PKGE_1648710263396.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/고스트헌터_PKGE_1648710263396.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1162840744773661.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 고스트헌터_PKGE_1648710263396.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [67/158] 배틀 디바이더
if [ -f "$BASE/2D/배틀_디바이더_PKGE_1648710125107.zip" ]; then
  echo "[SKIP] 배틀_디바이더_PKGE_1648710125107.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [67/158] 배틀_디바이더_PKGE_1648710125107.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/배틀_디바이더_PKGE_1648710125107.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1160223517667719.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 배틀_디바이더_PKGE_1648710125107.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [68/158] 다함께 퍼즐아케이드
if [ -f "$BASE/2D/다함께_퍼즐아케이드_PKGE_1648709986453.zip" ]; then
  echo "[SKIP] 다함께_퍼즐아케이드_PKGE_1648709986453.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [68/158] 다함께_퍼즐아케이드_PKGE_1648709986453.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/다함께_퍼즐아케이드_PKGE_1648709986453.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1159967741765990.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 다함께_퍼즐아케이드_PKGE_1648709986453.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [69/158] 모아모아 보드카드팡
if [ -f "$BASE/2D/모아모아_보드카드팡_PKGE_1648709854007.zip" ]; then
  echo "[SKIP] 모아모아_보드카드팡_PKGE_1648709854007.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [69/158] 모아모아_보드카드팡_PKGE_1648709854007.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/모아모아_보드카드팡_PKGE_1648709854007.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1160900037517889.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 모아모아_보드카드팡_PKGE_1648709854007.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [70/158] 이세계 연애시뮬레이션
if [ -f "$BASE/2D/이세계_연애시뮬레이션_PKGE_1648709736252.zip" ]; then
  echo "[SKIP] 이세계_연애시뮬레이션_PKGE_1648709736252.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [70/158] 이세계_연애시뮬레이션_PKGE_1648709736252.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/이세계_연애시뮬레이션_PKGE_1648709736252.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11665860977336785.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 이세계_연애시뮬레이션_PKGE_1648709736252.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [71/158] 매지컬 쿠키랜드
if [ -f "$BASE/2D/매지컬_쿠키랜드_PKGE_1648709596665.zip" ]; then
  echo "[SKIP] 매지컬_쿠키랜드_PKGE_1648709596665.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [71/158] 매지컬_쿠키랜드_PKGE_1648709596665.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/매지컬_쿠키랜드_PKGE_1648709596665.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1100428385475948.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 매지컬_쿠키랜드_PKGE_1648709596665.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [72/158] 만랩영웅키우기 마검사편
if [ -f "$BASE/2D/만랩영웅키우기_마검사편_PKGE_1648709467620.zip" ]; then
  echo "[SKIP] 만랩영웅키우기_마검사편_PKGE_1648709467620.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [72/158] 만랩영웅키우기_마검사편_PKGE_1648709467620.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/만랩영웅키우기_마검사편_PKGE_1648709467620.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1092297855577577.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 만랩영웅키우기_마검사편_PKGE_1648709467620.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [73/158] 아기돼지 길찾기 대모험 외 2종
if [ -f "$BASE/2D/아기돼지_길찾기_대모험_외_2종_PKGE_1648709354951.zip" ]; then
  echo "[SKIP] 아기돼지_길찾기_대모험_외_2종_PKGE_1648709354951.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [73/158] 아기돼지_길찾기_대모험_외_2종_PKGE_1648709354951.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/아기돼지_길찾기_대모험_외_2종_PKGE_1648709354951.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1091749344176155.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 아기돼지_길찾기_대모험_외_2종_PKGE_1648709354951.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [74/158] 도시만들기 퍼즐
if [ -f "$BASE/2D/도시만들기_퍼즐_PKGE_1648709234512.zip" ]; then
  echo "[SKIP] 도시만들기_퍼즐_PKGE_1648709234512.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [74/158] 도시만들기_퍼즐_PKGE_1648709234512.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/도시만들기_퍼즐_PKGE_1648709234512.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1091086373260793.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 도시만들기_퍼즐_PKGE_1648709234512.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [75/158] 갤럭시 디펜더
if [ -f "$BASE/2D/갤럭시_디펜더_PKGE_1648709123166.zip" ]; then
  echo "[SKIP] 갤럭시_디펜더_PKGE_1648709123166.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [75/158] 갤럭시_디펜더_PKGE_1648709123166.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/갤럭시_디펜더_PKGE_1648709123166.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1090550638419930.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 갤럭시_디펜더_PKGE_1648709123166.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [76/158] 우가차차
if [ -f "$BASE/2D/우가차차_PKGE_1648709000351.zip" ]; then
  echo "[SKIP] 우가차차_PKGE_1648709000351.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [76/158] 우가차차_PKGE_1648709000351.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/우가차차_PKGE_1648709000351.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1090349346211861.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 우가차차_PKGE_1648709000351.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [77/158] 말랑콩떡
if [ -f "$BASE/2D/말랑콩떡_PKGE_1648708891486.zip" ]; then
  echo "[SKIP] 말랑콩떡_PKGE_1648708891486.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [77/158] 말랑콩떡_PKGE_1648708891486.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/말랑콩떡_PKGE_1648708891486.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1089452144557706.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 말랑콩떡_PKGE_1648708891486.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [78/158] Moon Slasher 외 1종
if [ -f "$BASE/2D/Moon_Slasher_외_1종_PKGE_1648708763195.zip" ]; then
  echo "[SKIP] Moon_Slasher_외_1종_PKGE_1648708763195.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [78/158] Moon_Slasher_외_1종_PKGE_1648708763195.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Moon_Slasher_외_1종_PKGE_1648708763195.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1007150141944557.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Moon_Slasher_외_1종_PKGE_1648708763195.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [79/158] 과탑혈투
if [ -f "$BASE/2D/과탑혈투_PKGE_1648708659714.zip" ]; then
  echo "[SKIP] 과탑혈투_PKGE_1648708659714.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [79/158] 과탑혈투_PKGE_1648708659714.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/과탑혈투_PKGE_1648708659714.zip" "https://gamemadang.or.kr/upload/pkge/pkge_996546353292123.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 과탑혈투_PKGE_1648708659714.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [80/158] 할짝원정대
if [ -f "$BASE/2D/할짝원정대_PKGE_1648708559216.zip" ]; then
  echo "[SKIP] 할짝원정대_PKGE_1648708559216.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [80/158] 할짝원정대_PKGE_1648708559216.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/할짝원정대_PKGE_1648708559216.zip" "https://gamemadang.or.kr/upload/pkge/pkge_995093404368190.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 할짝원정대_PKGE_1648708559216.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [81/158] 피해라 폭탄
if [ -f "$BASE/2D/피해라_폭탄_PKGE_1648708439153.zip" ]; then
  echo "[SKIP] 피해라_폭탄_PKGE_1648708439153.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [81/158] 피해라_폭탄_PKGE_1648708439153.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/피해라_폭탄_PKGE_1648708439153.zip" "https://gamemadang.or.kr/upload/pkge/pkge_734679005349020.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 피해라_폭탄_PKGE_1648708439153.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [82/158] 슈퍼 갤럭시 마라톤
if [ -f "$BASE/2D/슈퍼_갤럭시_마라톤_PKGE_1648708336332.zip" ]; then
  echo "[SKIP] 슈퍼_갤럭시_마라톤_PKGE_1648708336332.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [82/158] 슈퍼_갤럭시_마라톤_PKGE_1648708336332.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/슈퍼_갤럭시_마라톤_PKGE_1648708336332.zip" "https://gamemadang.or.kr/upload/pkge/pkge_734296608937836.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 슈퍼_갤럭시_마라톤_PKGE_1648708336332.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [83/158] 쿱카드
if [ -f "$BASE/2D/쿱카드_PKGE_1648708216172.zip" ]; then
  echo "[SKIP] 쿱카드_PKGE_1648708216172.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [83/158] 쿱카드_PKGE_1648708216172.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/쿱카드_PKGE_1648708216172.zip" "https://gamemadang.or.kr/upload/pkge/pkge_732628716909779.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 쿱카드_PKGE_1648708216172.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [84/158] 절대무적! 이동요새!
if [ -f "$BASE/2D/절대무적!_이동요새!_PKGE_1648707975320.zip" ]; then
  echo "[SKIP] 절대무적!_이동요새!_PKGE_1648707975320.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [84/158] 절대무적!_이동요새!_PKGE_1648707975320.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/절대무적!_이동요새!_PKGE_1648707975320.zip" "https://gamemadang.or.kr/upload/pkge/pkge_10987319014300964.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 절대무적!_이동요새!_PKGE_1648707975320.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [85/158] DNA HUNTER
if [ -f "$BASE/2D/DNA_HUNTER_PKGE_1648707851005.zip" ]; then
  echo "[SKIP] DNA_HUNTER_PKGE_1648707851005.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [85/158] DNA_HUNTER_PKGE_1648707851005.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/DNA_HUNTER_PKGE_1648707851005.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12271814763038034.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] DNA_HUNTER_PKGE_1648707851005.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [86/158] MEGA TOWN
if [ -f "$BASE/2D/MEGA_TOWN_PKGE_1648707709183.zip" ]; then
  echo "[SKIP] MEGA_TOWN_PKGE_1648707709183.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [86/158] MEGA_TOWN_PKGE_1648707709183.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/MEGA_TOWN_PKGE_1648707709183.zip" "https://gamemadang.or.kr/upload/pkge/pkge_12271308102359362.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] MEGA_TOWN_PKGE_1648707709183.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [87/158] 포켓홀덤
if [ -f "$BASE/2D/포켓홀덤_PKGE_1648707342287.zip" ]; then
  echo "[SKIP] 포켓홀덤_PKGE_1648707342287.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [87/158] 포켓홀덤_PKGE_1648707342287.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/포켓홀덤_PKGE_1648707342287.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1268772407122139.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 포켓홀덤_PKGE_1648707342287.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [88/158] PIXEL JONES
if [ -f "$BASE/2D/PIXEL_JONES_PKGE_1648707236344.zip" ]; then
  echo "[SKIP] PIXEL_JONES_PKGE_1648707236344.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [88/158] PIXEL_JONES_PKGE_1648707236344.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/PIXEL_JONES_PKGE_1648707236344.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1269487527112285.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] PIXEL_JONES_PKGE_1648707236344.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [89/158] Hunters
if [ -f "$BASE/2D/Hunters_PKGE_1648707132658.zip" ]; then
  echo "[SKIP] Hunters_PKGE_1648707132658.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [89/158] Hunters_PKGE_1648707132658.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Hunters_PKGE_1648707132658.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1269377821060834.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Hunters_PKGE_1648707132658.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [90/158] 하이퍼캐주얼 8종
if [ -f "$BASE/2D/하이퍼캐주얼_8종_PKGE_1648706842501.zip" ]; then
  echo "[SKIP] 하이퍼캐주얼_8종_PKGE_1648706842501.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [90/158] 하이퍼캐주얼_8종_PKGE_1648706842501.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/하이퍼캐주얼_8종_PKGE_1648706842501.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1268809862478159.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 하이퍼캐주얼_8종_PKGE_1648706842501.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [91/158] 맞고
if [ -f "$BASE/2D/맞고_PKGE_1648706711251.zip" ]; then
  echo "[SKIP] 맞고_PKGE_1648706711251.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [91/158] 맞고_PKGE_1648706711251.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/맞고_PKGE_1648706711251.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1270445908323016.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 맞고_PKGE_1648706711251.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [92/158] 건물부수기
if [ -f "$BASE/2D/건물부수기_PKGE_1648706592091.zip" ]; then
  echo "[SKIP] 건물부수기_PKGE_1648706592091.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [92/158] 건물부수기_PKGE_1648706592091.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/건물부수기_PKGE_1648706592091.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1270472681434883.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 건물부수기_PKGE_1648706592091.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [93/158] 전국대난무
if [ -f "$BASE/2D/전국대난무_PKGE_1648706464838.zip" ]; then
  echo "[SKIP] 전국대난무_PKGE_1648706464838.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [93/158] 전국대난무_PKGE_1648706464838.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/전국대난무_PKGE_1648706464838.zip" "https://gamemadang.or.kr/upload/pkge/pkge_56424085859999.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 전국대난무_PKGE_1648706464838.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [94/158] 어이쿵
if [ -f "$BASE/2D/어이쿵_PKGE_1648706327176.zip" ]; then
  echo "[SKIP] 어이쿵_PKGE_1648706327176.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [94/158] 어이쿵_PKGE_1648706327176.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/어이쿵_PKGE_1648706327176.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1272301837935636.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 어이쿵_PKGE_1648706327176.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [95/158] 캔디코스터
if [ -f "$BASE/2D/캔디코스터_PKGE_1648706179921.zip" ]; then
  echo "[SKIP] 캔디코스터_PKGE_1648706179921.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [95/158] 캔디코스터_PKGE_1648706179921.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/캔디코스터_PKGE_1648706179921.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1263529350631923.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 캔디코스터_PKGE_1648706179921.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [96/158] 빨간마후라
if [ -f "$BASE/2D/빨간마후라_PKGE_1648706054637.zip" ]; then
  echo "[SKIP] 빨간마후라_PKGE_1648706054637.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [96/158] 빨간마후라_PKGE_1648706054637.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/빨간마후라_PKGE_1648706054637.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1262738859150012.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 빨간마후라_PKGE_1648706054637.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [97/158] 쥬라기 빌리지
if [ -f "$BASE/2D/쥬라기_빌리지_PKGE_1648705918626.zip" ]; then
  echo "[SKIP] 쥬라기_빌리지_PKGE_1648705918626.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [97/158] 쥬라기_빌리지_PKGE_1648705918626.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/쥬라기_빌리지_PKGE_1648705918626.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1261630760658621.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 쥬라기_빌리지_PKGE_1648705918626.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [98/158] 프랑켄슈타인
if [ -f "$BASE/2D/프랑켄슈타인_PKGE_1648705770261.zip" ]; then
  echo "[SKIP] 프랑켄슈타인_PKGE_1648705770261.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [98/158] 프랑켄슈타인_PKGE_1648705770261.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/프랑켄슈타인_PKGE_1648705770261.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1354436755331583.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 프랑켄슈타인_PKGE_1648705770261.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [99/158] 숨겨진방의 비밀
if [ -f "$BASE/2D/숨겨진방의_비밀_PKGE_1648705358538.zip" ]; then
  echo "[SKIP] 숨겨진방의_비밀_PKGE_1648705358538.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [99/158] 숨겨진방의_비밀_PKGE_1648705358538.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/숨겨진방의_비밀_PKGE_1648705358538.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1273324757303322.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 숨겨진방의_비밀_PKGE_1648705358538.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [100/158] 마족키우기 외 2종
if [ -f "$BASE/2D/마족키우기_외_2종_PKGE_1648705182138.zip" ]; then
  echo "[SKIP] 마족키우기_외_2종_PKGE_1648705182138.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [100/158] 마족키우기_외_2종_PKGE_1648705182138.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/마족키우기_외_2종_PKGE_1648705182138.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1274564911819534.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 마족키우기_외_2종_PKGE_1648705182138.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi
echo "=== Progress: 100/158 done=$DONE skip=$SKIP fail=$FAIL ===" >> "$LOG"

# [101/158] 괴력난신
if [ -f "$BASE/2D/괴력난신_PKGE_1648704435545.zip" ]; then
  echo "[SKIP] 괴력난신_PKGE_1648704435545.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [101/158] 괴력난신_PKGE_1648704435545.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/괴력난신_PKGE_1648704435545.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1358314722514717.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 괴력난신_PKGE_1648704435545.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [102/158] 프로젝트 B
if [ -f "$BASE/2D/프로젝트_B_PKGE_1648704302940.zip" ]; then
  echo "[SKIP] 프로젝트_B_PKGE_1648704302940.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [102/158] 프로젝트_B_PKGE_1648704302940.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/프로젝트_B_PKGE_1648704302940.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1360458463645105.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 프로젝트_B_PKGE_1648704302940.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [103/158] 엔진 액션러닝
if [ -f "$BASE/2D/엔진_액션러닝_PKGE_1648704192467.zip" ]; then
  echo "[SKIP] 엔진_액션러닝_PKGE_1648704192467.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [103/158] 엔진_액션러닝_PKGE_1648704192467.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/엔진_액션러닝_PKGE_1648704192467.zip" "https://gamemadang.or.kr/upload/pkge/pkge_11665777872642482.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 엔진_액션러닝_PKGE_1648704192467.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [104/158] 코즈믹 온라인
if [ -f "$BASE/2D/코즈믹_온라인_PKGE_1648703904003.zip" ]; then
  echo "[SKIP] 코즈믹_온라인_PKGE_1648703904003.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [104/158] 코즈믹_온라인_PKGE_1648703904003.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/코즈믹_온라인_PKGE_1648703904003.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1338080607249516.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 코즈믹_온라인_PKGE_1648703904003.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [105/158] 마이주
if [ -f "$BASE/2D/마이주_PKGE_1624355308351.zip" ]; then
  echo "[SKIP] 마이주_PKGE_1624355308351.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [105/158] 마이주_PKGE_1624355308351.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/마이주_PKGE_1624355308351.zip" "https://gamemadang.or.kr/upload/pkge/pkge_7021889016241237.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 마이주_PKGE_1624355308351.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [106/158] 땅파봐라 돈나오나
if [ -f "$BASE/2D/땅파봐라_돈나오나_PKGE_1624355055206.zip" ]; then
  echo "[SKIP] 땅파봐라_돈나오나_PKGE_1624355055206.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [106/158] 땅파봐라_돈나오나_PKGE_1624355055206.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/땅파봐라_돈나오나_PKGE_1624355055206.zip" "https://gamemadang.or.kr/upload/pkge/pkge_7021634006480672.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 땅파봐라_돈나오나_PKGE_1624355055206.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [107/158] 애니멀 하우스
if [ -f "$BASE/2D/애니멀_하우스_PKGE_1624354733821.zip" ]; then
  echo "[SKIP] 애니멀_하우스_PKGE_1624354733821.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [107/158] 애니멀_하우스_PKGE_1624354733821.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/애니멀_하우스_PKGE_1624354733821.zip" "https://gamemadang.or.kr/upload/pkge/pkge_7021308277632412.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 애니멀_하우스_PKGE_1624354733821.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [108/158] 악마VS기사
if [ -f "$BASE/2D/악마VS기사_PKGE_1624354205697.zip" ]; then
  echo "[SKIP] 악마VS기사_PKGE_1624354205697.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [108/158] 악마VS기사_PKGE_1624354205697.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/악마VS기사_PKGE_1624354205697.zip" "https://gamemadang.or.kr/upload/pkge/pkge_7020788496676231.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 악마VS기사_PKGE_1624354205697.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [109/158] 캐주얼 5종
if [ -f "$BASE/2D/캐주얼_5종_PKGE_1618824235914.zip" ]; then
  echo "[SKIP] 캐주얼_5종_PKGE_1618824235914.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [109/158] 캐주얼_5종_PKGE_1618824235914.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/캐주얼_5종_PKGE_1618824235914.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1490812599161631.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 캐주얼_5종_PKGE_1618824235914.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [110/158] 공주의 탑
if [ -f "$BASE/2D/공주의_탑_PKGE_1618823848921.zip" ]; then
  echo "[SKIP] 공주의_탑_PKGE_1618823848921.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [110/158] 공주의_탑_PKGE_1618823848921.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/공주의_탑_PKGE_1618823848921.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1490395353782952.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 공주의_탑_PKGE_1618823848921.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [111/158] 건슬링거
if [ -f "$BASE/2D/건슬링거_PKGE_1618823016883.zip" ]; then
  echo "[SKIP] 건슬링거_PKGE_1618823016883.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [111/158] 건슬링거_PKGE_1618823016883.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/건슬링거_PKGE_1618823016883.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1489585587563425.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 건슬링거_PKGE_1618823016883.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [112/158] 신세계 외
if [ -f "$BASE/2D/신세계_외_PKGE_1618817405652.zip" ]; then
  echo "[SKIP] 신세계_외_PKGE_1618817405652.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [112/158] 신세계_외_PKGE_1618817405652.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/신세계_외_PKGE_1618817405652.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1483987525217742.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 신세계_외_PKGE_1618817405652.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [113/158] 진짜사나이
if [ -f "$BASE/2D/진짜사나이_PKGE_1618565850405.zip" ]; then
  echo "[SKIP] 진짜사나이_PKGE_1618565850405.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [113/158] 진짜사나이_PKGE_1618565850405.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/진짜사나이_PKGE_1618565850405.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1232421861415481.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 진짜사나이_PKGE_1618565850405.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [114/158] 데몬스트라이크
if [ -f "$BASE/2D/데몬스트라이크_PKGE_1618564262850.zip" ]; then
  echo "[SKIP] 데몬스트라이크_PKGE_1618564262850.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [114/158] 데몬스트라이크_PKGE_1618564262850.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/데몬스트라이크_PKGE_1618564262850.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1230833388172471.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 데몬스트라이크_PKGE_1618564262850.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [115/158] 던전리그
if [ -f "$BASE/2D/던전리그_PKGE_1618563688729.zip" ]; then
  echo "[SKIP] 던전리그_PKGE_1618563688729.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [115/158] 던전리그_PKGE_1618563688729.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/던전리그_PKGE_1618563688729.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1230270877234504.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 던전리그_PKGE_1618563688729.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [116/158] 오늘이
if [ -f "$BASE/2D/오늘이_PKGE_1618563384245.zip" ]; then
  echo "[SKIP] 오늘이_PKGE_1618563384245.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [116/158] 오늘이_PKGE_1618563384245.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/오늘이_PKGE_1618563384245.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1229964869734359.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 오늘이_PKGE_1618563384245.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [117/158] 고양이밴드
if [ -f "$BASE/2D/고양이밴드_PKGE_1617688952333.zip" ]; then
  echo "[SKIP] 고양이밴드_PKGE_1617688952333.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [117/158] 고양이밴드_PKGE_1617688952333.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/고양이밴드_PKGE_1617688952333.zip" "https://gamemadang.or.kr/upload/pkge/pkge_355526904570438.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 고양이밴드_PKGE_1617688952333.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [118/158] 2D 그라운드
if [ -f "$BASE/2D/2D_그라운드_PKGE_1617611650742.zip" ]; then
  echo "[SKIP] 2D_그라운드_PKGE_1617611650742.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [118/158] 2D_그라운드_PKGE_1617611650742.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/2D_그라운드_PKGE_1617611650742.zip" "https://gamemadang.or.kr/upload/pkge/pkge_278215232029783.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 2D_그라운드_PKGE_1617611650742.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [119/158] 굴려라굴려구르르 외
if [ -f "$BASE/2D/굴려라굴려구르르_외_PKGE_1617610923732.zip" ]; then
  echo "[SKIP] 굴려라굴려구르르_외_PKGE_1617610923732.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [119/158] 굴려라굴려구르르_외_PKGE_1617610923732.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/굴려라굴려구르르_외_PKGE_1617610923732.zip" "https://gamemadang.or.kr/upload/pkge/pkge_277499261239547.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 굴려라굴려구르르_외_PKGE_1617610923732.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [120/158] 프린세스 시월드
if [ -f "$BASE/2D/프린세스_시월드_PKGE_1617610644737.zip" ]; then
  echo "[SKIP] 프린세스_시월드_PKGE_1617610644737.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [120/158] 프린세스_시월드_PKGE_1617610644737.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/프린세스_시월드_PKGE_1617610644737.zip" "https://gamemadang.or.kr/upload/pkge/pkge_277216363176861.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 프린세스_시월드_PKGE_1617610644737.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [121/158] 커피샷
if [ -f "$BASE/2D/커피샷_PKGE_1617610335724.zip" ]; then
  echo "[SKIP] 커피샷_PKGE_1617610335724.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [121/158] 커피샷_PKGE_1617610335724.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/커피샷_PKGE_1617610335724.zip" "https://gamemadang.or.kr/upload/pkge/pkge_276913513212114.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 커피샷_PKGE_1617610335724.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [122/158] 좀비워
if [ -f "$BASE/2D/좀비워_PKGE_1617094136362.zip" ]; then
  echo "[SKIP] 좀비워_PKGE_1617094136362.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [122/158] 좀비워_PKGE_1617094136362.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/좀비워_PKGE_1617094136362.zip" "https://gamemadang.or.kr/upload/pkge/pkge_3125822126649655.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 좀비워_PKGE_1617094136362.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [123/158] 마이스토어
if [ -f "$BASE/2D/마이스토어_PKGE_1617011637476.zip" ]; then
  echo "[SKIP] 마이스토어_PKGE_1617011637476.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [123/158] 마이스토어_PKGE_1617011637476.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/마이스토어_PKGE_1617011637476.zip" "https://gamemadang.or.kr/upload/pkge/pkge_3043060867908755.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 마이스토어_PKGE_1617011637476.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [124/158] (주)산타&컴퍼니
if [ -f "$BASE/2D/(주)산타&컴퍼니_PKGE_1617010849758.zip" ]; then
  echo "[SKIP] (주)산타&컴퍼니_PKGE_1617010849758.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [124/158] (주)산타&컴퍼니_PKGE_1617010849758.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/(주)산타&컴퍼니_PKGE_1617010849758.zip" "https://gamemadang.or.kr/upload/pkge/pkge_3041853406399898.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] (주)산타&컴퍼니_PKGE_1617010849758.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [125/158] 내 손안의 여자친구
if [ -f "$BASE/2D/내_손안의_여자친구_PKGE_1617010833725.zip" ]; then
  echo "[SKIP] 내_손안의_여자친구_PKGE_1617010833725.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [125/158] 내_손안의_여자친구_PKGE_1617010833725.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/내_손안의_여자친구_PKGE_1617010833725.zip" "https://gamemadang.or.kr/upload/pkge/pkge_3041833001272729.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 내_손안의_여자친구_PKGE_1617010833725.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [126/158] 고양이 학회
if [ -f "$BASE/2D/고양이_학회_PKGE_1617008887496.zip" ]; then
  echo "[SKIP] 고양이_학회_PKGE_1617008887496.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [126/158] 고양이_학회_PKGE_1617008887496.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/고양이_학회_PKGE_1617008887496.zip" "https://gamemadang.or.kr/upload/pkge/pkge_3039878052051538.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 고양이_학회_PKGE_1617008887496.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [127/158] 레스토랑스타
if [ -f "$BASE/2D/레스토랑스타_PKGE_1616469173395.zip" ]; then
  echo "[SKIP] 레스토랑스타_PKGE_1616469173395.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [127/158] 레스토랑스타_PKGE_1616469173395.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/레스토랑스타_PKGE_1616469173395.zip" "https://gamemadang.or.kr/upload/pkge/pkge_2500141476600028.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 레스토랑스타_PKGE_1616469173395.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [128/158] 젤리몬스터온더락
if [ -f "$BASE/2D/젤리몬스터온더락_PKGE_1616409123882.zip" ]; then
  echo "[SKIP] 젤리몬스터온더락_PKGE_1616409123882.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [128/158] 젤리몬스터온더락_PKGE_1616409123882.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/젤리몬스터온더락_PKGE_1616409123882.zip" "https://gamemadang.or.kr/upload/pkge/pkge_2440091057009485.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 젤리몬스터온더락_PKGE_1616409123882.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [129/158] Painting Zoo 외
if [ -f "$BASE/2D/Painting_Zoo_외_PKGE_1616407500389.zip" ]; then
  echo "[SKIP] Painting_Zoo_외_PKGE_1616407500389.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [129/158] Painting_Zoo_외_PKGE_1616407500389.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/Painting_Zoo_외_PKGE_1616407500389.zip" "https://gamemadang.or.kr/upload/pkge/pkge_2438491502770172.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] Painting_Zoo_외_PKGE_1616407500389.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [130/158] 카드오브월드
if [ -f "$BASE/2D/카드오브월드_PKGE_1616406741248.zip" ]; then
  echo "[SKIP] 카드오브월드_PKGE_1616406741248.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [130/158] 카드오브월드_PKGE_1616406741248.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/카드오브월드_PKGE_1616406741248.zip" "https://gamemadang.or.kr/upload/pkge/pkge_2437748149788929.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 카드오브월드_PKGE_1616406741248.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [131/158] 동화특공대
if [ -f "$BASE/2D/동화특공대_PKGE_1616406234207.zip" ]; then
  echo "[SKIP] 동화특공대_PKGE_1616406234207.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [131/158] 동화특공대_PKGE_1616406234207.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/동화특공대_PKGE_1616406234207.zip" "https://gamemadang.or.kr/upload/pkge/pkge_2437235739721722.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 동화특공대_PKGE_1616406234207.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [132/158] 버블히로인
if [ -f "$BASE/2D/버블히로인_PKGE_1615799072721.zip" ]; then
  echo "[SKIP] 버블히로인_PKGE_1615799072721.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [132/158] 버블히로인_PKGE_1615799072721.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/버블히로인_PKGE_1615799072721.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1830078060052162.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 버블히로인_PKGE_1615799072721.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [133/158] 데일리마종 외
if [ -f "$BASE/2D/데일리마종_외_PKGE_1615798813199.zip" ]; then
  echo "[SKIP] 데일리마종_외_PKGE_1615798813199.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [133/158] 데일리마종_외_PKGE_1615798813199.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/데일리마종_외_PKGE_1615798813199.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1829808257742592.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 데일리마종_외_PKGE_1615798813199.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [134/158] 런투파이어 외
if [ -f "$BASE/2D/런투파이어_외_PKGE_1615798208602.zip" ]; then
  echo "[SKIP] 런투파이어_외_PKGE_1615798208602.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [134/158] 런투파이어_외_PKGE_1615798208602.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/런투파이어_외_PKGE_1615798208602.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1829194138806515.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 런투파이어_외_PKGE_1615798208602.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [135/158] 무한더던전
if [ -f "$BASE/2D/무한더던전_PKGE_1615797055686.zip" ]; then
  echo "[SKIP] 무한더던전_PKGE_1615797055686.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [135/158] 무한더던전_PKGE_1615797055686.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/무한더던전_PKGE_1615797055686.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1828060403401362.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 무한더던전_PKGE_1615797055686.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [136/158] 공성대전
if [ -f "$BASE/2D/공성대전_PKGE_1615796639815.zip" ]; then
  echo "[SKIP] 공성대전_PKGE_1615796639815.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [136/158] 공성대전_PKGE_1615796639815.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/공성대전_PKGE_1615796639815.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1827649644046150.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 공성대전_PKGE_1615796639815.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [137/158] 아케인소울
if [ -f "$BASE/2D/아케인소울_PKGE_1615198702916.zip" ]; then
  echo "[SKIP] 아케인소울_PKGE_1615198702916.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [137/158] 아케인소울_PKGE_1615198702916.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/아케인소울_PKGE_1615198702916.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1229710842279681.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 아케인소울_PKGE_1615198702916.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [138/158] WORD TOWN
if [ -f "$BASE/2D/WORD_TOWN_PKGE_1615198115685.zip" ]; then
  echo "[SKIP] WORD_TOWN_PKGE_1615198115685.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [138/158] WORD_TOWN_PKGE_1615198115685.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/WORD_TOWN_PKGE_1615198115685.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1229124767555396.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] WORD_TOWN_PKGE_1615198115685.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [139/158] 코인공주
if [ -f "$BASE/2D/코인공주_PKGE_1615197809002.zip" ]; then
  echo "[SKIP] 코인공주_PKGE_1615197809002.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [139/158] 코인공주_PKGE_1615197809002.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/코인공주_PKGE_1615197809002.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1228819091563600.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 코인공주_PKGE_1615197809002.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [140/158] 로드워
if [ -f "$BASE/2D/로드워_PKGE_1615197360216.zip" ]; then
  echo "[SKIP] 로드워_PKGE_1615197360216.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [140/158] 로드워_PKGE_1615197360216.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/로드워_PKGE_1615197360216.zip" "https://gamemadang.or.kr/upload/pkge/pkge_2506723655674047.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 로드워_PKGE_1615197360216.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [141/158] 도를 아십니까
if [ -f "$BASE/2D/도를_아십니까_PKGE_1615196730600.zip" ]; then
  echo "[SKIP] 도를_아십니까_PKGE_1615196730600.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [141/158] 도를_아십니까_PKGE_1615196730600.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/도를_아십니까_PKGE_1615196730600.zip" "https://gamemadang.or.kr/upload/pkge/pkge_1227740026382974.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 도를_아십니까_PKGE_1615196730600.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [142/158] 탭탭사바나
if [ -f "$BASE/2D/탭탭사바나_PKGE_1614594754675.zip" ]; then
  echo "[SKIP] 탭탭사바나_PKGE_1614594754675.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [142/158] 탭탭사바나_PKGE_1614594754675.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/탭탭사바나_PKGE_1614594754675.zip" "https://gamemadang.or.kr/upload/pkge/pkge_625750942151187.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 탭탭사바나_PKGE_1614594754675.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [143/158] 드릴팡
if [ -f "$BASE/2D/드릴팡_PKGE_1614594091330.zip" ]; then
  echo "[SKIP] 드릴팡_PKGE_1614594091330.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [143/158] 드릴팡_PKGE_1614594091330.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/드릴팡_PKGE_1614594091330.zip" "https://gamemadang.or.kr/upload/pkge/pkge_625098757512109.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 드릴팡_PKGE_1614594091330.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [144/158] 가디언워즈
if [ -f "$BASE/2D/가디언워즈_PKGE_1614593603474.zip" ]; then
  echo "[SKIP] 가디언워즈_PKGE_1614593603474.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [144/158] 가디언워즈_PKGE_1614593603474.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/가디언워즈_PKGE_1614593603474.zip" "https://gamemadang.or.kr/upload/pkge/pkge_624612837048511.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 가디언워즈_PKGE_1614593603474.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [145/158] 플로티벌룬
if [ -f "$BASE/2D/플로티벌룬_PKGE_1613902987850.zip" ]; then
  echo "[SKIP] 플로티벌룬_PKGE_1613902987850.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [145/158] 플로티벌룬_PKGE_1613902987850.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/플로티벌룬_PKGE_1613902987850.zip" "https://gamemadang.or.kr/upload/pkge/pkge_6666093571810.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 플로티벌룬_PKGE_1613902987850.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [146/158] 드워프는 황금을 좋아해
if [ -f "$BASE/2D/드워프는_황금을_좋아해_PKGE_1613901451422.zip" ]; then
  echo "[SKIP] 드워프는_황금을_좋아해_PKGE_1613901451422.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [146/158] 드워프는_황금을_좋아해_PKGE_1613901451422.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/드워프는_황금을_좋아해_PKGE_1613901451422.zip" "https://gamemadang.or.kr/upload/pkge/pkge_17086381178482228.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 드워프는_황금을_좋아해_PKGE_1613901451422.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [147/158] 나이트제로
if [ -f "$BASE/2D/나이트제로_PKGE_1613900922579.zip" ]; then
  echo "[SKIP] 나이트제로_PKGE_1613900922579.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [147/158] 나이트제로_PKGE_1613900922579.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/나이트제로_PKGE_1613900922579.zip" "https://gamemadang.or.kr/upload/pkge/pkge_4619004651009.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 나이트제로_PKGE_1613900922579.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [148/158] 마법소녀
if [ -f "$BASE/2D/마법소녀_PKGE_1613900502165.zip" ]; then
  echo "[SKIP] 마법소녀_PKGE_1613900502165.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [148/158] 마법소녀_PKGE_1613900502165.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/마법소녀_PKGE_1613900502165.zip" "https://gamemadang.or.kr/upload/pkge/pkge_4198664369663.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 마법소녀_PKGE_1613900502165.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [149/158] 좀비심판의 날
if [ -f "$BASE/2D/좀비심판의_날_PKGE_1613900165764.zip" ]; then
  echo "[SKIP] 좀비심판의_날_PKGE_1613900165764.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [149/158] 좀비심판의_날_PKGE_1613900165764.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/좀비심판의_날_PKGE_1613900165764.zip" "https://gamemadang.or.kr/upload/pkge/pkge_3861736805599.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 좀비심판의_날_PKGE_1613900165764.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [150/158] 헐레벌떡 친구들
if [ -f "$BASE/2D/헐레벌떡_친구들_PKGE_1613898884080.zip" ]; then
  echo "[SKIP] 헐레벌떡_친구들_PKGE_1613898884080.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [150/158] 헐레벌떡_친구들_PKGE_1613898884080.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/2D/헐레벌떡_친구들_PKGE_1613898884080.zip" "https://gamemadang.or.kr/upload/pkge/pkge_2580622385405.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 헐레벌떡_친구들_PKGE_1613898884080.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi
echo "=== Progress: 150/158 done=$DONE skip=$SKIP fail=$FAIL ===" >> "$LOG"

# [151/158] 3D_프로젝트1
if [ -f "$BASE/3D/3D_프로젝트1_PKGE_1613906321125.zip" ]; then
  echo "[SKIP] 3D_프로젝트1_PKGE_1613906321125.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [151/158] 3D_프로젝트1_PKGE_1613906321125.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/3D/3D_프로젝트1_PKGE_1613906321125.zip" "https://gamemadang.or.kr/upload/pkge/pkge_10015061153225.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 3D_프로젝트1_PKGE_1613906321125.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [152/158] 3D_프로젝트2
if [ -f "$BASE/3D/3D_프로젝트2_PKGE_1613905894295.zip" ]; then
  echo "[SKIP] 3D_프로젝트2_PKGE_1613905894295.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [152/158] 3D_프로젝트2_PKGE_1613905894295.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/3D/3D_프로젝트2_PKGE_1613905894295.zip" "https://gamemadang.or.kr/upload/pkge/pkge_9586752233955.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 3D_프로젝트2_PKGE_1613905894295.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [153/158] 꿈별몬스터아케이드
if [ -f "$BASE/3D/꿈별몬스터아케이드_PKGE_1706495439129.zip" ]; then
  echo "[SKIP] 꿈별몬스터아케이드_PKGE_1706495439129.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [153/158] 꿈별몬스터아케이드_PKGE_1706495439129.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/3D/꿈별몬스터아케이드_PKGE_1706495439129.zip" "https://gamemadang.or.kr/upload/pkge/pkge_44170051609066223.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 꿈별몬스터아케이드_PKGE_1706495439129.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [154/158] 다운힐마스터즈
if [ -f "$BASE/3D/다운힐마스터즈_PKGE_1706495350704.zip" ]; then
  echo "[SKIP] 다운힐마스터즈_PKGE_1706495350704.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [154/158] 다운힐마스터즈_PKGE_1706495350704.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/3D/다운힐마스터즈_PKGE_1706495350704.zip" "https://gamemadang.or.kr/upload/pkge/pkge_44170302839878633.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 다운힐마스터즈_PKGE_1706495350704.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [155/158] 프로젝트Z
if [ -f "$BASE/3D/프로젝트Z_PKGE_1706495247638.zip" ]; then
  echo "[SKIP] 프로젝트Z_PKGE_1706495247638.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [155/158] 프로젝트Z_PKGE_1706495247638.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/3D/프로젝트Z_PKGE_1706495247638.zip" "https://gamemadang.or.kr/upload/pkge/pkge_44762080178122825.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 프로젝트Z_PKGE_1706495247638.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [156/158] 가디언소울
if [ -f "$BASE/3D/가디언소울_PKGE_1706495137198.zip" ]; then
  echo "[SKIP] 가디언소울_PKGE_1706495137198.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [156/158] 가디언소울_PKGE_1706495137198.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/3D/가디언소울_PKGE_1706495137198.zip" "https://gamemadang.or.kr/upload/pkge/pkge_44761840716173589.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 가디언소울_PKGE_1706495137198.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [157/158] 다크블레이드
if [ -f "$BASE/3D/다크블레이드_PKGE_1706255662420.zip" ]; then
  echo "[SKIP] 다크블레이드_PKGE_1706255662420.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [157/158] 다크블레이드_PKGE_1706255662420.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/3D/다크블레이드_PKGE_1706255662420.zip" "https://gamemadang.or.kr/upload/pkge/pkge_44323157749632619.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 다크블레이드_PKGE_1706255662420.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

# [158/158] 서먼앤스펠
if [ -f "$BASE/3D/서먼앤스펠_PKGE_1706253622317.zip" ]; then
  echo "[SKIP] 서먼앤스펠_PKGE_1706253622317.zip already exists" >> "$LOG"
  SKIP=$((SKIP+1))
else
  echo "[DOWN] [158/158] 서먼앤스펠_PKGE_1706253622317.zip" >> "$LOG"
  wget -q --header="Referer: $REF" --header="Cookie: $COOKIE" --user-agent="$UA" \
    -O "$BASE/3D/서먼앤스펠_PKGE_1706253622317.zip" "https://gamemadang.or.kr/upload/pkge/pkge_44176591161286211.zip" 2>>"$LOG" && DONE=$((DONE+1)) || { echo "[FAIL] 서먼앤스펠_PKGE_1706253622317.zip" >> "$LOG"; FAIL=$((FAIL+1)); }
  sleep 2
fi

echo "=== COMPLETE: $(date) | done=$DONE skip=$SKIP fail=$FAIL ===" >> "$LOG"
echo "Download complete: done=$DONE skip=$SKIP fail=$FAIL"