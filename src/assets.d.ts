declare module '*.webp' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.gif' {
  const src: string
  export default src
}
declare module '*.svg' {
  const src: string
  export default src
}
declare module '*.mp3' {
  const src: string
  export default src
}
declare module '*.mp4' {
  const src: string
  export default src
}
declare module 'react-router-dom' {
  export function Link({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: unknown }): React.JSX.Element
  export function NavLink({ to, children, ...props }: { to: string; children: React.ReactNode; className?: string | ((props: { isActive: boolean; isPending: boolean }) => string); [key: string]: unknown }): React.JSX.Element
  export function useNavigate(): (to: string) => void
  export function useParams(): Record<string, string>
}
