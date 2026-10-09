import { Link } from "react-router-dom"
import Socials from "@/components/socials"
import { Button } from "@/components/ui/button"

const Home = () => {
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

      <section className="home-section home-scrapyard-teaser" aria-labelledby="scrapyard-heading">
        <h2 id="scrapyard-heading" className="home-section__title">
          The Scrapyard
        </h2>
        <p className="home-section__support">
          A pile of things I wired up online and left running — calculators, workout logs, space
          pictures, a trebuchet. Nothing polished on purpose.
        </p>
        <Button asChild variant="neutral">
          <Link to="/scrapyard">Browse the pile →</Link>
        </Button>
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
        <Button asChild variant="neutral" className="mt-4">
          <Link to="/contact">Open contact form</Link>
        </Button>
      </section>
    </div>
  )
}

export default Home
