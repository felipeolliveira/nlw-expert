import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

type NoteCardProps = {
  note: {
    date: Date
    content: string
  }
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={twMerge([
          'relative flex flex-col gap-3 overflow-hidden rounded-md bg-slate-800 p-5 text-left',
          'outline-none transition-all hover:ring-2 hover:ring-lime-400',
          'focus-visible:ring-2 focus-visible:ring-lime-400',
        ])}
      >
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
        <p className="text-sm leading-6 text-slate-400">{note.content}</p>
        <div
          className={twMerge([
            'pointer-events-none absolute bottom-0 left-0 right-0 h-1/2',
            'bg-gradient-to-b from-black/0 to-black/60',
          ])}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50" />
        <Dialog.Content className="fixed inset-0 z-10 flex items-center justify-center">
          <Dialog.Close className="fixed inset-0 z-0 cursor-default" />
          <div className="relative z-20 flex h-[60dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-md bg-slate-700 outline-none">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
              <X className="size-5" />
            </Dialog.Close>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                {formatDistanceToNow(note.date, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </span>
              <p className="text-sm leading-6 text-slate-400">{note.content}</p>
            </div>
            <button
              type="button"
              className="group w-full bg-slate-800 py-4 font-medium text-slate-300 outline-none"
            >
              Deseja{' '}
              <span className="text-red-400 group-hover:underline">
                apagar essa nota?
              </span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
