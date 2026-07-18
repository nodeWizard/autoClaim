import { useAtom } from 'jotai'
import { themeAtom, authAtom } from '@/features/atoms'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function SettingsPage() {
  const [theme, setTheme] = useAtom(themeAtom)
  const [auth] = useAtom(authAtom)

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <div>
      <PageHeader title="Paramètres" description="Gérez votre compte et vos préférences AutoClaim" />

      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="ai">Préférences IA</TabsTrigger>
          <TabsTrigger value="organization">Organisation</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-lg text-primary">
                    {auth.user?.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{auth.user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {auth.user?.role === 'gestionnaire' ? 'Gestionnaire' : 'Assuré'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Nom complet</label>
                  <Input defaultValue={auth.user?.name} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">E-mail</label>
                  <Input defaultValue={auth.user?.email} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Rôle</label>
                  <Input
                    defaultValue={
                      auth.user?.role === 'gestionnaire' ? 'Gestionnaire sinistres' : 'Assuré'
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Service</label>
                  <Input defaultValue="Sinistres automobile" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Mode sombre</p>
                  <p className="text-xs text-muted-foreground">
                    Basculer entre thème clair et sombre
                  </p>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              </div>
              <Button>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Alertes de fraude IA', desc: 'Détections de sinistres à haut risque' },
                {
                  label: 'Analyse terminée',
                  desc: 'Lorsqu’une chaîne multi-agents est finalisée',
                },
                { label: 'Nouvelles assignations', desc: 'Quand un sinistre vous est assigné' },
                { label: 'Nouveaux sinistres', desc: 'Lors de nouvelles déclarations auto' },
                {
                  label: 'Résumé hebdomadaire',
                  desc: 'Rapport hebdomadaire de détection de fraude (TND)',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Mot de passe actuel</label>
                <Input type="password" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Nouveau mot de passe</label>
                <Input type="password" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Authentification à deux facteurs</p>
                  <p className="text-xs text-muted-foreground">
                    Renforcez la sécurité de votre compte
                  </p>
                </div>
                <Switch />
              </div>
              <Button>Mettre à jour le mot de passe</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>Préférences IA</CardTitle>
              <CardDescription>Configurez le comportement des agents AutoClaim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: 'Lancer l’analyse automatiquement',
                  desc: 'Exécuter les agents IA sur les nouveaux sinistres à haut risque',
                  checked: false,
                },
                {
                  label: 'Agent Vision',
                  desc: 'Analyser automatiquement les photos de dommages',
                  checked: true,
                },
                {
                  label: 'Agent Fraude',
                  desc: 'Recouper avec l’historique fraude automobile',
                  checked: true,
                },
                {
                  label: 'Génération auto de rapports',
                  desc: 'Créer le rapport après l’analyse IA',
                  checked: true,
                },
                {
                  label: 'Seuil de confiance',
                  desc: 'Confiance minimale pour signaler (défaut : 60 %)',
                  checked: true,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.checked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Nom de l’organisation</label>
                <Input defaultValue={auth.user?.company ?? 'STAR Assurances'} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Offre</label>
                <Input defaultValue="Enterprise — AutoClaim Sinistres Auto" disabled />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Devise</label>
                <Input defaultValue="TND (Dinar tunisien)" disabled />
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg border p-4">
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-xs text-muted-foreground">Gestionnaires</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-xs text-muted-foreground">Agents IA</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-2xl font-bold">312</p>
                  <p className="text-xs text-muted-foreground">Sinistres/mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
