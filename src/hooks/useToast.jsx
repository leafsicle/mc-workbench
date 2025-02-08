import { toast } from "react-toastify"

const useToast = () => {
  const showToast = (message, type = "info") => {
    toast(message, {
      type: type,
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
      closeOnClick: true,
      closeButton: true,
      draggable: true
    })
  }

  return showToast
}

export default useToast
