import { tv } from 'tailwind-variants'

import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

const styles = tv({
  slots: {
    input: [
      'w-full bg-transparent text-3xl font-semibold tracking-tight',
      'outline-none placeholder:text-slate-500',
    ],
  },
})

export function App() {
  const { input } = styles()
  return (
    <div className="mx-auto my-10 max-w-6xl space-y-6 p-4">
      <img src={logo} alt="" />
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className={input()}
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid auto-rows-[250px] grid-cols-3 gap-6">
        <NewNoteCard />
        {Array.from({ length: 6 }).map((_, index) => (
          <NoteCard key={index} />
        ))}
      </div>
    </div>
  )
}
