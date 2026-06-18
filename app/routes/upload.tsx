import Navbar from "~/components/navbar";
import React, { useState } from "react";
import FileUploader from "~/components/FileUploader";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

interface FeedbackResponse {
  message: {
    content: string | string[];
  };
}

const Upload = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState<string>();

  const handleFileselect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    try {
      // Upload resume
      setStatusText("Uploading resume...");
      const uploadedFile = await window.puter.fs.upload([file]);

      if (!uploadedFile) {
        setStatusText("Failed to upload resume");
        return;
      }

      console.log("Uploaded Resume:", uploadedFile);

      // Convert PDF to image
      setStatusText("Converting PDF...");
      console.log("Starting PDF conversion...");
      const imageFile = await convertPdfToImage(file);

      if (!imageFile.file) {
        console.error("PDF conversion failed:", imageFile.error);
        setStatusText("Failed to convert PDF");
        return;
      }

      console.log("PDF conversion completed");

      // Upload image
      setStatusText("Uploading image...");
      const uploadedImage = await window.puter.fs.upload([imageFile.file]);

      if (!uploadedImage) {
        setStatusText("Failed to upload image");
        return;
      }

      console.log("Uploaded Image:", uploadedImage);

      // Generate ID
      const uuid = generateUUID();

      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };

      // Save initial data
      await window.puter.kv.set(`resume_${uuid}`, JSON.stringify(data));
      const resumeText = await window.puter.ai.img2txt(uploadedImage.path);

      console.log("Resume text:", resumeText);

      // Analyze resume
      setStatusText("Analyzing resume...");

      const prompt = `
Job Title:
${jobTitle}

Job Description:
${jobDescription}

Resume Content:
${resumeText}

${prepareInstructions({
  jobTitle,
  jobDescription,
})}
`;

      console.log("Prompt:", prompt);
      console.log("Available AI methods:", Object.keys(window.puter.ai));

      const feedback = await window.puter.ai.chat(prompt);

      console.log("AI Response:", feedback);

      if (!feedback) {
        setStatusText("Failed to analyze resume");
        return;
      }

      const feedbackResponse = feedback as FeedbackResponse;
      let feedbackText = "";

      if (typeof feedback === "string") {
        feedbackText = feedback;
      } else if (typeof feedbackResponse.message?.content === "string") {
        feedbackText = feedbackResponse.message.content;
      } else if (Array.isArray(feedbackResponse.message?.content)) {
        feedbackText = feedbackResponse.message.content
          .map((item: any) =>
            typeof item === "string"
              ? item
              : (item?.text ?? JSON.stringify(item)),
          )
          .join("\n");
      } else {
        feedbackText = JSON.stringify(feedback, null, 2);
      }

      console.log("Feedback Text:", feedbackText);

      // Update data with feedback
      try {
        data.feedback = JSON.parse(feedbackText);
      } catch (error) {
        console.error("Failed to parse feedback JSON:", error);
        data.feedback = feedbackText;
      }

      await window.puter.kv.set(`resume_${uuid}`, JSON.stringify(data));

      console.log("Saved Data:", data);

      setStatusText("Analysis complete!");

      navigate(`/resume/${uuid}`);
    } catch (error) {
      console.error("Analysis Error:", error);
      setStatusText("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    console.log({
      companyName,
      jobTitle,
      jobDescription,
    });
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    // const formData = new FormData(e.currentTarget);

    handleAnalyze({
      companyName: formData.get("company-name") as string,
      jobTitle: formData.get("job-title") as string,
      jobDescription: formData.get("job-description") as string,
      file,
    });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart Feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>

              <img
                src="/images/resume-scan.gif"
                alt="Processing"
                className="w-full"
              />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}

          {!isProcessing && (
            <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
              <div className="w-full text-left">
                <label htmlFor="company-name" className="block mb-2">
                  Company Name
                </label>

                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="Enter company name"
                />
              </div>

              <div className="w-full text-left">
                <label htmlFor="job-title" className="block mb-2">
                  Job Title
                </label>

                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="Enter job title"
                />
              </div>

              <div className="w-full text-left">
                <label htmlFor="job-description" className="block mb-2">
                  Job Description
                </label>

                <textarea
                  rows={5}
                  name="job-description"
                  id="job-description"
                  placeholder="Enter job description"
                />
              </div>

              <div className="w-full text-left">
                <label htmlFor="uploader" className="block mb-2">
                  Upload Resume
                </label>

                <FileUploader onfileSelect={handleFileselect} />
              </div>

              <button type="submit" className="primary-button">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
