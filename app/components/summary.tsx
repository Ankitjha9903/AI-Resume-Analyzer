import Scoregage from "./scoregage";

type CategoryScore = {
  score: number;
  tips: {
    type: "good" | "improve";
    tip: string;
    explanation?: string;
  }[];
};

const getTextColor = (score: number) =>
  score >= 70
    ? "text-green-600"
    : score >= 50
      ? "text-yellow-600"
      : "text-red-600";

const getBgColor = (score: number) =>
  score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";

const Category = ({
  title,
  score,
}: {
  title: string;
  score: CategoryScore;
}) => {
  const textColor = getTextColor(score.score);
  const bgColor = getBgColor(score.score);

  return (
    <div className="bg-gray-50 rounded-3xl p-5 flex items-center gap-5">
      <div className="flex-1">
        <h3 className="text-2xl font-bold">{title}</h3>

        <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`${bgColor} h-full rounded-full transition-all duration-500`}
            style={{
              width: `${score.score}%`,
            }}
          />
        </div>
      </div>

      <div className={`text-3xl font-bold ${textColor}`}>{score.score}/100</div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full flex flex-col gap-6">
      {/* Overall Score */}
      <div className="flex flex-row items-center gap-6">
        <Scoregage score={feedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-bold">Your Resume Score</h2>

          <p className="text-gray-500">
            This score is calculated based on the metrics below.
          </p>
        </div>
      </div>

      {/* Categories */}
      <Category title="ATS" score={feedback.ATS} />

      <Category title="Tone & Style" score={feedback.toneAndStyle} />

      <Category title="Content" score={feedback.content} />

      <Category title="Structure" score={feedback.structure} />

      <Category title="Skills" score={feedback.skills} />
    </div>
  );
};

export default Summary;
