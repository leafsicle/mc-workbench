import LinkedInIcon from "@mui/icons-material/LinkedIn"
import GitHubIcon from "@mui/icons-material/GitHub"
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward"
import { GITHUB_URL, LINKEDIN_URL } from "@/data/profileLinks"
import "./contact.css"

const CHANNELS = [
  {
    name: "LinkedIn",
    handle: "in/cookem529",
    href: LINKEDIN_URL,
    icon: LinkedInIcon,
    blurb: "Best way to reach me. Send a message and I'll get back to you."
  },
  {
    name: "GitHub",
    handle: "@leafsicle",
    href: GITHUB_URL,
    icon: GitHubIcon,
    blurb: "Side projects, experiments, and the source for this site."
  }
]

const Contact = () => (
  <div className="contact-page">
    <section className="contact-page__inner" aria-labelledby="contact-page-heading">
      <h1 id="contact-page-heading" className="contact-page__title">
        Contact
      </h1>
      <p className="contact-page__support">
        Want to chat? Message me on LinkedIn, or see what I&apos;m building on GitHub.
      </p>
      <ul className="contact-cards">
        {CHANNELS.map(({ name, handle, href, icon: Icon, blurb }) => (
          <li key={name}>
            <a className="contact-card" href={href} target="_blank" rel="noopener noreferrer">
              <span className="contact-card__icon" aria-hidden="true">
                <Icon fontSize="inherit" />
              </span>
              <span className="contact-card__body">
                <span className="contact-card__name">{name}</span>
                <span className="contact-card__handle">{handle}</span>
                <span className="contact-card__blurb">{blurb}</span>
              </span>
              <ArrowOutwardIcon className="contact-card__arrow" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  </div>
)

export default Contact
