import { useState } from "react"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import GitHubIcon from "@mui/icons-material/GitHub"
import { Button } from "@/components/ui/button"
import { LLM_CONTEXT_MARKDOWN } from "@/data/llmContext"
import { GITHUB_URL, LINKEDIN_URL } from "@/data/profileLinks"
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
        </div>
      </section>

      <section className="home-section home-contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="home-section__title">
          Contact
        </h2>
        <p className="home-section__support">
          Want to chat? Message me on LinkedIn, or see what I&apos;m building on GitHub.
        </p>
        <div className="home-contact__actions">
          <Button asChild>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon fontSize="small" />
              LinkedIn
            </a>
          </Button>
          <Button asChild variant="neutral">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <GitHubIcon fontSize="small" />
              GitHub
            </a>
          </Button>
        </div>
        <div className="home-contact__actions">
          <Button
            type="button"
            variant="neutral"
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
