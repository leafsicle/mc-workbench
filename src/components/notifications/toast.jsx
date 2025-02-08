import { toast } from "react-toastify"

const CallToast = (
  text,
  type = toast.TYPE.SUCCESS,
  position = toast.POSITION.TOP_CENTER,
  autoClose = 1500,
  key = "submit"
) => {
  toast(text, {
    type,
    position,
    autoClose,
    key
  })
}

export default CallToast
