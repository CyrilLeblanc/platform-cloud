import React, { useState } from 'react'

type Mode = 'login' | 'register'

export default function LoginForm() {
	const [mode, setMode] = useState<Mode>('login')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [confirm, setConfirm] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setSuccess(null)

		if (!email || !password) return setError('Email and password are required')
		if (mode === 'register') {
			if (!name) return setError('Name is required')
			if (password !== confirm) return setError('Passwords do not match')
		}

		setLoading(true)
		try {
			const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
			const body: any = { email, password }
			if (mode === 'register') body.name = name

			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})

			const data = await res.json()
			if (!res.ok) {
				// Allow fallback to local mock if endpoint is not implemented
				if (res.status === 404) throw new Error('not-found')
				throw new Error(data?.error || 'Request failed')
			}
			// on success, store token if present
			if (data?.token) {
				localStorage.setItem('pc_token', data.token)
				setSuccess('Connecté — token enregistré en localStorage')
			} else {
				setSuccess((mode === 'login') ? 'Login réussite' : 'Inscription réussie')
			}
			// clean sensitive data
			setPassword('')
			setConfirm('')
		} catch (e: any) {
			// If server route not found or network error, fallback to local storage mock for dev
			if (e.message === 'not-found' || e.message === 'Failed to fetch') {
				try {
					if (mode === 'register') {
						const raw = localStorage.getItem('pc_users')
						const users = raw ? JSON.parse(raw) : []
						if (users.find((u: any) => u.email === email)) throw new Error('Un utilisateur avec cet e-mail existe déjà (local)')
						const user = { id: Date.now(), name, email, password }
						users.push(user)
						localStorage.setItem('pc_users', JSON.stringify(users))
						const token = 'local:' + btoa(email + ':' + Date.now())
						localStorage.setItem('pc_token', token)
						setSuccess("Inscription locale OK — token enregistré")
					} else {
						const raw = localStorage.getItem('pc_users')
						const users = raw ? JSON.parse(raw) : []
						const found = users.find((u: any) => u.email === email && u.password === password)
						if (!found) throw new Error('Utilisateur introuvable (local) — vérifie email / mot de passe')
						const token = 'local:' + btoa(email + ':' + Date.now())
						localStorage.setItem('pc_token', token)
						setSuccess('Login local OK — token enregistré')
					}
				} catch (err: any) {
					setError(err.message || 'Erreur locale')
				}
			} else {
				setError(e.message || 'Erreur inconnue')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
        <>
            <div className="mt-6">
                <h2 className='m-0 mb-2 text-center text-2xl'>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
                <p className="text-center mt-1 text-gray-600">{mode === 'login' ? 'Connecte toi pour accéder à ton compte.' : 'Crée un compte pour commencer.'}</p>
            </div>
            <div className="max-w-lg m-0 mx-auto bg-white rounded-2xl p-5 shadow-lg mt-10">

				<div className="flex gap-2 mb-3">
					<button onClick={() => { setMode('login'); setError(null); setSuccess(null) }} className={`p-2 rounded flex-1 cursor-pointer ${mode === 'login' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'}`}>Connexion</button>
					<button onClick={() => { setMode('register'); setError(null); setSuccess(null) }} className={`p-2 rounded flex-1 cursor-pointer ${mode === 'register' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'}`}>S'inscrire</button>
				</div>

                <form onSubmit={submit}>
					{mode === 'register' && (
										<label className="block mb-2">
											<div className="text-sm font-medium text-gray-700">Nom complet</div>
											<input value={name} onChange={e => setName(e.target.value)} className="block w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ton nom" />
										</label>
									)}

					<label className="block mb-2">
						<div className="text-sm font-medium text-gray-700">Email</div>
						<input type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
					</label>

					<label className="block mb-2">
						<div className="text-sm font-medium text-gray-700">Mot de passe</div>
						<input type="password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
					</label>

                    {mode === 'register' && (
						<label className="block mb-2">
							<div className="text-sm font-medium text-gray-700">Confirme le mot de passe</div>
							<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="block w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
						</label>
                    )}

					{error && <div className="text-red-600 mb-2">{error}</div>}
					{success && <div className="text-green-600 mb-2">{success}</div>}

					<div className="flex gap-2 mt-8">
						<button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-md bg-slate-800 text-white disabled:opacity-50">{loading ? 'Traitement...' : (mode === 'login' ? 'Se connecter' : "S'inscrire")}</button>
					</div>

                </form>
            </div>
        </>
	)
}

