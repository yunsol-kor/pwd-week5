import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { restaurantAPI, submissionAPI } from '../services/api';
import type { Submission } from '../types';
import './Management.css';

export default function SubmissionsPage() {
  const client = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data, isLoading, error } = useQuery({ queryKey: ['submissions'], queryFn: () => submissionAPI.listSubmissions() });
  async function act(item: Submission, action: 'approve' | 'reject' | 'delete') {
    setBusy(true);
    try {
      if (action === 'approve') {
        await restaurantAPI.createRestaurant({ name: item.restaurantName, category: item.category,
          location: item.location, priceRange: item.priceRange, description: item.review,
          recommendedMenu: item.recommendedMenu });
        await submissionAPI.updateSubmission(item.id, { status: 'approved' });
        await client.invalidateQueries({ queryKey: ['restaurants'] });
        await client.invalidateQueries({ queryKey: ['popular-restaurants'] });
      } else if (action === 'reject') {
        await submissionAPI.updateSubmission(item.id, { status: 'rejected' });
      } else { await submissionAPI.deleteSubmission(item.id); }
      await client.invalidateQueries({ queryKey: ['submissions'] });
      toast.success('처리했습니다.');
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : '처리에 실패했습니다.'); }
    finally { setBusy(false); }
  }
  return <section className="management">
    <h2>제보 관리</h2><p>이 브라우저에서 작성한 제보를 확인합니다. 승인하면 맛집 목록에 등록됩니다.</p>
    {isLoading && <p role="status">불러오는 중…</p>}
    {error && <p role="alert">{error.message}</p>}
    {data?.data.length === 0 && <p>아직 제보가 없습니다.</p>}
    {data?.data.map(item => <article key={item.id}>
      <h3>{item.restaurantName}</h3><p>{item.category} · {item.location}</p><p>{item.review}</p>
      <p>상태: {{ pending: '대기', approved: '승인', rejected: '반려' }[item.status]}</p>
      <button disabled={busy || item.status !== 'pending'} onClick={() => void act(item, 'approve')}>승인 및 맛집 등록</button>
      <button disabled={busy || item.status !== 'pending'} onClick={() => void act(item, 'reject')}>반려</button>
      <button disabled={busy} onClick={() => void act(item, 'delete')}>제보 삭제</button>
    </article>)}
  </section>;
}

