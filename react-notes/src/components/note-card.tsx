import { twMerge } from 'tailwind-merge'

export function NoteCard() {
  return (
    <button
      className={twMerge([
        'relative space-y-3 overflow-hidden rounded-md bg-slate-800 p-5 text-left',
        'outline-none transition-all hover:ring-2 hover:ring-lime-400',
        'focus-visible:ring-2 focus-visible:ring-lime-400',
      ])}
    >
      <span className="text-sm font-medium text-slate-300">há 2 dias</span>
      <p className="text-sm leading-6 text-slate-400">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Lorem ipsum
        dolor, sit amet consectetur adipisicing elit. Deleniti, temporibus?
        Expedita cumque vero, minima deserunt totam optio rerum quos, aperiam
        soluta laboriosam nihil obcaecati. Quas hic necessitatibus consequatur
        iusto ducimus!
      </p>
      <div
        className={twMerge([
          'pointer-events-none absolute bottom-0 left-0 right-0 h-1/2',
          'bg-gradient-to-b from-black/0 to-black/60',
        ])}
      />
    </button>
  )
}
