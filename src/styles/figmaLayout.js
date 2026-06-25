/** 피그마 402×874 화면 절대 좌표 */

export const figma = {
  screen: { width: 402, height: 874 },

  logo: { top: 96, left: 20, height: 22 },

  serviceName: {
    width: 148,
    height: 28,
    top: 124,
    left: 20,
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '140%',
    color: '#4D555A',
  },

  speaker: { width: 24, height: 24, top: 95, left: 244 },

  voiceLabel: {
    width: 63,
    height: 25,
    top: 94,
    left: 273,
    fontSize: 18,
    fontWeight: 500,
    lineHeight: '140%',
    color: '#000000',
  },

  toggle: { width: 39.22, height: 22, top: 96, left: 343 },

  mainTitle: {
    width: 263,
    height: 112,
    top: 371,
    left: 70,
    fontSize: 40,
    fontWeight: 700,
    lineHeight: '140%',
    color: '#000000',
  },

  primaryButton: {
    width: 362,
    height: 80,
    top: 760,
    left: 20,
    borderRadius: 100,
    background: '#286EF0',
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '150%',
    letterSpacing: '1px',
    color: '#FFFFFF',
  },

  /** 시작하기 텍스트 박스 (화면 기준) */
  buttonLabel: {
    width: 86,
    height: 36,
    top: 782,
    left: 158,
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '150%',
    letterSpacing: '1px',
    color: '#FFFFFF',
  },

  dualButton: {
    top: 760,
    left: 20,
    width: 362,
    height: 80,
    gap: 10,
    borderRadius: 100,
  },

  // E1 승차권 카드
  scheduleCard: { width: 362, height: 150, top: 260, left: 20, radius: 20 },
  trainName: {
    width: 112,
    height: 34,
    top: 421,
    left: 142,
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '140%',
    color: '#286EF0',
  },
  ticketCard: { width: 362, height: 213, top: 466, left: 20, radius: 20 },

  // E2 2층 이동 안내
  e2: {
    heading: {
      width: 286,
      height: 45,
      top: 214,
      left: 58,
      fontSize: 32,
      fontWeight: 700,
      lineHeight: '140%',
      color: '#000000',
      text: '2층으로 이동해주세요!',
    },
    photo: { width: 348, height: 286, top: 299, left: 27, radius: 20 },
    guideText: {
      width: 262,
      height: 68,
      top: 617,
      left: 70,
      fontSize: 24,
      fontWeight: 700,
      lineHeight: '140%',
      color: '#000000',
      text: '건물 진입 후, 오른쪽\n에스컬레이터를 이용하세요.',
    },
    buttonLabel: {
      width: 196,
      height: 36,
      top: 782,
      left: 103,
      fontSize: 24,
      fontWeight: 700,
      lineHeight: '150%',
      letterSpacing: '1px',
      color: '#FFFFFF',
      text: '2층으로 올라왔어요',
    },
  },
};

export const abs = (el) => ({
  position: 'absolute',
  top: el.top,
  left: el.left,
  width: el.width,
  height: el.height,
});
