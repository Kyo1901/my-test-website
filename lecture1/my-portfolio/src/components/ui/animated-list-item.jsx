import { motion } from 'framer-motion';

/**
 * AnimatedListItem 컴포넌트 (Magic UI 기반)
 * 리스트 아이템이 커지면서 나타나는 스프링 애니메이션
 *
 * Props:
 * @param {React.ReactNode} children - 애니메이션을 적용할 콘텐츠 [Required]
 *
 * Example usage:
 * <AnimatedListItem><GuestbookEntry /></AnimatedListItem>
 */
function AnimatedListItem({ children }) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 40 }}
      style={{ width: '100%' }}
    >
      { children }
    </motion.div>
  );
}

export default AnimatedListItem;
