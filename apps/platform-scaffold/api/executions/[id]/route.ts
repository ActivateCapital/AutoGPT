import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../../../packages/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const execution = await prisma.execution.findUnique({
    where: { id: params.id },
    include: {
      agent: true,
    },
  })

  if (!execution) {
    return NextResponse.json({ error: 'Execution not found' }, { status: 404 })
  }

  if (execution.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(execution)
}
