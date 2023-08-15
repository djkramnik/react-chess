export type CxProps =
  | Array<string | undefined>
  | Record<string, boolean>

export const cx = (props: CxProps): string => {
  if (Array.isArray(props)) {
    return props.filter(s => s).join(',')
  }
  return Object.entries(props)
    .reduce((acc, [name, include]) => {
      return include ? acc.concat(name) : acc
    }, '')
}