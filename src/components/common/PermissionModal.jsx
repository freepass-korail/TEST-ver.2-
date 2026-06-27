import styled from 'styled-components';
import { colors, typography } from '../../styles/theme';

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 20;
`;

const ModalLayer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 42px;
  z-index: 30;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;

const Modal = styled.div`
  width: 100%;
  max-width: 320px;
  background: ${colors.white};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
`;

const ModalHeader = styled.div`
  padding: 22px 20px 12px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-family: ${typography.fontFamily};
  font-size: 19px;
  font-weight: 700;
  line-height: 1.5;
  color: ${colors.black};
  letter-spacing: -0.3px;
  white-space: pre-line;
  word-break: keep-all;
`;

const ModalBodyWrap = styled.div`
  padding: 0 16px 16px;
`;

const ModalBodyBox = styled.div`
  background: #e8f1ff;
  border: 1.5px solid rgba(40, 110, 240, 0.25);
  border-radius: 10px;
  padding: 16px 14px;
`;

const ModalBody = styled.p`
  font-family: ${typography.fontFamily};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.7;
  color: ${colors.gray};
  text-align: center;
  white-space: pre-line;
  word-break: keep-all;
`;

const ActionList = styled.div`
  border-top: 1px solid #e5e5ea;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 18px 16px;
  border: none;
  background: none;
  font-family: ${typography.fontFamily};
  font-size: ${typography.buttonSize};
  font-weight: 600;
  line-height: ${typography.lineHeight};
  color: ${({ $primary }) => ($primary ? colors.primary : colors.black)};
  cursor: pointer;
  border-top: ${({ $divider }) => ($divider ? '1px solid #e5e5ea' : 'none')};
  letter-spacing: -0.2px;
  opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};

  &:active:not(:disabled) {
    background: #f2f2f7;
  }

  &:disabled {
    cursor: wait;
  }
`;

const IOS_COPY = {
  intro: {
    title: '길찾기 권한이\n필요합니다',
    body: `iPhone은 권한을 두 번
나눠 허용합니다.

① 동작 및 방향
② 위치`,
    allow: '1단계: 방향 센서 허용',
  },
  'waiting-orientation': {
    title: '권한을 확인하고 있어요',
    body: `동작 및 방향 팝업에서
「허용」을 눌러 주세요.`,
    allow: '확인 중…',
  },
  location: {
    title: '방향 센서\n허용 완료',
    body: `이제 위치 팝업이
나타납니다.

아래 버튼을 누른 뒤
「허용」을 선택해 주세요.`,
    allow: '2단계: 위치 허용',
  },
  'waiting-location': {
    title: '위치 권한 확인 중',
    body: `위치 팝업에서
「허용」 또는
「앱 사용 중 허용」을
선택해 주세요.`,
    allow: '확인 중…',
  },
};

const DEFAULT_COPY = {
  intro: {
    title: '현재 정확한 위치를\n공유하시겠습니까?',
    body: `안전하고 정확한 승강장
길찾기 안내를 위해
위치 정보 및 기기 방향
센서 허용이 필요합니다.`,
    allow: '위치 허용',
  },
  waiting: {
    title: '권한을 확인하고 있어요',
    body: `브라우저 팝업에서
위치·방향 센서 허용을
선택해 주세요.`,
    allow: '확인 중…',
  },
};

function PermissionModal({ phase = 'intro', isIOS = false, isRequesting = false, onAllow, onDeny }) {
  let title;
  let body;
  let allowLabel;

  if (isIOS) {
    const copy = IOS_COPY[phase] ?? IOS_COPY.intro;
    title = copy.title;
    body = copy.body;
    allowLabel = copy.allow;
  } else if (isRequesting) {
    title = DEFAULT_COPY.waiting.title;
    body = DEFAULT_COPY.waiting.body;
    allowLabel = DEFAULT_COPY.waiting.allow;
  } else {
    title = DEFAULT_COPY.intro.title;
    body = DEFAULT_COPY.intro.body;
    allowLabel = DEFAULT_COPY.intro.allow;
  }

  const waitingPhase = isIOS
    ? phase === 'waiting-orientation' || phase === 'waiting-location'
    : isRequesting;

  return (
    <>
      <Backdrop aria-hidden="true" />
      <ModalLayer role="dialog" aria-modal="true" aria-labelledby="permission-title">
        <Modal>
          <ModalHeader>
            <ModalTitle id="permission-title">{title}</ModalTitle>
          </ModalHeader>
          <ModalBodyWrap>
            <ModalBodyBox>
              <ModalBody>{body}</ModalBody>
            </ModalBodyBox>
          </ModalBodyWrap>
          <ActionList>
            <ActionButton type="button" $primary onClick={onAllow} disabled={waitingPhase}>
              {allowLabel}
            </ActionButton>
            <ActionButton type="button" $divider onClick={onDeny} disabled={waitingPhase}>
              허용 안함
            </ActionButton>
          </ActionList>
        </Modal>
      </ModalLayer>
    </>
  );
}

export default PermissionModal;
