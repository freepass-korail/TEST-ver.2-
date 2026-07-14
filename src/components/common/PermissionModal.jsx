import styled from 'styled-components';
import { colors, typography } from '../../styles/theme';

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 20;
`;

const Modal = styled.div`
  position: absolute;
  top: 186px;
  left: 41px;
  width: 320px;
  height: 450px;
  background: ${colors.white};
  border: 1px solid #44444433;
  border-radius: 14px;
  overflow: hidden;
  z-index: 30;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 28px 34px 16px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-family: ${typography.fontFamily};
  font-size: 18px;
  font-weight: 700;
  line-height: 150%;
  color: ${colors.black};
  letter-spacing: 0px;
  white-space: pre-line;
  word-break: keep-all;
`;

const ModalBodyBox = styled.div`
  flex: 1;
  margin: 0 16px 16px;
  background: #e8e8e8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBodyText = styled.p`
  font-family: ${typography.fontFamily};
  font-size: 15px;
  font-weight: 400;
  color: #888888;
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
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: 0px;
  color: ${({ $primary }) => ($primary ? colors.primary : '#444444')};
  cursor: pointer;
  border-top: ${({ $divider }) => ($divider ? '1px solid #e5e5ea' : 'none')};
  opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};

  &:active:not(:disabled) {
    background: #f2f2f7;
  }

  &:disabled {
    cursor: wait;
  }
`;

function PermissionModal({ onAllow, onDeny, isRequesting = false }) {
  return (
    <>
      <Backdrop aria-hidden="true" />
      <Modal role="dialog" aria-modal="true" aria-labelledby="permission-title">
        <ModalHeader>
          <ModalTitle id="permission-title">
            {isRequesting
              ? '권한을 확인하고 있어요'
              : `길을 안내하려면 위치가 필요해요.\n[허용]을 눌러주세요.`}
          </ModalTitle>
        </ModalHeader>
        <ModalBodyBox>
          <ModalBodyText>{isRequesting ? '확인 중…' : '자동 함'}</ModalBodyText>
        </ModalBodyBox>
        <ActionList>
          <ActionButton type="button" $primary onClick={onAllow} disabled={isRequesting}>
            {isRequesting ? '확인 중…' : '위치 허용'}
          </ActionButton>
          <ActionButton type="button" $divider onClick={onDeny} disabled={isRequesting}>
            허용 안함
          </ActionButton>
        </ActionList>
      </Modal>
    </>
  );
}

export default PermissionModal;
