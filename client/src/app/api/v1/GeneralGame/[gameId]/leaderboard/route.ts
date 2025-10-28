import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: { gameId: string } }) {
 try {
  const { gameId } = context.params;

  if (!gameId) {
   return NextResponse.json({ error: 'Missing gameId' }, { status: 400 });
  }

  // ✅ כתובת מדויקת אל ה־Backend שלך
  const apiUrl = `http://localhost:5075/api/v1/GeneralGame/${gameId}/leaderboard`;

  const res = await fetch(apiUrl, { cache: 'no-store' });

  if (!res.ok) {
   return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: res.status });
  }

  const data = await res.json();

  // ✅ מבטיח שמתקבל מערך תקין גם אם אין נתונים
  const leaderboards = Array.isArray(data?.data?.leaderboards)
   ? data.data.leaderboards
   : [];

  return NextResponse.json({ leaderboards }, { status: 200 });
 } catch (err) {
  console.error('Leaderboard API Error:', err);
  return NextResponse.json({ error: 'Server error' }, { status: 500 });
 }
}
