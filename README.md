# README

## MADCAMP Week 2
### Project name : 돈보기
### 팀원 - 김서현, 박성빈
### Project 설명

수입, 지출 내역을 정리하고 분석해주는 앱입니다. 또한, 가입한 사용자들의 수입, 지출 내역을 보고 댓글도 남길 수 있습니다!

# 사용법

### 로그인 화면

![KakaoTalk_Photo_2023-07-12-19-29-52_001](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/adc666d8-0bc9-4912-ab02-45bd69830630)


### Tab1 : 프로필 목록

1. 사용자 목록 보기 & 댓글 남기기
    
    목록 탭에는 가입한 사용자들의 닉네임, 프로필 사진, 수입, 지출, 합산 데이터를 DB에서 가져와 보이도록 하였습니다. 정렬 방식은 해당되는 달에 가장 많이 소비를 한 순서대로입니다.
    
2. 사용자 정보 Modal
    
    프로필 클릭 시 각 사용자의 이 달의 지출 내역이 순서대로 보여집니다.
    
3. 한 줄 코멘트
    
    각 항목을 누르면 소비에 관한 댓글을 달 수 있으며, 지금까지 등록된 모든 댓글들 또한 볼 수 있습니다.

![KakaoTalk_Photo_2023-07-12-19-29-52_002](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/5ac2f22c-77b2-4f9f-91d9-eaa2cd0d45a9)
![KakaoTalk_Photo_2023-07-12-19-29-52_003](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/a15bdbf0-46d6-497a-be40-2fd8d0b75339)
![KakaoTalk_Photo_2023-07-12-19-29-52_004](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/e22549cb-1b3f-4c99-ad82-02200629a175)


### Tab2: 통계 탭

Modal을 통해 달을 선택하고 해당 달의 카테고리 별 지출과 수입 퍼센트를 PieChart로 볼 수 있습니다. 또한, 올 한 해 월 별 지출과 수입을 한 번에 비교해주는 BarChart도 볼 수 있습니다.
![KakaoTalk_Photo_2023-07-12-19-29-52_005](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/423424d3-68d3-41e9-a7d6-19c97ccbc56a)
![KakaoTalk_Photo_2023-07-12-19-29-52_006](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/2347c8f5-48a1-4d79-bcdf-4e077c3731f4)



### Tab3: 기록 탭

지금까지 입력한 지출, 수입 내역을 Flatlist형식으로 확인할 수 있습니다. 검색 아이콘을 클릭하면 SearchModal이 화면에 나타나며, 지금까지 입력한 내역들의 내용을 입력창에 입력된 문자열과 비교하여 해당 문자열을 포함하는 내역들을 모두 보여줍니다.

DB에서 정보를 불러와 지금까지의 총 지출, 수입, 합산 금액을 계산하여 알 수 있으며, “+” floating button을 클릭하면 새로운 수입 또는 지출 내역을 입력할 수 있는 Modal이 화면에 보여집니다.

![KakaoTalk_Photo_2023-07-12-19-29-52_007](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/58cf67ed-757d-4a35-819d-4aa45f9bc26f)
![KakaoTalk_Photo_2023-07-12-19-29-53_008](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/14611c8b-c556-4357-977a-9ea3c1ad12b4)
![KakaoTalk_Photo_2023-07-12-19-29-53_009](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/0c60fe05-9157-4c2c-9cac-e0ef1edd53a1)
![KakaoTalk_Photo_2023-07-12-19-29-53_010](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/a39b51d5-ec26-46e5-800d-7dfd9d64c310)


### Tab4: 내 프로필 탭

나의 닉네임과 이메일 주소를 보여주는 화면입니다. “닉네임 변경” 버튼 클릭 시 입력창이 나타나며, DB에 저장된 나의 닉네임을 변경할 수 있습니다.

“설정 금액” 버튼 클릭 시 입력창이 나타나며, 특정 금액을 입력하면 그 금액만큼 지출을 기록했을 시 Toast로 앱을 접속했을 때, 지출이 설정 한도를 넘어갔다는 알림이 뜹니다.

![KakaoTalk_Photo_2023-07-12-19-29-53_011](https://github.com/2023MadCamp-Week2/Week2_application/assets/39610886/f5b86eda-0711-4af7-b697-9d3cf24e3971)
