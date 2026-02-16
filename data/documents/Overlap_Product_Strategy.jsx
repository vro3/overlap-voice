import { useState } from "react";

const sections = [
  {
    id: "thesis",
    label: "01",
    title: "The Product Thesis",
    content: {
      headline: "Stop Building AI Products. Build the Layer Underneath Them.",
      body: `The entire AI tools market — $50B+ and climbing — shares a single, fatal assumption: that the user already knows who they are, what they do, and why it matters, in a format AI can use.

They don't.

The Overlap is the knowledge infrastructure layer that sits beneath every AI agent, copilot, and automation tool. It extracts what a business owner actually knows — the tacit expertise, positioning, voice, values, and decision-making frameworks scattered across their head — and structures it into documentation that AI systems can reason with.

Without this layer, every AI tool produces generic output. With it, AI becomes a genuine strategic partner.`,
      keyInsight: `Think of it this way: everyone is building applications on AWS. We're building AWS.`,
      proofPoint: `Tested on a solo creator in Germany (149 products, 524 YouTube videos, bilingual support). 12 hours of extraction. Result: AI now drafts every customer email in his exact voice, in two languages, with correct product links. Daily support time dropped from 3 hours to 30 minutes. Infrastructure cost: $0/month.`
    }
  },
  {
    id: "product",
    label: "02",
    title: "Product Architecture",
    content: {
      headline: "Highest Quality. Lowest Effort. Three Layers.",
      layers: [
        {
          name: "The Extraction Engine",
          status: "BUILT",
          description: "Voice-to-text guided questionnaire. 60 questions across 9 sections. User speaks, system captures, output is structured markdown. No technical literacy required.",
          effort: "Exists today at overlap-voice.vercel.app",
          detail: "The questions aren't generic. Each one has subtext that prevents surface-level answers, tier indicators for priority, and breakthrough detection signals. Built from 5 months of iterative testing."
        },
        {
          name: "The AI Review Layer",
          status: "90% READY",
          description: "After completing the questionnaire, AI reviews answers and pushes back on vagueness. 'You said you serve everyone — who specifically?' This is the facilitator-in-a-box.",
          effort: "System prompt is written. Needs API integration (1-2 days of dev work).",
          detail: "The review prompt was trained on patterns from real facilitated sessions — it knows what a weak answer looks like and what a breakthrough sounds like."
        },
        {
          name: "The Gospel Output",
          status: "PROVEN",
          description: "Completed extraction becomes a structured 'Gospel' document — the single source of truth that feeds every downstream AI tool. Marketing, email, strategy, content — all pull from the same honest foundation.",
          effort: "Template system exists. Needs automated generation pipeline.",
          detail: "The Gospel system has been battle-tested on VR Creative Group for 5+ months. Every AI tool in the business references these documents. The methodology is documented and repeatable."
        }
      ]
    }
  },
  {
    id: "market",
    label: "03",
    title: "Market Reality",
    content: {
      headline: "The Gap Nobody Else Sees.",
      segments: [
        {
          name: "The Competent Middle",
          size: "33M small businesses in the US alone",
          pain: "Skilled but undifferentiated. Drowning in competence without clarity. They've tried ChatGPT, gotten garbage, and concluded AI doesn't work for them.",
          insight: "It didn't work because they skipped the extraction step. The input was garbage, so the output was garbage. They blame the tool when the problem is the foundation."
        },
        {
          name: "The Agent Wave",
          size: "OpenClaw: 145K+ GitHub stars in weeks",
          pain: "AI agents can now manage email, calendar, files, workflows — but they know nothing about the business they're serving on day one.",
          insight: "The Overlap is the onboarding layer for every AI agent. Complete the extraction before you deploy the agent, and it works immediately."
        },
        {
          name: "The Enterprise Downmarket",
          size: "Knowledge management: $1.1T market by 2028",
          pain: "Enterprise companies pay millions for knowledge engineering (ontology design, knowledge graphs, structured data). Solo operators and SMBs have zero access to this.",
          insight: "The Overlap democratizes knowledge architecture. What costs enterprises $500K+ in consulting, we deliver for $3K-$10K through a guided process."
        }
      ]
    }
  },
  {
    id: "gtm",
    label: "04",
    title: "Go-To-Market",
    content: {
      headline: "Fast. Inexpensive. Yacht Money.",
      phases: [
        {
          name: "Phase 1: Proof",
          timeline: "Months 1-3",
          cost: "$25K seed",
          action: "Run 10-15 paid Overlap extractions ($1,500-$3,000 each) across 3-4 industries. Creative entrepreneurs, consultants, small agencies, local service businesses. Generate revenue while validating.",
          revenue: "$15K-$45K",
          outcome: "5+ case studies. Proven methodology across industries. Real testimonials. App refined from user feedback.",
          key: "You're not burning cash to validate. You're getting paid to validate."
        },
        {
          name: "Phase 2: Content Flywheel",
          timeline: "Months 3-6",
          cost: "Near zero (organic)",
          action: "Every client extraction produces a case study. Each case study is content. Content attracts next client. Speak at AI/startup events using the intellectual framework (Kasparov's centaur model, Polanyi's Paradox, Eno's gardener metaphor). Position as thought leader, not vendor.",
          revenue: "$50K-$100K (consulting)",
          outcome: "Inbound pipeline from content. Speaking invitations. Podcast appearances. The founder story sells itself: 28-year entertainer cracks the AI adoption code.",
          key: "The methodology IS the marketing. Every client engagement produces the content for the next one."
        },
        {
          name: "Phase 3: Scale the Unscalable",
          timeline: "Months 6-12",
          cost: "Revenue-funded",
          action: "Train facilitators on the Overlap methodology. 'Overlap Certified' program. License the process. The app handles self-guided extraction; certified facilitators handle premium engagements.",
          revenue: "$250K-$500K (licensing + consulting + app)",
          outcome: "Revenue from three streams: self-guided app (volume), facilitated extraction (premium), certified facilitators (scale). Founder transitions from practitioner to platform.",
          key: "You don't need to be in every room. You need to have built the process that works in every room."
        },
        {
          name: "Phase 4: Infrastructure Play",
          timeline: "Year 2+",
          cost: "Series A territory",
          action: "API layer. Any AI product can integrate Overlap-structured data as a user onboarding step. 'Powered by Overlap' becomes the knowledge layer for the agent ecosystem. Partner with OpenClaw, Claude, GPT ecosystem.",
          revenue: "The yacht part.",
          outcome: "Every AI agent platform needs structured user knowledge. You become the standard for how that knowledge gets created.",
          key: "In a world of companies building on AWS, be AWS."
        }
      ]
    }
  },
  {
    id: "moat",
    label: "05",
    title: "The Moat",
    content: {
      headline: "Why This Can't Be Copied by Next Tuesday.",
      defenses: [
        {
          name: "The Questions Are the IP",
          detail: "60 questions sounds simple. But each one was refined over 5 months of real extraction work — from 181 down to 60. The subtext, the tier system, the breakthrough detection, the follow-up logic — that's not replicable by reading the question list. The questions without the methodology is a Google Form."
        },
        {
          name: "The Methodology Is Experiential",
          detail: "You can copy the framework. You can't copy 28 years of reading rooms, understanding what people mean vs. what they say, and knowing when someone is giving you a surface answer. The facilitated version is where the real value lives."
        },
        {
          name: "Network Effects from Case Studies",
          detail: "Every client extraction improves the methodology and produces a case study. By client 50, you have pattern data across industries that no competitor starting from zero can match. The system gets smarter with use."
        },
        {
          name: "The Founder's Paradox",
          detail: "The person who built this is a systems-thinking entertainer who reverse-engineered knowledge architecture through 5 months of AI conversation. That combination — domain expertise in live performance + self-taught knowledge engineering + authentic origin story — is genuinely unreproducible. The product came from the person. Copying the product without the person gets you a shell."
        }
      ]
    }
  },
  {
    id: "why",
    label: "06",
    title: "Why Now. Why This. Why Vince.",
    content: {
      headline: "The Entertainer Who Solved the AI Adoption Problem.",
      whyNow: "AI agents just went mainstream (OpenClaw: 145K GitHub stars). Every small business owner is about to deploy an agent. None of them are ready. The window for establishing the knowledge infrastructure standard is open right now.",
      whyThis: "The entire AI tools market is building better pipes. Nobody is solving what goes into the pipes. The Overlap is the missing layer between small businesses and useful AI.",
      whyVince: `28 years of zero-failure corporate entertainment for Fortune 500 clients. That's not the qualification — it's the proof of how his brain works. He's a systems thinker who got categorized as a creative.

He built an entire business operating system through AI conversation — automated content management, database schemas, multi-platform SEO strategy, performer logistics — without writing a line of code traditionally. Then he recognized that the process he went through was the actual product.

The methodology is therapeutic as much as it is strategic. Before touching AI tools, you define what makes you YOU. The fear dissolves when you have documented proof of your unique value.

He's not a developer pitching a feature. He's an entrepreneur who figured out why AI works for some people and fails for almost everyone else. The Overlap is that fix.`,
      close: "The best seed in dead soil grows nothing. The Overlap tests the soil."
    }
  }
];

