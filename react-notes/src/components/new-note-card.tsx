import * as Dialog from '@radix-ui/react-dialog'
import { Check, Mic, X } from 'lucide-react'
import { FormEvent, useRef, useState } from 'react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

type NewNoteCardProps = {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [mode, setMode] = useState<'text' | 'audio' | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const speechTextRef = useRef<HTMLParagraphElement>(null)

  function handleModeChange(newMode: 'text' | 'audio') {
    if (newMode === 'audio') {
      return checkSpeechRecognitionSupport
    }
    return () => setMode(newMode)
  }

  function handleSetModeWhenClosed(open: boolean) {
    if (!open) setMode(null)
  }

  function cleanTextArea() {
    if (textAreaRef.current) {
      textAreaRef.current.value = ''
    }
  }

  function handleSaveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log(textAreaRef.current?.value)

    if (!textAreaRef.current?.value) {
      toast.error('Digite uma nota antes de salvar', {
        duration: 1000,
      })
      return
    }

    onNoteCreated(textAreaRef.current?.value || '')
    setMode(null)
    cleanTextArea()

    toast.success(`Nota salva com sucesso`)
  }

  function checkSpeechRecognitionSupport() {
    const isSpeechRecognitionSupported =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    if (!isSpeechRecognitionSupported) {
      toast.error('Seu navegador não suporta gravação de áudio', {
        duration: 2000,
      })
    }

    return isSpeechRecognitionSupported
  }

  function handleStartRecording() {
    if (!checkSpeechRecognitionSupport()) return
    setMode('audio')
    setIsRecording(true)

    const SpeedRecognitionApi =
      window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeedRecognitionApi()
    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true
    speechRecognition.onresult = (event) => {
      const trascription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      if (speechTextRef.current) {
        speechTextRef.current.textContent = trascription
      }
    }
    speechRecognition.onerror = (event) => {
      console.error(event.error)
    }
    speechRecognition.start()
  }

  function handleStopRecording() {
    if (speechRecognition) {
      speechRecognition.stop()
    }
    setIsRecording(false)
  }

  function handleAcceptRecordingResult() {
    if (speechTextRef.current && textAreaRef.current) {
      textAreaRef.current.value = `${textAreaRef.current.value} ${speechTextRef.current.textContent}`
    }
    handleStopRecording()
  }
  function handleDeclineRecordingResult() {
    if (speechTextRef.current) {
      speechTextRef.current.textContent = ''
    }
    handleStopRecording()
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
            className="relative z-20 flex h-[60dvh] w-full max-w-[640px] flex-col overflow-auto rounded-md bg-slate-700 outline-none"
          >
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
              <X className="size-5" />
            </Dialog.Close>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <header className="flex min-h-10 items-center gap-8">
                <span className="flex-1 text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>
                {mode && !isRecording && (
                  <button
                    type="button"
                    disabled={isRecording}
                    className={twMerge([
                      'mr-10 flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-slate-500',
                      'group border border-slate-500 hover:border-red-400 hover:text-red-400',
                      'transition-all disabled:cursor-not-allowed disabled:opacity-50',
                    ])}
                    onClick={handleStartRecording}
                  >
                    <Mic className="size-4 group-hover:animate-pulse" />
                    Gravar
                  </button>
                )}
              </header>
              {!mode && (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando
                  </button>{' '}
                  uma nota em áudio ou se preferir{' '}
                  <button
                    type="button"
                    onClick={handleModeChange('text')}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                </p>
              )}
              {mode && (
                <div className="grid min-h-0 flex-1 grid-rows-[repeat(2,minmax(10px,0.5fr))]">
                  <textarea
                    placeholder="Digite sua nota aqui..."
                    ref={textAreaRef}
                    autoFocus
                    className="resize-none bg-transparent text-sm leading-6 text-slate-400 outline-none"
                  />
                  {isRecording && (
                    <div className="flex flex-col gap-4 rounded bg-slate-800 p-4">
                      <span className="text-sm text-slate-500">
                        Sua gravação:
                      </span>
                      <div className="flex-1 overflow-auto">
                        <p
                          ref={speechTextRef}
                          className="bg-slate-800 text-sm leading-6 text-slate-300 outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-4 transition-all">
                        <button
                          type="button"
                          onClick={handleAcceptRecordingResult}
                          className="rounded bg-slate-700 p-2 text-lime-500 transition-all hover:bg-slate-600"
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleDeclineRecordingResult}
                          className="rounded bg-slate-700 p-2 text-red-500 transition-all hover:bg-slate-600"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {mode && (
              <>
                {/* {isRecording && (
                  <button
                    type="button"
                    className="group flex w-full items-center justify-center gap-3 bg-slate-900 py-4 font-medium text-slate-100 outline-none transition-all hover:bg-slate-800"
                    onClick={handleStopRecording}
                  >
                    <div className="size-3 animate-ping rounded-full bg-red-500 group-hover:animate-pulse" />
                    Gravando (clique para interromper)
                  </button>
                )} */}

                {!isRecording && (
                  <button
                    type="submit"
                    className="w-full bg-lime-400 py-4 font-medium text-lime-950 outline-none transition-all hover:bg-lime-500"
                  >
                    Salvar nota
                  </button>
                )}
              </>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
