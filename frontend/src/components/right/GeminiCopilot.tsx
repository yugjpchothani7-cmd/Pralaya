import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check,
  Zap,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { COPILOT_SAMPLE_DIALOGUES } from '../../data/demoData';

interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  toolTrace?: {
    toolName: string;
    toolArgs: Record<string, unknown>;
    provenance: string;
  };
}

export const GeminiCopilot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'gemini',
      text: 'PRALAYA Gemini 2.5 Flash operational. Strict deterministic provenance active (Level 1 PostGIS verification). How can I assist Commander?',
      timestamp: '11:00:15',
      toolTrace: {
        toolName: 'verify_system_guardrails',
        toolArgs: { engine: 'POSTGIS_HYDRO_ROUTING', hashVerified: true },
        provenance: 'PRALAYA Invariant Sentinel v1'
      }
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const msgCounterRef = useRef<number>(2);

  // Suggestion chips
  const suggestionChips = [
    'Why was SH-14 rejected?',
    'What shelters are currently safe?',
    'Draft Odia alert for Sarpanches',
    'Substation failure cascade impact',
    'Show evacuation status for Gopalpur'
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAIResponse = (prompt: string): { text: string; toolTrace?: Message['toolTrace'] } => {
    const p = prompt.toLowerCase();

    // Check predefined dialogues first
    const matched = COPILOT_SAMPLE_DIALOGUES.find((d) =>
      p.includes(d.prompt.toLowerCase().slice(0, 15))
    );
    if (matched) {
      return {
        text: matched.response,
        toolTrace: {
          toolName: matched.toolCalled,
          toolArgs: matched.toolArgs,
          provenance: matched.provenance
        }
      };
    }

    if (p.includes('sh-14') || p.includes('route') || p.includes('road') || p.includes('reject')) {
      return {
        text: `ROUTE ANALYSIS REPORT [POSTGIS_HYDRO_EVAL]:\n\n• State Highway 14 (SH-14): REJECTED due to predicted storm surge inundation exceeding 1.85m at culvert km-14.2.\n• Alternate Route Approved: National Highway 16 (NH-16 Bypass) via Berhampur bypass is elevated +8.4m MSL.\n• Transit Clearance Window: 2.5 hours remaining before winds exceed 90 km/h.`,
        toolTrace: {
          toolName: 'query_route_inundation_risk',
          toolArgs: { route_id: 'SH-14', elevation_threshold_m: 2.0, surge_peak_m: 4.2 },
          provenance: 'PostGIS / Hydrodynamic Dynamic Mesh v2.4'
        }
      };
    }

    if (p.includes('shelter') || p.includes('safe') || p.includes('haven') || p.includes('capacity')) {
      return {
        text: `SHELTER CAPACITY & ALLOCATION TELEMETRY:\n\n1. Gopalpur Multipurpose Cyclone Shelter: 88% Capacity (Occupancy: 880 / 1,000). Elevated +6.8m MSL. Backup diesel generators active.\n2. Brahmapur Engineering College Shelter: 42% Capacity (Occupancy: 1,050 / 2,500). High inland elevation +18.2m MSL. RECOMMENDED for Sector B evacuations.\n3. Chatrapur Cyclone Center: 60% Capacity (600 / 1,000). Medical station fully staffed.`,
        toolTrace: {
          toolName: 'get_regional_shelter_capacity',
          toolArgs: { region: 'Ganjam-Coast', priority: 'elevation_desc' },
          provenance: 'OSDMA Live Facility Registry / SHA-256 Validated'
        }
      };
    }

    if (p.includes('odia') || p.includes('alert') || p.includes('sarpanch') || p.includes('broadcast')) {
      return {
        text: `OFFICIAL EMERGENCY BROADCAST [ODIA & ENGLISH]:\n\nସତର୍କତା ସୂଚନା (Emergency Alert):\nବାତ୍ୟା ସମୟରେ ତଳିଆ ଅଞ୍ଚଳ ତୁରନ୍ତ ଖାଲି କରନ୍ତୁ। SH-14 ରାସ୍ତା ପାଣିରେ ବୁଡ଼ିଯାଇଛି। ସମସ୍ତ ଗ୍ରାମବାସୀ NH-16 ଦେଇ ବ୍ରହ୍ମପୁର ଆଶ୍ରୟସ୍ଥଳୀକୁ ଯାଆନ୍ତୁ।\n\nEnglish Translation:\n"Immediate Evacuation: Coastal lowlands must evacuate now. SH-14 is flooded. Proceed via elevated NH-16 to Brahmapur Shelters. Keep emergency radios tuned."`,
        toolTrace: {
          toolName: 'generate_bilingual_emergency_alert',
          toolArgs: { source_lang: 'EN', target_lang: 'OD', channel: 'CAP_SMS_BROADCAST' },
          provenance: 'Gemini 2.5 Flash Grounded Multilingual Synthesis'
        }
      };
    }

    if (p.includes('substation') || p.includes('power') || p.includes('blackout') || p.includes('grid')) {
      return {
        text: `CASCADE FAILURE SIMULATION [CRITICAL INFRASTRUCTURE]:\n\n• Inundation at Gopalpur 132kV Substation predicted at T-1h 30m.\n• Cascade Impact: 4 downstream cell towers will switch to 6-hour battery reserves; District Hospital automatically transitioned to dedicated rooftop solar-diesel microgrid.\n• Mitigation Action Order #402 dispatched: Mobile generator deployed to Water Treatment Plant #2.`,
        toolTrace: {
          toolName: 'simulate_infrastructure_cascade',
          toolArgs: { trigger_node: 'SUBSTATION_GOPALPUR_132KV', failure_mode: 'FLOOD_INUNDATION' },
          provenance: 'PRALAYA Directed Dependency Graph Engine'
        }
      };
    }

    if (p.includes('cyclone') || p.includes('wind') || p.includes('surge') || p.includes('landfall') || p.includes('weather')) {
      return {
        text: `CYCLONE TELEMETRY SUMMARY:\n\n• System: Extremely Severe Cyclonic Storm (ESCS Cat-4 equivalent).\n• Central Pressure: 938 hPa | Peak Sustained Winds: 185 km/h.\n• Predicted Storm Surge: +4.2m MSL at Gopalpur beachfront.\n• High Tide Synchronization: Coinciding with astronomical spring tide (+1.1m additive surge).\n• Immediate Action: Complete all mandatory coastal zone evacuations within the next 90 minutes.`,
        toolTrace: {
          toolName: 'fetch_imd_rsmc_telemetry',
          toolArgs: { basin: 'NORTH_INDIAN_OCEAN', storm_id: 'PRALAYA-04B' },
          provenance: 'IMD RSMC Realtime Feed / Verified'
        }
      };
    }

    // Default intelligent crisis response
    return {
      text: `EOC ADVISORY STATUS:\n\nTelemetry verified for Sector Gopalpur-Ganjam. 14 vulnerable habitations flagged for priority evacuation. All response parameters are locked to PostGIS spatial invariants.\n\nRecommended next steps:\n1. Verify evacuation buses on NH-16 bypass.\n2. Broadcast Odia siren alerts to coastal panchayats.\n3. Review automated insurance parametric triggers in the Actions panel.`,
      toolTrace: {
        toolName: 'synthesize_command_briefing',
        toolArgs: { sector: 'Gopalpur-Coastal-Odisha', query_intent: prompt },
        provenance: 'PRALAYA Incident Sentinel Engine'
      }
    };
  };

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    msgCounterRef.current += 1;
    const currentId = msgCounterRef.current;

    const userMsg: Message = {
      id: `user-${currentId}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const responseObj = generateAIResponse(promptText);

      const botMsg: Message = {
        id: `gemini-${currentId + 1}`,
        sender: 'gemini',
        text: responseObj.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        toolTrace: responseObj.toolTrace
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '440px',
      gap: '10px'
    }}>
      {/* Copilot Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(37,99,235,0.2)'
          }}>
            <Bot size={16} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>GEMINI 2.5 FLASH</span>
              <span style={{ fontSize: '9px', padding: '1px 5px', background: '#dcfce7', color: '#15803d', borderRadius: '3px', fontWeight: 700 }}>
                GROUNDED
              </span>
            </div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>PostGIS Guardrail Active • Zero Hallucination</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#059669', fontWeight: 600 }}>
          <ShieldCheck size={14} color="#059669" />
          <span>L1 Verified</span>
        </div>
      </div>

      {/* Suggestion Quick Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(chip)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '4px 10px',
              color: '#0284c7',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s'
            }}
          >
            <Sparkles size={11} color="#0284c7" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Message Chat Stream */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingRight: '4px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: msg.sender === 'user' ? '85%' : '98%',
              background: msg.sender === 'user' ? '#2563eb' : '#ffffff',
              border: msg.sender === 'user' ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '11.5px',
              lineHeight: 1.5,
              position: 'relative',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            {/* Message Meta */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{
                fontSize: '9px',
                fontWeight: 700,
                color: msg.sender === 'user' ? '#dbeafe' : '#d97706',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)'
              }}>
                {msg.sender === 'user' ? 'EOC COMMANDER' : 'GEMINI DISASTER ENGINE'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '9px', color: msg.sender === 'user' ? '#bfdbfe' : '#94a3b8' }}>
                  {msg.timestamp}
                </span>
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: msg.sender === 'user' ? '#bfdbfe' : '#94a3b8', 
                    cursor: 'pointer', 
                    padding: '2px' 
                  }}
                  title="Copy response"
                >
                  {copiedId === msg.id ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                </button>
              </div>
            </div>

            {/* Tool Trace Execution Card */}
            {msg.toolTrace && (
              <div style={{
                marginBottom: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '6px 8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '9.5px',
                color: '#334155'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0284c7', marginBottom: '3px' }}>
                  <Terminal size={11} />
                  <span style={{ fontWeight: 700 }}>Tool Call: {msg.toolTrace.toolName}()</span>
                </div>
                <div style={{ color: '#64748b' }}>
                  Args: {JSON.stringify(msg.toolTrace.toolArgs)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', marginTop: '2px' }}>
                  <ShieldCheck size={10} />
                  <span>Provenance: {msg.toolTrace.provenance}</span>
                </div>
              </div>
            )}

            {/* Body Text */}
            <div style={{ 
              whiteSpace: 'pre-line', 
              color: msg.sender === 'user' ? '#ffffff' : '#0f172a' 
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '11px',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Bot size={13} className="animate-shimmer" />
            <span>Consulting hydrodynamic raster & PostGIS graph...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Prompt Box */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: '#ffffff',
        border: '1.5px solid #3b82f6',
        borderRadius: '8px',
        padding: '6px 10px',
        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.08)'
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendPrompt(inputValue);
          }}
          placeholder="Ask Copilot (e.g. 'Why was SH-14 rejected?' or 'Safe shelters')"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#0f172a',
            fontSize: '12px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500
          }}
        />
        <button
          onClick={() => handleSendPrompt(inputValue)}
          disabled={!inputValue.trim()}
          style={{
            background: inputValue.trim() ? '#2563eb' : '#e2e8f0',
            border: 'none',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: inputValue.trim() ? 'pointer' : 'default',
            transition: 'all 0.15s'
          }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};
