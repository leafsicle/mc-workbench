import { useState } from "react"
import { Link } from "react-router-dom"
import Socials from "@/components/socials"
import { Button } from "@/components/ui/button"
import { LLM_CONTEXT_MARKDOWN } from "@/data/llmContext"
import useToast from "@/hooks/useToast"

const Home = () => {
  const showToast = useToast()
  const [copied, setCopied] = useState(false)

  const copyForLlms = async () => {
    try {
      await navigator.clipboard.writeText(LLM_CONTEXT_MARKDOWN)
      setCopied(true)
      showToast("Copied for LLMs — paste into your agent chat", "success")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast("Couldn't copy — select and copy manually if needed", "error")
    }
  }

  return (
    <div className="home-page">
      <section className="home-hero" aria-label="Introduction">
        <div className="home-hero__veil" aria-hidden="true" />
        <div className="home-hero__content">
          <p className="home-hero__brand home-hero__anim">Matt Cooke</p>
          <h1 className="home-hero__tagline home-hero__anim home-hero__anim--delay-1">
            Professional Hobbyist
          </h1>
          <p className="home-hero__support home-hero__anim home-hero__anim--delay-2">
            Software engineer by day. Experiments, plants, and leftover tools live in the scrapyard.
          </p>
          <div className="home-hero__ctas home-hero__anim home-hero__anim--delay-3">
            <Button asChild size="lg">
              <Link to="/scrapyard">Enter the Scrapyard</Link>
            </Button>
            <Button asChild variant="neutral" size="lg">
              <Link to="/contact">Say hello</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="home-section home-contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="home-section__title">
          Contact
        </h2>
        <p className="home-section__support">
          Find me on the usual channels, or send a note if you want to chat.
        </p>
        <div className="home-contact__socials">
          <Socials title="" avatarColor="#2e7d32" />
        </div>
        <div className="home-contact__actions">
          <Button asChild variant="neutral">
            <Link to="/contact">Open contact form</Link>
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={copyForLlms}
            aria-label="Copy About Me and resume markdown for LLMs">
            {copied ? "Copied" : "Copy for LLMs"}
          </Button>
        </div>
        <p className="home-llm-hint">
          Pastes structured About Me + professional history as markdown for other agents.
        </p>
      </section>
    </div>
  )
}

export default Home
