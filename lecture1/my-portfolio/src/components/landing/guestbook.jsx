import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../../utils/supabase-client';

/**
 * Guestbook 컴포넌트
 * 방명록 작성 폼 및 목록 표시
 *
 * Props: 없음 (Supabase에서 데이터 직접 패치)
 *
 * Example usage:
 * <Guestbook />
 */

const EMOJI_OPTIONS = ['👋', '❤️', '🔥', '✨', '😊', '🎉', '👍', '🙌'];

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#F5F5F7',
    borderRadius: 1.5,
    '& fieldset': { borderColor: '#2A2A2A' },
    '&:hover fieldset': { borderColor: '#444' },
    '&.Mui-focused fieldset': { borderColor: '#0071E3' },
  },
  '& .MuiInputLabel-root': { color: '#6E6E73' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#0071E3' },
};

function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    message: '',
    email: '',
    emoji: '👋',
  });

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('portfolio_guestbook')
      .select('id, name, message, emoji, created_at')
      .order('created_at', { ascending: false });

    if (!error) setEntries(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmojiSelect = (emoji) => {
    setForm((prev) => ({ ...prev, emoji }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    setIsSubmitting(true);

    const payload = {
      name: form.name.trim(),
      message: form.message.trim(),
      emoji: form.emoji,
      ...(form.email.trim() && { email: form.email.trim() }),
    };

    const { error } = await supabase.from('portfolio_guestbook').insert([payload]);

    if (!error) {
      setForm({ name: '', message: '', email: '', emoji: '👋' });
      await fetchEntries();
    }

    setIsSubmitting(false);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Box>
      {/* 구분선 */}
      <Box sx={{ width: '100%', height: '1px', bgcolor: '#2A2A2A', mb: 5 }} />

      <Typography
        variant="overline"
        sx={{ color: '#0071E3', fontWeight: 600, letterSpacing: 2, display: 'block', mb: 1 }}
      >
        Guestbook
      </Typography>
      <Box sx={{ width: 32, height: 3, bgcolor: '#0071E3', borderRadius: 2, mb: 4 }} />

      {/* 작성 폼 */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: '#111111',
          border: '1px solid #2A2A2A',
          borderRadius: 2,
          p: 3,
          mb: 5,
        }}
      >
        {/* 이모지 선택 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {EMOJI_OPTIONS.map((emoji) => (
            <Box
              key={emoji}
              onClick={() => handleEmojiSelect(emoji)}
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                borderRadius: 1.5,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: form.emoji === emoji ? '#0071E3' : '#2A2A2A',
                bgcolor: form.emoji === emoji ? 'rgba(0,113,227,0.1)' : 'transparent',
                transition: 'all 0.15s',
                '&:hover': { borderColor: '#444' },
              }}
            >
              {emoji}
            </Box>
          ))}
        </Box>

        {/* 이름 / 이메일 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            label="이름 *"
            name="name"
            value={form.name}
            onChange={handleChange}
            size="small"
            inputProps={{ maxLength: 50 }}
            sx={textFieldSx}
          />
          <TextField
            label="이메일 (선택)"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            size="small"
            sx={textFieldSx}
          />
        </Box>

        {/* 메시지 */}
        <TextField
          label="메시지 *"
          name="message"
          value={form.message}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          inputProps={{ maxLength: 300 }}
          sx={{ ...textFieldSx, mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || !form.name.trim() || !form.message.trim()}
          sx={{
            bgcolor: '#0071E3',
            borderRadius: '980px',
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#0077ED' },
            '&.Mui-disabled': { bgcolor: '#1C1C1E', color: '#3A3A3C' },
          }}
        >
          {isSubmitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : '방명록 남기기'}
        </Button>
      </Box>

      {/* 방명록 목록 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#0071E3' }} />
        </Box>
      ) : entries.length === 0 ? (
        <Typography sx={{ color: '#3A3A3C', textAlign: 'center', py: 4 }}>
          아직 방명록이 없어요. 첫 번째로 남겨보세요! 👋
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {entries.map((entry) => (
            <Box
              key={entry.id}
              sx={{
                display: 'flex',
                gap: 2,
                p: 2.5,
                bgcolor: '#111111',
                border: '1px solid #2A2A2A',
                borderRadius: 2,
              }}
            >
              {/* 이모지 */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: '#1C1C1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0,
                }}
              >
                {entry.emoji}
              </Box>
              {/* 내용 */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography sx={{ color: '#F5F5F7', fontWeight: 600, fontSize: '0.9rem' }}>
                    {entry.name}
                  </Typography>
                  <Typography sx={{ color: '#3A3A3C', fontSize: '0.75rem' }}>
                    {formatDate(entry.created_at)}
                  </Typography>
                </Box>
                <Typography sx={{ color: '#A1A1A6', fontSize: '0.9rem', lineHeight: 1.6, wordBreak: 'break-word' }}>
                  {entry.message}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Guestbook;
