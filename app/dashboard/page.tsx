import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions';
import { prisma } from '@/lib/db';

export default async function DashboardFallbackRedirect() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Redirect SUPER_ADMIN
  if (session.role === 'SUPER_ADMIN') {
    redirect('/admin-gen');
  }
  
  // Redirect CLUB_ADMIN to their specific dynamic workspace
  if (session.role === 'CLUB_ADMIN') {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { managedClub: true }
    });

    if (user?.managedClub?.slug) {
      redirect(`/admin/${user.managedClub.slug}`);
    } else {
      redirect('/');
    }
  }

  // Redirect FAN
  if (session.role === 'FAN') {
    redirect('/dashboard/fan');
  }

  redirect('/');
}
