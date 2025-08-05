import WeddingCard from "./ui/WeddingCard";

export default function WeddingFooter() {
  return (
    <div className="text-center mt-20 mb-8">
      <WeddingCard variant="gradient">
        <div className="text-center">
          <div className="text-3xl mb-4">💍</div>
          <p className="text-xl font-medium text-gray-800 mb-2">
            באהבה, אביתר ושובל
          </p>
          <p className="text-gray-600">נשמח לראותכם ביום הגדול שלנו</p>
        </div>
      </WeddingCard>
    </div>
  );
}
