import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { FormEvent, useRef, useState } from 'react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function NewNoteCard() {
  const [mode, setMode] = useState<'text' | 'audio' | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  function handleModeChange(newMode: 'text' | 'audio') {
    return () => setMode(newMode)
  }

  function handleSetModeWhenClosed(open: boolean) {
    if (!open) setMode(null)
  }

  function handleSaveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success(`Nota salva com sucesso: ${textAreaRef.current?.value}`)
  }

  return (
    <Dialog.Root onOpenChange={handleSetModeWhenClosed}>
      <Dialog.Trigger
        className={twMerge([
          'flex flex-col gap-3 rounded-md bg-slate-700 p-5 text-left',
          'outline-none transition-all hover:ring-2 hover:ring-lime-400',
          'focus-visible:ring-2 focus-visible:ring-lime-400',
        ])}
      >
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em aúdio que será convertida em texto automaticamente
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50" />
        <Dialog.Content className="fixed inset-0 z-10 flex items-center justify-center">
          <Dialog.Close className="fixed inset-0 z-0 cursor-default" />
          <form
            onSubmit={handleSaveNote}
            className="relative z-20 flex h-[60dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-md bg-slate-700 outline-none"
          >
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
              <X className="size-5" />
            </Dialog.Close>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <header className="flex min-h-10 items-center gap-8">
                <span className="flex-1 text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>
                {mode && (
                  <div className="mr-8 grid grid-cols-2 rounded-full border border-slate-600">
                    <button
                      className={twMerge([
                        'rounded-l-full p-0.5 text-sm font-medium text-slate-500',
                        mode === 'audio' && 'bg-lime-500/10 text-lime-300',
                      ])}
                      onClick={handleModeChange('audio')}
                    >
                      áudio
                    </button>
                    <button
                      className={twMerge([
                        'rounded-r-full px-2 py-1 text-sm font-medium text-slate-500',
                        mode === 'text' && 'bg-lime-500/10 text-lime-300',
                      ])}
                      onClick={handleModeChange('text')}
                    >
                      texto
                    </button>
                  </div>
                )}
              </header>
              {!mode && (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    onClick={handleModeChange('audio')}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando
                  </button>{' '}
                  uma nota em áudio ou se preferir{' '}
                  <button
                    onClick={handleModeChange('text')}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                </p>
              )}
              {mode === 'audio' && <p>Pronto para gravar audio</p>}
              {mode === 'text' && (
                <textarea
                  placeholder="Digite sua nota aqui..."
                  ref={textAreaRef}
                  autoFocus
                  className="flex-1 resize-none bg-transparent text-sm leading-6 text-slate-400 outline-none"
                />
              )}
            </div>
            {mode && (
              <button
                type="submit"
                className="w-full bg-lime-400 py-4 font-medium text-lime-950 outline-none transition-all hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
