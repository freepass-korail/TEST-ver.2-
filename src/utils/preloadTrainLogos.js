import logoKtx from '../assets/ktx-logo.png';
import logoMugunghwa from '../assets/train-mugunghwa-logo.png';
import logoItx from '../assets/train-itx-logo.png';
import logoNuriro from '../assets/train-nuriho-logo.png';
import logoItxCheong from '../assets/train-itx-cheongchun-logo.png';
import logoItxSaemaul from '../assets/train-itx-samaul-logo.png';

export {
  logoKtx,
  logoMugunghwa,
  logoItx,
  logoNuriro,
  logoItxCheong,
  logoItxSaemaul,
};

export const TRAIN_LOGO_URLS = [
  logoKtx,
  logoMugunghwa,
  logoItx,
  logoNuriro,
  logoItxCheong,
  logoItxSaemaul,
];

/** S4 진입 전 열차 로고 디코드까지 미리 수행 */
export function preloadTrainLogos() {
  TRAIN_LOGO_URLS.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  });
}
