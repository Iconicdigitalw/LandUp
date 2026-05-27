import { auth } from '@/lib/auth'
import { prisma } from '@landup/db'
import { notFound, redirect } from 'next/navigation'
import { EditorShell } from '@/components/editor/editor-shell'

interface EditorPageProps {
  params: { funnelId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const session = await auth()
  if (!session?.user) redirect('/auth/signin')

  const funnel = await prisma.funnel.findFirst({
    where: { id: params.funnelId, userId: session.user.id! },
    include: { pages: { orderBy: { order: 'asc' } }, theme: true },
  })

  if (!funnel) notFound()

  return <EditorShell funnel={JSON.parse(JSON.stringify(funnel))} />
}
