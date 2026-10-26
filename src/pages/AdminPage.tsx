import { useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { restaurantAPI } from '../services/api';
import './Management.css';

export default function AdminPage() {
  const client = useQueryClient();
  const [saving, setSaving] = useState(false);
  const { data, isLoading, error } = useQuery({ queryKey: ['restaurants'], queryFn: restaurantAPI.getRestaurants });

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const text = (name: string) => String(values.get(name) ?? '').trim();
    if (!text('name') || !text('category') || !text('location')) {
      toast.error('이름, 분류, 위치를 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      await restaurantAPI.createRestaurant({
        name: text('name'), category: text('category'), location: text('location'),
        priceRange: text('priceRange'), rating: Number(text('rating') || 0),
        description: text('description'), image: text('image'),
        recommendedMenu: text('recommendedMenu').split(/[,\n]/).map(item => item.trim()).filter(Boolean),
      });
      form.reset();
      await client.invalidateQueries({ queryKey: ['restaurants'] });
      await client.invalidateQueries({ queryKey: ['popular-restaurants'] });
      toast.success('맛집을 등록했습니다.');
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : '등록에 실패했습니다.');
    } finally { setSaving(false); }
  }

  return <section className="management">
    <h2>맛집 관리</h2>
    <p>새 맛집을 등록하고 목록에서 확인하세요.</p>
    <form onSubmit={create}>
      <fieldset disabled={saving}>
        <legend>새 맛집 등록</legend>
        <label>이름 *<input name="name" required /></label>
        <label>분류 *<select name="category" required><option value="">선택하세요</option>{['한식','중식','일식','양식','아시안','분식','카페','기타'].map(item => <option key={item}>{item}</option>)}</select></label>
        <label>위치 *<input name="location" required /></label>
        <label>가격대<input name="priceRange" /></label>
        <label>평점<input name="rating" type="number" min="0" max="5" step="0.01" defaultValue="0" /></label>
        <label>설명<textarea name="description" /></label>
        <label>추천 메뉴 (쉼표 또는 줄바꿈으로 구분)<textarea name="recommendedMenu" /></label>
        <label>이미지 주소<input name="image" type="url" /></label>
        <button type="submit">{saving ? '등록 중…' : '맛집 등록'}</button>
      </fieldset>
    </form>
    {isLoading && <p role="status">목록을 불러오는 중…</p>}
    {error && <p role="alert">{error.message}</p>}
    {data?.data.map(item => <article key={item.id}>
      <h3>{item.name}</h3><p>{item.category} · {item.location}</p>
      <button disabled title="이번 주 서버는 수정 API를 제공하지 않습니다.">수정</button>
      <button disabled title="이번 주 서버는 삭제 API를 제공하지 않습니다.">삭제</button>
    </article>)}
  </section>;
}

