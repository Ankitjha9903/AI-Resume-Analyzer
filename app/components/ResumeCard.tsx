import { Link } from "react-router";
import ScoreCircle from "./scoreCircle";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath, resumePath },
}: {
  resume: Resume;
}) => {
  return (
    <Link
      to={"/resume/${resume.id}"}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text=black font-bold wrap-break-word">
            {companyName}{" "}
          </h2>
          <h3 className="text-lg wrap-break-word text-gray-500">
            {" "}
            {jobTitle}{" "}
          </h3>
        </div>
        <div className="flex=shrink=0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      <div>
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={imagePath}
              alt="Resume"
              className="w-full h-[350px]  object-cover object-top"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
