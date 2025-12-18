import React, { useState } from 'react'
import { DefaultApiFactory } from '../../../src/generated/api/api'
import { Configuration } from '../../../src/generated/api/configuration'
import * as API from '../../../src/wrapper/wrapper';
import { useNavigate, useLocation } from "react-router";
import { useAuth } from '../../context/AuthContext'

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
	const navigate = useNavigate()
	const auth = useAuth()
	const location = useLocation()
	const from = (location.state as any)?.from ?? '/gallery'

	// call login endpoint and return parsed data
	const handleLogin = async (email: string, password: string) => {
		const result = await API.loginUser(email, password)
		const data = (result as any)?.data ?? (result as any)
		return data
	}

	const handleRegister = async (name: string, email: string, password: string) => {
		const reg = await API.registerUser(name, password, email)
		const data = (reg as any)?.data ?? (reg as any)
		// after register, attempt login
		return handleLogin(email, password)
	}

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
			// Use generated OpenAPI client (DefaultApiFactory)
			const cfg = new Configuration({ basePath: import.meta.env.VITE_API_BASE_URL ?? undefined })
			const api = DefaultApiFactory(cfg)

			// Call the appropriate endpoint using the generated client
			const result = mode === 'login'
				? await handleLogin(email, password)
				: await handleRegister(name, email, password)

			const data = result
			// The generated client may return token or user
			const token = data?.token || data?.access_token || null
			const user = data?.user ?? data?.result ?? data

			if (token) {
				auth.login(token, user)
				localStorage.setItem('pc_token', token)
				setSuccess('Connecté — token enregistré en localStorage')
			} else if (user) {
				auth.setUser(user)
				setSuccess('Connecté')
			}

			// redirect to original location
			navigate(from, { replace: true })
			// clean sensitive data
			setPassword('')
			setConfirm('')
		} catch (e: any) {
			// For any error returned by the API, display a classic server error message.
			// Try to show a meaningful message coming from the backend (Axios error formats).
			const serverMessage = e?.response?.data?.error || e?.response?.data?.message || e?.response?.data || e?.message
			setError(serverMessage || 'Erreur serveur — vérifie les logs du serveur')
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

