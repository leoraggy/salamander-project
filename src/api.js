export const getThumbnail = async (filename) => {
  const response = await fetch(`/api/thumbnail/${filename}`);

  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`);
  }

  const imageBlob = await response.blob();
  const localImageObjectURL = URL.createObjectURL(imageBlob);
  return localImageObjectURL;
};

export const getVideos = async () => {
  const response = await fetch("api/videos");
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`);
  }
  const video = await response.json();

  return video;
};

export const postProcessingJob = async (filename, targetColor, threshold) => {
  const cleanColor = targetColor.startsWith("#")
    ? targetColor.slice(1)
    : targetColor;

  const url = `/api/process/${filename}?targetColor=${cleanColor}&threshold=${threshold}`;

  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`);
  }

  const data = await response.json();

  return data;
};
export const getJobStatus = async (jobId) => {
  const response = await fetch(`/api/process/${jobId}/status`);

  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  const data = await response.json();

  return data;
};
