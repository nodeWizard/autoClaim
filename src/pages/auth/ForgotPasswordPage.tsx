import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center gradient-mesh p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            AC
          </div>
          <span className="text-lg font-bold">AutoClaim</span>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {sent ? 'Vérifiez votre e-mail' : 'Réinitialiser le mot de passe'}
            </CardTitle>
            <CardDescription>
              {sent
                ? 'Nous avons envoyé un lien de réinitialisation à votre adresse e-mail'
                : 'Saisissez votre e-mail pour recevoir un lien de réinitialisation'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="py-4 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
                <p className="mb-4 text-sm text-muted-foreground">
                  Si un compte existe pour <strong>{email}</strong>, vous recevrez bientôt un
                  lien de réinitialisation.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      placeholder="vous@star.tn"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Envoyer le lien
                </Button>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" /> Retour à la connexion
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
