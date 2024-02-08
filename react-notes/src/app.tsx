import { useState } from 'react'
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

type Note = {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesFromLocalStorage = localStorage.getItem('app/notes@1.0.0')
    if (notesFromLocalStorage) {
      return JSON.parse(notesFromLocalStorage)
    }
    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)
    localStorage.setItem('app/notes@1.0.0', JSON.stringify(notesArray))
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(search.toLowerCase()),
  )

  const { input } = styles()
  return (
    <div className="mx-auto my-10 max-w-6xl space-y-6 p-4">
      <img src={logo} alt="" />
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          onChange={handleSearchChange}
          className={input()}
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid auto-rows-[250px] grid-cols-3 gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={{
              date: note.date,
              content: note.content,
            }}
          />
        ))}
      </div>
    </div>
  )
}
