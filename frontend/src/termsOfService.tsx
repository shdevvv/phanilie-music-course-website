import { useEffect } from 'react'

function TermsOfService() {
  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <main className="pt-8 pb-24 px-6 max-w-[900px] mx-auto w-full flex-grow space-y-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 py-8">
        <span className="inline-block px-3 py-1 rounded-full bg-[#e8cdc1]/20 text-[#6e5a51] text-xs font-semibold uppercase tracking-wider">
          Legal Documents
        </span>
        <h1 className="font-display-lg text-display-lg text-[#6e5a51] font-bold">Terms of Service</h1>
        <p className="text-[#81756f] text-xs uppercase tracking-widest">
          Last Updated: June 2026
        </p>
      </div>

      {/* Terms Content */}
      <div className="glossy-thick-rose-gold-gradient-border rounded-[16px] p-8 md:p-10 space-y-8 text-[#4f4540] text-sm md:text-base leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or using the Phanilie Music platform, website, covers catalog, or course lessons, you agree to 
            be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using 
            our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            2. Intellectual Property Rights
          </h2>
          <p>
            All educational materials, video lessons, chord progression guides, arrangements, custom illustrations, and 
            sheet music PDFs/MIDIs published on Phanilie Music are owned by or licensed to us. You are granted a limited, 
            non-transferable, personal license to download purchased sheet music and view video lessons for your personal, 
            non-commercial study. Sharing, distributing, or reselling our digital assets is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            3. Account Registration & Security
          </h2>
          <p>
            To enroll in our jazz and gospel curriculum, you must maintain an active account. You agree to safeguard your 
            credentials and are fully responsible for all activity under your login session. We reserve the right to 
            terminate accounts that violate safety guidelines or distribute sheet music assets unauthorizedly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            4. Payments, Subscriptions & Refunds
          </h2>
          <p>
            Certain services (Pro Membership, premium sheet music downloads) require payments. Monthly subscriptions automatically 
            renew unless canceled through your Account Settings. Due to the digital nature of sheet music and courses, all one-time 
            purchases are final. Subscriptions can be canceled at any time, leaving your premium access active until the end of your 
            current billing cycle.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            5. API Gateway Usage & Limitations
          </h2>
          <p>
            Phanilie Music provides compatibility with a local C# API Gateway for database synchronization. We provide the C# backend 
            code and bat script "as is". You are responsible for ensuring your system meets the requirements to run local SQL/JSON 
            database storage without causing network security compromises.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to update these Terms of Service at any time. We will notify you of updates by posting the revised 
            text here and updating the "Last Updated" date. Continuing to use Phanilie Music after revisions are published constitutes 
            your agreement to the updated Terms.
          </p>
        </section>

      </div>

    </main>
  )
}

export default TermsOfService
