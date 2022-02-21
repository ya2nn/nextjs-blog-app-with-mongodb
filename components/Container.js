const Container = ({ children, extraClasses, isFull, ...extraParams }) => {
  const _className = isFull ? 'w-full' : 'container mx-auto px-4'

  return (
    <div className={`${_className} ${extraClasses}`} {...extraParams}>
      {children}
    </div>
  )
}

export default Container
