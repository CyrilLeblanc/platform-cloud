import React from 'react'
import { Link } from 'react-router'

export default function Header() {
	const [open, setOpen] = React.useState(false)

	return (
		<header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white left-0 right-0 z-40 shadow">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-3">
						<Link to="/" className="flex items-center gap-3 no-underline text-white">
							<div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center font-bold text-sm">CG</div>
							<div className="text-lg font-semibold">Cloud Gallery</div>
						</Link>
					</div>

					<nav className="hidden md:flex items-center gap-6 text-sm font-medium">
						<Link to="/" className="hover:text-slate-200">Accueil</Link>
						<Link to="/gallery" className="hover:text-slate-200">Galerie</Link>
						<Link to="/dashboard" className="hover:text-slate-200">Dashboard</Link>
						<Link to="/login" className="px-3 py-1 border border-transparent rounded bg-white/10 hover:bg-white/20">Se connecter</Link>
					</nav>

					<div className="md:hidden">
						<button onClick={() => setOpen(o => !o)} aria-label="menu" className="p-2 rounded-md hover:bg-white/10">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M3.75 5.75h16.5M3.75 12h16.5M3.75 18.25h16.5"} />
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				{open && (
					<div className="md:hidden py-2 border-t border-white/5">
						<div className="flex flex-col gap-2 py-2 text-sm">
							<Link to="/" onClick={() => setOpen(false)} className="px-2 py-2 hover:bg-white/5 rounded">Accueil</Link>
							<Link to="/gallery" onClick={() => setOpen(false)} className="px-2 py-2 hover:bg-white/5 rounded">Galerie</Link>
							<Link to="/dashboard" onClick={() => setOpen(false)} className="px-2 py-2 hover:bg-white/5 rounded">Dashboard</Link>
							<Link to="/login" onClick={() => setOpen(false)} className="px-2 py-2 border border-white/10 rounded text-center">Se connecter</Link>
						</div>
					</div>
				)}
			</div>
		</header>
	)
}
