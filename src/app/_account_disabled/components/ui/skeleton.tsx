function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`account-isolated animate-pulse rounded-md bg-muted ${className}`}
      {...props}
    />
  )
}

export { Skeleton }