export default function OverlapProductStrategy() {
  const [activeSection, setActiveSection] = useState("thesis");
  const current = sections.find(s => s.id === activeSection);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAF8",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#1a1a1a"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #e0ddd8",
        padding: "32px 40px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline"
      }}>
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: "4px"
          }}>CONFIDENTIAL — PRODUCT STRATEGY</div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "400",
            margin: 0,
            letterSpacing: "-0.5px"
          }}>The Overlap</h1>
        </div>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "11px",
          color: "#aaa",
          textAlign: "right"
        }}>
          <div>February 2026</div>
          <div>VR Creative Group</div>
          <div>Nashville, TN</div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: "flex",
        gap: "0",
        borderBottom: "1px solid #e0ddd8",
        overflowX: "auto"
      }}>
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: "16px 24px",
              border: "none",
              borderBottom: activeSection === section.id ? "2px solid #1a1a1a" : "2px solid transparent",
              background: "none",
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: activeSection === section.id ? "#1a1a1a" : "#999",
              whiteSpace: "nowrap",
              transition: "all 0.2s"
            }}
          >
            <span style={{ color: activeSection === section.id ? "#C84B4B" : "#ccc", marginRight: "8px" }}>{section.label}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* Thesis */}
        {activeSection === "thesis" && current?.content && (() => {
          const c = current.content;
          return (
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "400", lineHeight: "1.2", marginBottom: "40px", letterSpacing: "-1px" }}>{c.headline}</h2>
              <div style={{ fontSize: "17px", lineHeight: "1.8", color: "#333", whiteSpace: "pre-line", marginBottom: "40px" }}>{c.body}</div>
              <div style={{
                background: "#1a1a1a",
                color: "#FAFAF8",
                padding: "32px 36px",
                borderRadius: "2px",
                marginBottom: "40px"
              }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", letterSpacing: "2px", color: "#888", marginBottom: "12px" }}>KEY INSIGHT</div>
                <div style={{ fontSize: "20px", lineHeight: "1.5", fontStyle: "italic" }}>{c.keyInsight}</div>
              </div>
              <div style={{
                borderLeft: "3px solid #C84B4B",
                paddingLeft: "24px",
                marginBottom: "20px"
              }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", letterSpacing: "2px", color: "#888", marginBottom: "8px" }}>PROOF POINT — TOBIBRAIN CASE STUDY</div>
                <div style={{ fontSize: "16px", lineHeight: "1.7", color: "#444" }}>{c.proofPoint}</div>
              </div>
            </div>
          );
        })()}

        {/* Product */}
        {activeSection === "product" && current?.content && (() => {
          const c = current.content;
          return (
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "400", lineHeight: "1.2", marginBottom: "48px", letterSpacing: "-1px" }}>{c.headline}</h2>
              {c.layers.map((layer, i) => (
                <div key={i} style={{
                  marginBottom: "48px",
                  paddingBottom: "48px",
                  borderBottom: i < c.layers.length - 1 ? "1px solid #e0ddd8" : "none"
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "22px", fontWeight: "400", margin: 0 }}>{layer.name}</h3>
                    <span style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "10px",
                      letterSpacing: "2px",
                      padding: "3px 10px",
                      background: layer.status === "BUILT" ? "#2d5a2d" : layer.status === "PROVEN" ? "#1E3A8A" : "#8a6b1e",
                      color: "#fff",
                      borderRadius: "2px"
                    }}>{layer.status}</span>
                  </div>
                  <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#333", marginBottom: "12px" }}>{layer.description}</p>
                  <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#666", fontStyle: "italic", marginBottom: "8px" }}>{layer.effort}</p>
                  <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#888" }}>{layer.detail}</p>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Market */}
        {activeSection === "market" && current?.content && (() => {
          const c = current.content;
          return (
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "400", lineHeight: "1.2", marginBottom: "48px", letterSpacing: "-1px" }}>{c.headline}</h2>
              {c.segments.map((seg, i) => (
                <div key={i} style={{
                  marginBottom: "44px",
                  paddingBottom: "44px",
                  borderBottom: i < c.segments.length - 1 ? "1px solid #e0ddd8" : "none"
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "22px", fontWeight: "400", margin: 0 }}>{seg.name}</h3>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#C84B4B" }}>{seg.size}</span>
                  </div>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#555", marginBottom: "12px" }}><strong style={{ color: "#333" }}>The pain:</strong> {seg.pain}</p>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#555" }}><strong style={{ color: "#333" }}>The insight:</strong> {seg.insight}</p>
                </div>
              ))}
            </div>
          );
        })()}

        {/* GTM */}
        {activeSection === "gtm" && current?.content && (() => {
          const c = current.content;
          return (
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "400", lineHeight: "1.2", marginBottom: "48px", letterSpacing: "-1px" }}>{c.headline}</h2>
              {c.phases.map((phase, i) => (
                <div key={i} style={{
                  marginBottom: "48px",
                  paddingBottom: "48px",
                  borderBottom: i < c.phases.length - 1 ? "1px solid #e0ddd8" : "none"
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "22px", fontWeight: "400", margin: 0 }}>{phase.name}</h3>
                  </div>
                  <div style={{ display: "flex", gap: "24px", marginBottom: "16px" }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#888" }}>{phase.timeline}</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#888" }}>Cost: {phase.cost}</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#2d5a2d" }}>Rev: {phase.revenue}</span>
                  </div>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#333", marginBottom: "12px" }}>{phase.action}</p>
                  <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#555", marginBottom: "12px" }}><strong>Outcome:</strong> {phase.outcome}</p>
                  <div style={{
                    background: "#f5f3ee",
                    padding: "16px 20px",
                    borderRadius: "2px",
                    fontStyle: "italic",
                    fontSize: "15px",
                    color: "#666"
                  }}>{phase.key}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Moat */}
        {activeSection === "moat" && current?.content && (() => {
          const c = current.content;
          return (
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "400", lineHeight: "1.2", marginBottom: "48px", letterSpacing: "-1px" }}>{c.headline}</h2>
              {c.defenses.map((d, i) => (
                <div key={i} style={{
                  marginBottom: "40px",
                  paddingBottom: "40px",
                  borderBottom: i < c.defenses.length - 1 ? "1px solid #e0ddd8" : "none"
                }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "400", margin: "0 0 12px", color: "#1a1a1a" }}>{d.name}</h3>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#444" }}>{d.detail}</p>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Why */}
        {activeSection === "why" && current?.content && (() => {
          const c = current.content;
          return (
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "400", lineHeight: "1.2", marginBottom: "48px", letterSpacing: "-1px" }}>{c.headline}</h2>

              <div style={{ marginBottom: "40px" }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", letterSpacing: "2px", color: "#C84B4B", marginBottom: "8px" }}>WHY NOW</div>
                <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#333" }}>{c.whyNow}</p>
              </div>

              <div style={{ marginBottom: "40px" }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", letterSpacing: "2px", color: "#C84B4B", marginBottom: "8px" }}>WHY THIS</div>
                <p style={{ fontSize: "17px", lineHeight: "1.7", color: "#333" }}>{c.whyThis}</p>
              </div>

              <div style={{ marginBottom: "48px" }}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", letterSpacing: "2px", color: "#C84B4B", marginBottom: "8px" }}>WHY VINCE</div>
                <div style={{ fontSize: "17px", lineHeight: "1.8", color: "#333", whiteSpace: "pre-line" }}>{c.whyVince}</div>
              </div>

              <div style={{
                background: "#1a1a1a",
                color: "#FAFAF8",
                padding: "40px",
                borderRadius: "2px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "24px", fontStyle: "italic", lineHeight: "1.5", maxWidth: "500px", margin: "0 auto" }}>
                  {c.close}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #e0ddd8",
        padding: "24px 40px",
        display: "flex",
        justifyContent: "space-between",
        fontFamily: "'Courier New', monospace",
        fontSize: "10px",
        letterSpacing: "2px",
        color: "#bbb",
        textTransform: "uppercase"
      }}>
        <span>The Overlap — Product Strategy & GTM</span>
        <span>Vince Romanelli — VR Creative Group</span>
      </div>
    </div>
  );
}
