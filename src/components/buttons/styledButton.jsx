import Button from '@mui/material/Button'

const StyledButton = ({ text, ...props }) => {
  return (
    <Button
      variant={props.variant || 'contained'}
      padding={props.padding || '1rem'}
      color={props.color || 'primary'}
      onClick={() => setNavCollapse(!navCollapse)}
    >
      {text}
    </Button>
  )
}
export default StyledButton
