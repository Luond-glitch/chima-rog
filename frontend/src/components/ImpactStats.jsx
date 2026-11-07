import Counter from './Counter'
import Icon from './Icon'
import { Stagger, StaggerItem } from './Reveal'

export default function ImpactStats({ stats, dark = true, limit }) {
  const list = limit ? stats.slice(0, limit) : stats
  return (
    <Stagger className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {list.map((s) => (
        <StaggerItem key={s.id}>
          <div className={`h-full rounded-3xl p-5 text-center transition duration-300 hover:-translate-y-1 sm:p-7 ${dark ? 'border border-white/15 bg-white/10 backdrop-blur-sm' : 'border border-sand bg-white shadow-soft'}`}>
            <div className={`mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl ${dark ? 'bg-sun text-forest-900' : 'bg-leaf/15 text-leaf-600'}`}><Icon name={s.icon} className="h-6 w-6" /></div>
            <p className={`font-display text-3xl font-extrabold sm:text-4xl ${dark ? '!text-white' : 'text-forest'}`}><Counter value={s.value} suffix={s.suffix} /></p>
            <p className={`mt-1 text-sm font-semibold ${dark ? 'text-sun-400' : 'text-terracotta'}`}>{s.label}</p>
            {s.description && <p className={`mt-1 hidden text-xs sm:block ${dark ? 'text-white/70' : 'text-earth'}`}>{s.description}</p>}
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
