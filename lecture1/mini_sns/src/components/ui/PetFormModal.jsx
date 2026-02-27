import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { supabase } from '../../utils/supabase.js';

/**
 * 반려동물 등록/수정 모달
 *
 * Props:
 * @param {boolean} open - 열림 여부 [Required]
 * @param {function} onClose - 닫기 콜백 [Required]
 * @param {function} onSaved - 저장 완료 콜백 [Required]
 * @param {object|null} pet - 수정할 반려동물 데이터 (null이면 신규) [Optional]
 * @param {number} userId - 현재 사용자 ID [Required]
 *
 * Example usage:
 * <PetFormModal open={open} onClose={handleClose} onSaved={handleSaved} pet={null} userId={user.id} />
 */
const PetFormModal = ({ open, onClose, onSaved, pet = null, userId }) => {
  const isEdit = !!pet;
  const [form, setForm] = useState({ name: '', species: '강아지', breed: '', birthday: '', bio: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pet) {
      setForm({
        name: pet.name || '',
        species: pet.species || '강아지',
        breed: pet.breed || '',
        birthday: pet.birthday || '',
        bio: pet.bio || '',
      });
    } else {
      setForm({ name: '', species: '강아지', breed: '', birthday: '', bio: '' });
    }
    setError('');
  }, [pet, open]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim() || null,
      birthday: form.birthday || null,
      bio: form.bio.trim() || null,
    };

    if (isEdit) {
      await supabase.from('sns_pets').update(payload).eq('id', pet.id);
    } else {
      await supabase.from('sns_pets').insert([{ ...payload, user_id: userId }]);
    }
    setSubmitting(false);
    onSaved();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle fontWeight={700}>
        { isEdit ? '반려동물 수정' : '반려동물 등록' }
      </DialogTitle>
      <DialogContent>
        { error && <Alert severity='error' sx={{ mb: 2 }}>{ error }</Alert> }
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>
          <TextField
            label='이름 *'
            name='name'
            value={form.name}
            onChange={handleChange}
            size='small'
            fullWidth
          />
          <FormControl size='small' fullWidth>
            <InputLabel>종류</InputLabel>
            <Select
              name='species'
              value={form.species}
              label='종류'
              onChange={handleChange}
            >
              <MenuItem value='강아지'>🐶 강아지</MenuItem>
              <MenuItem value='고양이'>🐱 고양이</MenuItem>
              <MenuItem value='기타'>🐹 기타</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label='품종 (선택)'
            name='breed'
            value={form.breed}
            onChange={handleChange}
            size='small'
            fullWidth
            placeholder='골든 리트리버, 러시안블루...'
          />
          <TextField
            label='생일 (선택)'
            name='birthday'
            type='date'
            value={form.birthday}
            onChange={handleChange}
            size='small'
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='소개 (선택)'
            name='bio'
            value={form.bio}
            onChange={handleChange}
            size='small'
            fullWidth
            multiline
            rows={2}
            placeholder='우리 아이를 소개해주세요!'
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#888' }}>취소</Button>
        <Button variant='contained' onClick={handleSave} disabled={submitting}>
          { submitting ? '저장 중...' : '저장' }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PetFormModal;
