import { useCallback } from 'react';
import { useI18n } from '../i18n/context';
import type { DISCReport } from '../lib/scoring';
import { profiles } from '../data/profiles';
import { getReportContent, wheelTypeLabels } from '../data/report-content';

interface Props {
  targetRef: React.RefObject<HTMLDivElement | null>;
  report?: DISCReport;
}

export default function ExportPDF({ targetRef, report }: Props) {
  const { t, locale } = useI18n();

  const handleExport = useCallback(async () => {
    // If no enriched report, fall back to html2canvas capture
    if (!report) {
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
      return;
    }

    // Native jsPDF generation
    const { default: jsPDF } = await import('jspdf');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pw - margin * 2;
    let y = 0;

    const scores = report.result.normalizedScores;
    const content = getReportContent(scores, locale, report.wheelType);
    const dominant = report.result.dominant;
    const dominantP = profiles[dominant];
    const dominantText = t.profiles[dominant];
    const typeLabel = content.wheelTypeLabel;

    // ─── Helpers ─────────────────────────────────────
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const setColor = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      pdf.setTextColor(r, g, b);
    };

    const setFill = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      pdf.setFillColor(r, g, b);
    };

    const setDraw = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      pdf.setDrawColor(r, g, b);
    };

    const checkPageBreak = (needed: number) => {
      if (y + needed > ph - margin) {
        pdf.addPage();
        y = margin;
      }
    };

    const addSectionTitle = (title: string, color: string) => {
      checkPageBreak(20);
      setColor(color);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text(title, margin, y);
      y += 4;
      setFill(color);
      pdf.rect(margin, y, 40, 0.8, 'F');
      y += 8;
    };

    const addSubtitle = (text: string) => {
      setColor('#5F6368');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const lines = pdf.splitTextToSize(text, contentWidth);
      checkPageBreak(lines.length * 4 + 4);
      pdf.text(lines, margin, y);
      y += lines.length * 4 + 4;
    };

    const addBulletList = (items: string[], bulletColor: string) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      setColor('#3C4043');
      for (const item of items) {
        const lines = pdf.splitTextToSize(item, contentWidth - 8);
        checkPageBreak(lines.length * 5 + 3);
        setFill(bulletColor);
        pdf.circle(margin + 2, y - 1.2, 1.2, 'F');
        pdf.text(lines, margin + 7, y);
        y += lines.length * 5 + 2;
      }
    };

    // ─── Page 1: Cover ───────────────────────────────
    // Gradient bar at top
    const barColors = ['#EA4335', '#FBBC04', '#34A853', '#4285F4'];
    barColors.forEach((c, i) => {
      setFill(c);
      pdf.rect(i * (pw / 4), 0, pw / 4, 4, 'F');
    });

    y = 50;
    setColor('#202124');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.text(locale === 'fr' ? 'Rapport DISC' : 'DISC Report', pw / 2, y, { align: 'center' });
    y += 12;

    pdf.setFontSize(14);
    setColor('#5F6368');
    pdf.setFont('helvetica', 'normal');
    pdf.text(locale === 'fr' ? 'Profil comportemental' : 'Behavioral Profile', pw / 2, y, { align: 'center' });
    y += 20;

    // Type badge
    setFill(dominantP.colorLight);
    const badgeW = 60;
    const badgeH = 12;
    pdf.roundedRect(pw / 2 - badgeW / 2, y, badgeW, badgeH, 6, 6, 'F');
    setColor(dominantP.colorDark);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(typeLabel, pw / 2, y + badgeH / 2 + 1, { align: 'center' });
    y += badgeH + 12;

    // Profile name
    setColor(dominantP.color);
    pdf.setFontSize(18);
    pdf.text(`${dominantText.title} — ${dominantText.name}`, pw / 2, y, { align: 'center' });
    y += 16;

    // Score bars on cover
    const dims: Array<{ dim: string; color: string }> = [
      { dim: 'D', color: '#EA4335' },
      { dim: 'I', color: '#FBBC04' },
      { dim: 'S', color: '#34A853' },
      { dim: 'C', color: '#4285F4' },
    ];

    const barStartX = margin + 15;
    const barW = contentWidth - 30;
    const barH = 6;

    for (const d of dims) {
      checkPageBreak(14);
      const score = scores[d.dim as keyof typeof scores];
      setColor(d.color);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text(d.dim, margin + 5, y + 1);

      // Track
      setFill('#F1F3F4');
      pdf.roundedRect(barStartX, y - 3, barW, barH, 3, 3, 'F');

      // Fill
      setFill(d.color);
      const fillW = Math.max(1, (score / 100) * barW);
      pdf.roundedRect(barStartX, y - 3, fillW, barH, 3, 3, 'F');

      // Score text
      setColor('#5F6368');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`${score}%`, barStartX + barW + 3, y + 1);

      y += 12;
    }

    y += 8;

    // Date
    setColor('#9AA0A6');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const dateStr = new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    pdf.text(dateStr, pw / 2, y, { align: 'center' });

    // Bottom bar
    barColors.forEach((c, i) => {
      setFill(c);
      pdf.rect(i * (pw / 4), ph - 4, pw / 4, 4, 'F');
    });

    // ─── Page 2: Profile Narrative ───────────────────
    pdf.addPage();
    y = margin;

    addSectionTitle(t.report.profile.title, dominantP.color);
    addSubtitle(t.report.profile.subtitle);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    setColor('#3C4043');

    const paragraphs = content.narrative.split('\n\n');
    for (const para of paragraphs) {
      const lines = pdf.splitTextToSize(para, contentWidth);
      checkPageBreak(lines.length * 5 + 6);
      pdf.text(lines, margin, y);
      y += lines.length * 5 + 4;
    }

    // ─── Page 3: Talents ─────────────────────────────
    y += 8;
    addSectionTitle(t.report.talents.title, dominantP.color);
    addSubtitle(t.report.talents.subtitle);
    addBulletList(content.talents, dominantP.color);

    // ─── Page 4: Environment ─────────────────────────
    checkPageBreak(60);
    y += 8;
    addSectionTitle(t.report.environment.title, dominantP.color);
    addSubtitle(t.report.environment.subtitle);
    addBulletList(content.environment, '#34A853');

    // ─── Page 5: Perceptions ─────────────────────────
    pdf.addPage();
    y = margin;

    addSectionTitle(t.report.perceptions.title, dominantP.color);
    addSubtitle(t.report.perceptions.subtitle);

    // Self-positive
    y += 2;
    setColor('#34A853');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('\u25B2 ' + t.report.perceptions.selfTitle, margin, y);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    setColor('#3C4043');
    for (const adj of report.perceptions.selfPositive) {
      checkPageBreak(6);
      setFill('#E6F4EA');
      pdf.roundedRect(margin, y - 3.5, pdf.getTextWidth(adj) + 10, 6, 3, 3, 'F');
      setColor('#1E8E3E');
      pdf.text(adj, margin + 5, y);
      y += 8;
    }

    y += 6;

    // Others stress
    setColor('#EA4335');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('\u25BC ' + t.report.perceptions.stressTitle, margin, y);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    for (const adj of report.perceptions.othersStress) {
      checkPageBreak(6);
      setFill('#FCEAE8');
      pdf.roundedRect(margin, y - 3.5, pdf.getTextWidth(adj) + 10, 6, 3, 3, 'F');
      setColor('#C5221F');
      pdf.text(adj, margin + 5, y);
      y += 8;
    }

    // ─── Page 6: Communication Do/Don't ──────────────
    pdf.addPage();
    y = margin;

    addSectionTitle(t.report.communication.doTitle, '#34A853');
    addBulletList(content.communicationDo, '#34A853');

    y += 8;
    addSectionTitle(t.report.communication.dontTitle, '#EA4335');
    addBulletList(content.communicationDont, '#EA4335');

    // ─── Page 7: Motivation ──────────────────────────
    pdf.addPage();
    y = margin;

    addSectionTitle(t.report.motivation.title, dominantP.color);
    addSubtitle(t.report.motivation.subtitle);
    addBulletList(content.motivationKeys, dominantP.color);

    // ─── Page 8: Improvement ─────────────────────────
    y += 8;
    addSectionTitle(t.report.improvement.title, '#E37400');
    addSubtitle(t.report.improvement.subtitle);
    addBulletList(content.improvementAreas, '#FBBC04');

    // ─── Page 9: Bipolar Indicators ──────────────────
    pdf.addPage();
    y = margin;

    addSectionTitle(t.report.indicators.title, dominantP.color);
    addSubtitle(t.report.indicators.subtitle);

    y += 4;
    for (const ind of report.bipolarIndicators) {
      checkPageBreak(18);
      const position = (ind.value + 100) / 2;

      // Labels
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      setColor('#3C4043');
      pdf.text(ind.leftLabel[locale], margin, y);
      pdf.text(ind.rightLabel[locale], margin + contentWidth, y, { align: 'right' });
      y += 4;

      // Track
      setFill('#F1F3F4');
      pdf.roundedRect(margin, y, contentWidth, 4, 2, 2, 'F');

      // Marker
      const markerX = margin + (position / 100) * contentWidth;
      const markerColor = position < 40 ? '#EA4335' : position > 60 ? '#4285F4' : '#5F6368';
      setFill(markerColor);
      pdf.circle(markerX, y + 2, 3, 'F');
      setFill('#FFFFFF');
      pdf.circle(markerX, y + 2, 1.5, 'F');

      y += 12;
    }

    // ─── Page 10: Opposite ───────────────────────────
    pdf.addPage();
    y = margin;

    addSectionTitle(t.report.opposite.title, dominantP.color);
    addSubtitle(t.report.opposite.subtitle);

    // Type badges
    y += 2;
    const oppLabel = wheelTypeLabels[report.oppositeType][locale];

    setFill(dominantP.colorLight);
    pdf.roundedRect(margin, y, 50, 10, 5, 5, 'F');
    setColor(dominantP.colorDark);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(typeLabel, margin + 25, y + 6.5, { align: 'center' });

    setColor('#5F6368');
    pdf.setFontSize(14);
    pdf.text('\u2194', margin + 60, y + 6.5);

    setFill('#E8EAED');
    pdf.roundedRect(margin + 72, y, 50, 10, 5, 5, 'F');
    setColor('#5F6368');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(oppLabel, margin + 97, y + 6.5, { align: 'center' });

    y += 20;

    // Narrative
    if (content.opposite) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      setColor('#3C4043');

      const oppParagraphs = content.opposite[locale].split('\n\n');
      for (const para of oppParagraphs) {
        const lines = pdf.splitTextToSize(para, contentWidth);
        checkPageBreak(lines.length * 5 + 6);
        pdf.text(lines, margin, y);
        y += lines.length * 5 + 4;
      }
    }

    // Footer on last page
    y = ph - 15;
    setColor('#9AA0A6');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('disc.mouret.pro', pw / 2, y, { align: 'center' });

    // Save
    pdf.save('mon-profil-disc.pdf');
  }, [targetRef, report, locale, t]);

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
