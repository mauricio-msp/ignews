import { ReactElement, cloneElement } from 'react'
import { useRouter } from 'next/router'
import Link, { LinkProps } from 'next/link'

// types
type ActiveLinkProps = LinkProps & {
  children: ReactElement
  activeClass: string
}

export function ActiveLink({
  children,
  activeClass,
  ...props
}: ActiveLinkProps) {
  const { asPath } = useRouter()

  const className = asPath === props.href ? activeClass : ''

  return (
    <Link {...props}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  )
}
