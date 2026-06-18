import { useEffect, useState, type ComponentType } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/details";
import Summary from "~/components/summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resume Analyzer" },
  {
    name: "description",
    content: "Detail review of your Resume",
  },
];

type Feedback = {
  ATS: {
    score?: number;
    tips?: { type: "good" | "improve"; tip: string }[];
  };
  overallScore?: number;
  content?: {
    score?: number;
  };
  structure?: {
    score?: number;
  };
  skills?: {
    score?: number;
  };
  toneAndStyle?: {
    score?: number;
  };
};

const SummaryComponent = Summary as ComponentType<{ feedback: Feedback }>;
const ATSComponent = ATS as ComponentType<{
  score: number;
  suggestions: NonNullable<Feedback["ATS"]["tips"]>;
}>;
const DetailsComponent = Details as ComponentType<{ feedback: Feedback }>;

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated, isLoading, navigate, id]);

  useEffect(() => {
    if (!id || loaded) return;

    setLoaded(true);

    const loadResume = async () => {
      try {
        console.log("Loading resume...");

        const resume = await kv.get(`resume_${id}`);

        console.log("Resume from KV:", resume);

        if (!resume) return;

        const data = JSON.parse(resume);

        console.log("Parsed data:", data);
        console.log("Resume path:", data.resumePath);
        console.log("Image path:", data.imagePath);

        // Load PDF
        const resumeBlob = await fs.read(data.resumePath);

        if (!resumeBlob) {
          console.error("Resume blob not found");
          return;
        }

        const pdfBlob = new Blob([resumeBlob], {
          type: "application/pdf",
        });

        const generatedResumeUrl = URL.createObjectURL(pdfBlob);

        setResumeUrl(generatedResumeUrl);

        // Load image
        if (data.imagePath) {
          const imageBlob = await fs.read(data.imagePath);

          console.log("Image blob:", imageBlob);

          if (imageBlob) {
            const generatedImageUrl = URL.createObjectURL(
              new Blob([imageBlob], {
                type: "image/png",
              }),
            );

            setImageUrl(generatedImageUrl);
          }
        }

        setFeedback(data.feedback);

        console.log("Feedback:", data.feedback);
      } catch (error) {
        console.error("Load Resume Error:", error);
      }
    };

    loadResume();

    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [id, loaded]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />

          <span className="text-gray-500 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* Resume Preview */}
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl ? (
            <div className="animate-in fade-in-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
              <a href={resumeUrl} target="_blank">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="Resume Image"
                  alt="Resume"
                />
              </a>
            </div>
          ) : (
            <img
              src="/images/resume-scan-2.gif"
              className="w-full"
              alt="Loading"
            />
          )}
        </section>

        {/* Feedback Section */}
        <section className="feedback-section">
          {/* <h2 className="text-4xl !text-black font-bold">Resume Review</h2> */}

          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in-1000">
              <div>
                <h3 className="font-bold text-2xl">
                  <SummaryComponent feedback={feedback} />
                  <ATSComponent
                    score={feedback.ATS.score || 0}
                    suggestions={feedback.ATS.tips || []}
                  />
                  {/* <DetailsComponent feedback={feedback} />
                  Overall Score: {feedback.overallScore} */}
                </h3>
              </div>

              {/* <div>
                <h3>ATS Score: {feedback.ATS?.score}</h3>
              </div>

              <div>
                <h3>Content Score: {feedback.content?.score}</h3>
              </div>

              <div>
                <h3>Structure Score: {feedback.structure?.score}</h3>
              </div>

              <div>
                <h3>Skills Score: {feedback.skills?.score}</h3>
              </div> */}

              {/* <div>
                <h3>Tone & Style Score: {feedback.toneAndStyle?.score}</h3>
              </div> */}
            </div>
          ) : (
            <img
              src="/images/resume-scan-2.gif"
              className="w-full"
              alt="Loading Feedback"
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
