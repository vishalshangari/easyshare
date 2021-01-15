import React, { useCallback, useState } from "react";

// Dependencies
import { useDropzone, DropzoneRootProps } from "react-dropzone";
import styled, { keyframes } from "styled-components";
import axios from "axios";

// Icons
import { IoIosCopy } from "react-icons/io";
import { FaRedo } from "react-icons/fa";

const App = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [easyShareKey, setEasyShareKey] = useState("");
  const [isReadyForDrop, setIsReadyForDrop] = useState(true);
  const [isErrorOnUpload, setIsErrorOnUpload] = useState(false);

  const handleResetUpload = () => {
    setIsReadyForDrop(true);
    setIsUploadSuccessful(false);
    setIsUploading(false);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    // If there is an accepted file
    if (acceptedFiles && acceptedFiles.length > 0) {
      setIsUploading(true);
      setIsReadyForDrop(false);
      const file = acceptedFiles[0];
      try {
        await uploadFile(file);
        handleSuccessfulUpload();
      } catch (e) {
        setIsErrorOnUpload(true);
        handleResetUpload();
      }
    }
  }, []);

  const handleSuccessfulUpload = () => {
    setIsUploadSuccessful(true);
    setIsUploading(false);
    setIsReadyForDrop(false);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("ContentType", file.type);
    try {
      const { data: key } = await axios.post(
        "https://easyshare24.herokuapp.com/api/upload",
        formData
      );
      setEasyShareKey(key);
    } catch (error) {
      throw error;
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: "image/*", multiple: false });

  const handleCopyToClipboard = () => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = `https://easyshare24.herokuapp.com/${easyShareKey}`;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  const linkify = (): string => {
    return `https://easyshare24.herokuapp.com/${easyShareKey}`;
  };

  return (
    <StyledApp>
      <AppContainer>
        {isErrorOnUpload && (
          <UploadError>Oops, there was an error. Please try again.</UploadError>
        )}

        <Heading>
          <h1>easyshare</h1>
        </Heading>

        <Splash>
          <h2>one click image sharing</h2>
        </Splash>

        <ActionContainer>
          {isUploading && <UploadingSpinner>Uploading...</UploadingSpinner>}

          {isReadyForDrop && (
            <DropContainer
              {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
            >
              <input {...getInputProps()} name="image" />
              {isDragActive ? (
                isDragAccept ? (
                  <Response>Release to upload!</Response>
                ) : (
                  <Response>Oops, I can't accept this type of file</Response>
                )
              ) : (
                <>
                  <p>
                    Drag 'n' drop a picture here, or click to select a file.
                  </p>
                  <p>Accepted types: .jpg/.jpeg, .png &amp; .gif</p>
                </>
              )}
            </DropContainer>
          )}

          {isUploadSuccessful && (
            <PresentLink>
              <LinkWrap>
                <Link href={linkify()}>{linkify()}</Link>
              </LinkWrap>

              <CopyButton onClick={handleCopyToClipboard}>
                <IoIosCopy />
                <span>Copy to clipboard</span>
              </CopyButton>

              <UploadAgainButton onClick={handleResetUpload}>
                <FaRedo />
                <span>Upload another file</span>
              </UploadAgainButton>
            </PresentLink>
          )}
        </ActionContainer>
      </AppContainer>
    </StyledApp>
  );
};

// Style utilities

const getColor = (props: DropzoneRootProps) => {
  if (props.isDragAccept) {
    return "#1b754a";
  }
  if (props.isDragReject) {
    return "#81182d";
  }
  if (props.isDragActive) {
    return "#2196f3";
  }
  return "rgba(255,255,255,0.05)";
};

const getBorderStyles = (props: DropzoneRootProps) => {
  if (props.isDragActive) {
    return "2px solid transparent";
  }
  return "2px dashed rgba(255,255,255,0.25)";
};

// Styled components

const UploadError = styled.div`
  position: absolute;
  top: 1em;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25em 0.5em;
  border-radius: 0.25em;
  background: #750e0e;
`;

const PresentLink = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Link = styled.a`
  text-decoration: none;
  color: inherit;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const LinkWrap = styled.div`
  padding: 1em 2em;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.5);
  font-size: 4vmin;
  transition: 0.24s ease-in-out all;
  :hover {
    background: rgba(0, 0, 0, 1);
  }
`;

const Button = styled.button`
  margin-top: 2em;
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.75em 1.25em;
  border-radius: 0.5em;
  transition: 0.14s ease-in-out all;
  border: none;
  color: rgba(245, 245, 245, 1);
  span {
    margin-left: 1em;
  }
  :hover {
    cursor: pointer;
  }
`;

const UploadAgainButton = styled(Button)`
  font-size: 1rem;
  background: rgba(255, 0, 255, 0.1);
  :hover {
    background: rgba(255, 0, 255, 0.15);
  }
`;

const CopyButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  :hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const backgroundAnimation = keyframes`
  0% {
    background: #1b754a;
  }
  33% {
    background: #1A4674;
  }
  67% {
    background: #741A46;
  }
  100% {
    background: #74491A;
`;

const UploadingSpinner = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #1b754a;
  animation: ${backgroundAnimation} 2s ease-in-out infinite alternate;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 200%;
  color: rgba(255, 255, 255, 1);
  border-radius: 1rem;
`;

const Splash = styled.div`
  h2 {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 400;
  }
  margin-bottom: 4rem;
`;

const Response = styled.p`
  color: rgba(255, 255, 255, 1);
  font-size: 200%;
`;

const Heading = styled.div`
  h1 {
    font-size: 4.25rem;
    margin-bottom: 0.125em;
    font-weight: 700;
    background: rgb(0, 255, 129);
    background: linear-gradient(
      100deg,
      rgba(0, 255, 129, 1) 0%,
      rgba(45, 184, 255, 1) 25%,
      rgba(217, 99, 255, 1) 50%,
      rgba(255, 129, 36, 1) 75%,
      rgba(255, 61, 29, 1) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: rgba(0, 0, 0, 0.0001);
  }
`;

const DropContainer = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2em;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  background: ${(props) => getColor(props)};
  border: ${(props) => getBorderStyles(props)};
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
  }
  outline: none;
  transition: background 0.24s ease-in-out;
  transition: border 0.24s ease-in-out;
  border-radius: 1rem;
`;

const ActionContainer = styled.div`
  position: relative;
  height: 320px;
  border-radius: 1rem;
`;

const AppContainer = styled.div`
  min-width: 60%;
  max-width: 80%;
`;

const StyledApp = styled.div`
  text-align: center;
  background-color: #0d1117;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fafafa;
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export default App;
