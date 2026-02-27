import { useCallback } from 'react';
import { useI18n } from '../i18n/context';

interface Props {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportPDF({ targetRef }: Props) {
  const { t } = useI18n();

  const handleExport = useCallback(async () => {
    const el = targetRef.current;
    if (!el) return;

    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FFFFFF',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let y = 0;
    while (y < imgHeight) {
      if (y > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -y, pageWidth, imgHeight);
      y += pageHeight;
    }

    pdf.save('mon-profil-disc.pdf');
  }, [targetRef]);

  return (
    <button onClick={handleExport} className="btn btn--outline">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      {t.results.exportPdf}
    </button>
  );
}
