import { useCallback, useRef, useEffect } from 'react'

export const openModal = (modalId) => {
  const modal = document.querySelector(`[data-modal-id='${modalId}']`)
  modal.classList.remove('hidden')
  modal.removeAttribute('aria-hidden')
  document.body.style.overflow = 'hidden'
}

export const closeModal = (modalId) => {
  const modal = document.querySelector(`[data-modal-id='${modalId}']`)
  modal.classList.add('hidden')
  modal.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
}


const Modal = ({
  modalId,
  children,
  extraClasses,
  containerExtraClasses,
  closeExtraClasses,
  contentExtraClasses,
  color,
  closeButtonColor,
  ...extraParams
}) => {
  const modalRef = useRef(null)
  const modalContainerRef = useRef(null)

  const handleEsc = useCallback((e) => {
    const code = e.keyCode || e.which
    if (code === 27) {
      closeModal(modalId)
    }
  }, [modalId])

  const handleOutsideClick = useCallback((e) => {
    !modalContainerRef.current?.contains(e.target) && closeModal(modalId)
  }, [modalId])

  useEffect(() => {
    const {current} = modalRef
    document.addEventListener('keyup', handleEsc)

    current.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('keyup', handleEsc)
      current.removeEventListener('click', handleOutsideClick)
    }
  }, [handleEsc, handleOutsideClick])

  let setColor
  switch (color) {
    case 'primary':
      setColor = 'bg-surfacePrimary text-onSurfacePrimary'
      break
    case 'secondary':
      setColor = 'bg-surfaceSecondary text-onSurfaceSecondary'
      break
  }

  let setCloseButtonColor
  switch (closeButtonColor) {
    case 'primary':
      setCloseButtonColor = 'text-primary'
      break
    case 'secondary':
      setCloseButtonColor = 'text-secondary'
      break
  }

  return (
    <div
      className={`m-modal fixed inset-0 z-[60] hidden ${extraClasses}`}
      ref={modalRef}
      data-modal-id={modalId}
      {...extraParams}
    >
      <div
        className={`m-modal__background flex h-screen w-screen items-center bg-gray-900 bg-opacity-95`}
        id={modalId}
        aria-labelledby='modalContent'
        aria-modal='true'
        role='dialog'
      >
        <div
          ref={modalContainerRef}
          className={`m-modal__surface container relative h-full w-full px-[20px] py-[50px] md:mx-3 md:mx-auto md:max-h-96 md:max-w-2xl bg-white ${setColor} ${containerExtraClasses}`}
        >
          <button
            className={`m-modal_closeBtn absolute top-[20px] right-[20px] flex h-[20px] w-[20px] items-center justify-center rounded-full border text-2xl leading-3 ${setCloseButtonColor}`}
            onClick={() => closeModal(modalId)}
          >
            x
          </button>

          <div
            className={`m-modal__content max-h-full overflow-y-auto scrollbar-hide ${contentExtraClasses}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
