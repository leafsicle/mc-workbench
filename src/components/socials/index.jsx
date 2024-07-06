import { Grid, Avatar, Typography } from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import { green } from '@mui/material/colors'

const defaultSocials = [
  {
    id: 0,
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/in/cookem529/',
    icon: LinkedInIcon,
    show: true
  },
  {
    id: 1,
    name: 'GitHub',
    link: 'https://github.com/leafsicle',
    icon: GitHubIcon,
    show: true
  }
]

const Socials = ({
  socials = defaultSocials,
  avatarColor = green[500],
  avatarVariant = 'rounded',
  title = 'Contact'
}) => {
  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
    >
      <Grid item xs={12}>
        <Typography variant='h6' gutterBottom>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {socials
            .filter(social => social.show)
            .map(social => (
              <Grid item key={social.id}>
                <a
                  href={social.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ textDecoration: 'none' }}
                >
                  <Avatar sx={{ bgcolor: avatarColor }} variant={avatarVariant}>
                    <social.icon />
                  </Avatar>
                </a>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Socials
