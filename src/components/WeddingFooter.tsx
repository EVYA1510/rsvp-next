import { motion } from "framer-motion";

export default function WeddingFooter() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut" as const,
        delay: 0.6,
      },
    },
  };

  const heartVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-3xl shadow-pink-200 p-8 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="text-center"
        variants={heartVariants}
        animate="animate"
      >
        <div className="text-4xl mb-4">💍</div>
        <p className="text-xl font-bold text-gray-800 mb-2">
          באהבה, אביתר ושובל
        </p>
        <p className="text-gray-600">נשמח לראותכם ביום הגדול שלנו</p>
      </motion.div>
    </motion.div>
  );
}
