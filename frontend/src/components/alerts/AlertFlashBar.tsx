import React, { useState } from 'react';
import { X, ChevronRight, BellRing } from 'lucide-react';

interface AlertFlashBarProps {
  onDismiss?: () => void;
  activeLang: 'EN' | 'OD' | 'TE' | 'HI';
}

export const AlertFlashBar: React.FC<AlertFlashBarProps> = ({ activeLang }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (isDismissed) return null;

  // Multilingual urgent bulletin
  const alertTexts: Record<'EN' | 'OD' | 'TE' | 'HI', string> = {
    EN: 'CRITICAL ALERT: State Highway 14 (Rushikulya Estuary Bridge) submerged under 0.85m storm surge. Convoys must reroute via Inland Ridge Road to Kalyanpur Shelter.',
    OD: 'ଜରୁରୀ ସୂଚନା: ଷ୍ଟେଟ୍ ହାଇୱେ-୧୪ (ଋଷିକୁଲ୍ୟା ବ୍ରିଜ୍) ୦.୮୫ ମିଟର ପାଣିରେ ବୁଡ଼ି ରହିଛି। ସମସ୍ତ ଗାଡ଼ି ରିଜ୍ ରୋଡ୍ ଦେଇ କଲ୍ୟାଣପୁର ଆଶ୍ରୟସ୍ଥଳୀକୁ ଯାଆନ୍ତୁ।',
    TE: 'ముఖ్యమైన హెచ్చరిక: స్టేట్ హైవే 14 పై 0.85 మీటర్ల నీరు చేరింది. కాన్వాయ్‌లు ఇన్‌ల్యాండ్ రిడ్జ్ రోడ్ మీదుగా కల్యాణ్‌పూర్ షెల్టర్‌కు వెళ్లాలి.',
    HI: 'अति आवश्यक चेतावनी: राज्य राजमार्ग 14 (ऋषिकुल्या ब्रिज) 0.85 मीटर पानी में डूबा है। सभी वाहन रिज़ रोड से कल्याणपुर शरणस्थल की ओर जाएं।'
  };

  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(225, 29, 72, 0.95), rgba(159, 18, 57, 0.95))',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      padding: isExpanded ? '10px 20px' : '6px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      fontSize: '12px',
      fontWeight: 600,
      boxShadow: '0 2px 10px rgba(225, 29, 72, 0.3)',
      transition: 'all 0.2s ease',
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '2px 8px',
          borderRadius: '4px',
          textTransform: 'uppercase',
          fontSize: '10px',
          fontWeight: 800,
          letterSpacing: '0.06em',
          flexShrink: 0
        }}>
          <BellRing size={12} className="animate-shimmer" />
          <span>RED LEVEL 3</span>
        </div>

        <p style={{
          margin: 0,
          whiteSpace: isExpanded ? 'normal' : 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1,
          fontFamily: activeLang === 'OD' ? 'sans-serif' : 'var(--font-sans)',
          letterSpacing: '0.01em'
        }}>
          {alertTexts[activeLang]}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '11px',
            padding: '2px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <span>{isExpanded ? 'Collapse' : 'Details'}</span>
          <ChevronRight size={12} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
