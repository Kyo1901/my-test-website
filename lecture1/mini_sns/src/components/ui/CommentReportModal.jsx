import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { supabase } from '../../utils/supabase.js';

const REPORT_REASONS = ['스팸', '욕설/혐오', '성인', '기타'];

/**
 * 댓글 신고 모달
 *
 * Props:
 * @param {boolean} open - 열림 여부 [Required]
 * @param {function} onClose - 닫기 콜백 [Required]
 * @param {number} commentId - 신고 대상 댓글 ID [Required]
 * @param {number} reporterId - 신고자 사용자 ID [Required]
 *
 * Example usage:
 * <CommentReportModal open={open} onClose={handleClose} commentId={comment.id} reporterId={user.id} />
 */
const CommentReportModal = ({ open, onClose, commentId, reporterId }) => {
  const [reason, setReason] = useState('기타');
  const [detail, setDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await supabase.from('sns_comment_reports').upsert([{
      comment_id: commentId,
      reporter_id: reporterId,
      reason,
      detail: detail.trim() || null,
    }], { onConflict: 'comment_id,reporter_id' });
    setSubmitting(false);
    setDone(true);
    setTimeout(onClose, 1500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle fontWeight={700}>댓글 신고</DialogTitle>
      <DialogContent>
        { done ? (
          <Alert severity='success'>신고가 접수되었습니다. 검토 후 처리하겠습니다.</Alert>
        ) : (
          <>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              신고 사유를 선택해주세요.
            </Typography>
            <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
              { REPORT_REASONS.map((r) => (
                <FormControlLabel key={r} value={r} control={<Radio size='small' sx={{ color: '#FF8C42', '&.Mui-checked': { color: '#FF8C42' } }} />} label={r} />
              ))}
            </RadioGroup>
            <TextField
              placeholder='상세 내용 (선택)'
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              size='small'
              fullWidth
              multiline
              rows={2}
              sx={{ mt: 1.5 }}
            />
          </>
        )}
      </DialogContent>
      { !done && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} sx={{ color: '#888' }}>취소</Button>
          <Button variant='contained' onClick={handleSubmit} disabled={submitting}>
            { submitting ? '신고 중...' : '신고하기' }
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CommentReportModal;
