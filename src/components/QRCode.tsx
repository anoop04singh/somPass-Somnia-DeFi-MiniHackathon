import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
}

export const QRCode = ({ value, size = 128 }: QRCodeProps) => {
  return (
    <div className="p-2 bg-white rounded-lg">
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={"#FFFFFF"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
      />
    </div>
  );
};