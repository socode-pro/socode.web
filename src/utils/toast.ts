import { toast } from 'bulma-toast'
// https://github.com/rfoel/bulma-toast

export const error = (message: string): void => {
  toast({
    message,
    type: 'is-danger',
    position: 'top-center',
    dismissible: true,
    duration: 4000,
    pauseOnHover: true,
    // animate: { in: 'fadeIn', out: 'fadeOut' },
  })
}

export const warn = (message: string): void => {
  toast({
    message,
    type: 'is-warning',
    position: 'top-right',
    dismissible: true,
    duration: 3000,
    pauseOnHover: true,
    // animate: { in: 'fadeIn', out: 'fadeOut' },
    opacity: 0.9,
  })
}

export const info = (message: string): void => {
  toast({
    message,
    type: 'is-info',
    position: 'bottom-center',
    pauseOnHover: true,
    // animate: { in: 'fadeIn', out: 'fadeOut' },
    opacity: 0.8,
  })
}
