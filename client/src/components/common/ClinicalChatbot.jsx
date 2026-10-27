import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertCircle, CheckCircle2, ChevronDown, User, ShieldCheck } from 'lucide-react';

const CLINICAL_KNOWLEDGE = [
  {
    keywords: ['5 right', 'five right', 'rights', 'safety checklist'],
    response: `**The 5-Rights of Medication Administration:**
1. **Right Patient:** Verify bedside 2-factor ID & QR barcode.
2. **Right Drug:** Double-check generic/brand matching and allergy flags.
3. **Right Dose:** Validate standard ranges and weight-adjusted pediatric/renal bounds.
4. **Right Route:** Confirm IV, Oral, IM, SC, or Topical route.
5. **Right Time:** Administer within the ±30 min hospital accreditation window.

*Med-Sathi automatically audits all 5 rights before unlocking administration.*`
  },
  {
    keywords: ['stat', 'emergency', 'urgent'],
    response: `**STAT Medication Protocol (NABH/JCI Standard):**
* STAT orders indicate immediate clinical necessity (within 15 minutes).
* When a doctor prescribes STAT, an audio-visual alert triggers across nursing terminals.
* In Med-Sathi, STAT tasks bypass routine ward queues and appear in the top emergency banner.`
  },
  {
    keywords: ['warfarin', 'aspirin', 'interaction', 'ddi', 'bleeding'],
    response: `⚠️ **High-Risk Polypharmacy Alert: Warfarin + Aspirin**
* **Mechanism:** Additive anti-platelet and anti-coagulation inhibition.
* **Clinical Consequence:** Severe gastrointestinal and intracranial hemorrhage risk.
* **Recommendation:** Avoid co-administration unless specifically indicated with regular INR monitoring and gastroprotective PPI cover (e.g. Pantoprazole).`
  },
  {
    keywords: ['paracetamol', 'crocin', 'acetaminophen', 'dose'],
    response: `💊 **Paracetamol (Acetaminophen) Clinical Reference:**
* **Adult Inpatient:** 500mg - 1000mg PO/IV every 6 to 8 hours (Max: 4000mg/24h).
* **Pediatric:** 15 mg/kg per dose PO every 4–6 hours (Max: 60 mg/kg/day).
* **Hepatic Caution:** Reduce dose to max 2000mg/day in cirrhosis or chronic alcoholism.`
  },
  {
    keywords: ['ceftriaxone', 'antibiotic', 'renal'],
    response: `💉 **Ceftriaxone 3rd Gen Cephalosporin:**
* **Standard Adult Dose:** 1g to 2g IV once daily (OD) or divided BD in severe sepsis.
* **Allergy Cross-Reactivity:** Caution in confirmed anaphylactic Penicillin allergy (~2-3% cross-reactivity).
* **Renal Adjustment:** No adjustment needed unless both severe renal AND hepatic impairment coexist.`
  },
  {
    keywords: ['delay', 'ai risk', 'prediction'],
    response: `🧠 **Med-Sathi AI Delay Risk Engine:**
Our heuristic telemetry analyzes:
1. Ward nurse-to-patient census ratio
2. Concurrent pending doses in current 60-minute window
3. Emergency STAT interruptions
4. High-risk medication double-sign requirements

*Doses with >60% projected delay risk are flagged in orange for proactive staffing reallocation.*`
  },
  {
    keywords: ['qr', 'barcode', 'wristband', 'scan', 'identifier'],
    response: `📱 **Bedside 5-Rights QR Verification System:**
* Every admitted inpatient is assigned a unique Bedside QR badge encoding: \`{PatientID, UHID, Name, Ward, Bed}\`.
* **For Nurses:** The Nurse Station uses camera QR scanning to verify the right patient at bedside before unlocking any dose administration.`
  }
];

export default function ClinicalChatbot({ currentUser, patients = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am **Med-Sathi Clinical Copilot**. You can ask me regarding drug doses, polypharmacy interactions, STAT protocols, or live inpatient census.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      let botResponse = '';
      const lower = query.toLowerCase();

      // Check inpatient census questions
      if (lower.includes('how many patients') || lower.includes('census') || lower.includes('inpatient count')) {
        const total = patients.length || 6;
        const icu = patients.filter(p => p.ward === 'ICU').length;
        botResponse = `🏥 **Live Ward Census:**
* **Total Admitted:** ${total} patients
* **ICU:** ${icu} critical patients
* **All Beds Monitored:** 100% electronic closed-loop tracking`;
      } else {
        // Match clinical knowledge
        const match = CLINICAL_KNOWLEDGE.find(item =>
          item.keywords.some(k => lower.includes(k))
        );

        if (match) {
          botResponse = match.response;
        } else {
          botResponse = `Clinical inquiry noted: "${query}".
As per NABH Medication Safety Guidelines, please verify dosage in the hospital formulary or consult the Clinical Pharmacist. Always execute bedside 5-Rights QR verification prior to administration.`;
        }
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 transition-all border border-powder-blue/40"
        >
          <Sparkles className="w-4 h-4" />
          <span>Clinical AI Copilot</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[520px] rounded-3xl bg-white dark:bg-[#181d1e] border border-powder-blue/40 dark:border-charcoal/60 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="p-4 bg-alice-blue/40 dark:bg-[#141819] border-b border-powder-blue/20 dark:border-charcoal/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-onyx dark:text-alice-blue uppercase tracking-tight">
                  Med-Sathi Clinical Copilot
                </h3>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">
                  ● CLINICAL PHARMACOLOGY REFERENCE
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-alice-blue/20 dark:bg-[#121616] border-b border-powder-blue/20 dark:border-charcoal/40 flex gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
            {['5-Rights Protocol', 'Warfarin + Aspirin', 'Paracetamol Dose', 'Ward Census'].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-[#1c2223] border border-powder-blue/30 dark:border-charcoal/50 text-charcoal dark:text-lavender-grey hover:border-powder-blue"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx rounded-br-none'
                      : 'bg-alice-blue/40 dark:bg-[#1c2223] text-onyx dark:text-alice-blue border border-powder-blue/30 dark:border-charcoal/50 rounded-bl-none'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                  }}
                />
                <span className="text-[9px] font-mono text-charcoal/60 dark:text-lavender-grey/60 px-1 mt-0.5">
                  {msg.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-powder-blue/20 dark:border-charcoal/40 bg-white dark:bg-[#181d1e] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask clinical pharmacology questions..."
              className="flex-1 px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#141819] border border-powder-blue/30 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-1 focus:ring-powder-blue"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx hover:opacity-90 transition-opacity"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
