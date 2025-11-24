import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <FullScreenOverlay>
      <LoaderModal>
        <LoaderWrapper>
          <div className="loader"></div>
        </LoaderWrapper>

        <LoadingText>
          <h2>AGRIFUSION</h2>
          <StatusText>Loading<span className="dots">...</span></StatusText>
        </LoadingText>
      </LoaderModal>
    </FullScreenOverlay>
  );
};

const FullScreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

const LoaderModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 3rem 4rem;
  border-radius: 1.5rem;
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(16, 185, 129, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: modalFadeIn 0.3s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @media (max-width: 640px) {
    padding: 2rem 2.5rem;
    gap: 1.5rem;
  }
`;

const LoaderWrapper = styled.div`
  padding: 2rem;
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.4);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(16, 185, 129, 0.08);

  .loader {
    width: 5em;
    height: 5em;
    background: linear-gradient(-45deg, #10b981 0%, #14b8a6 100%);
    animation: spin 3s infinite;
    position: relative;
  }

  .loader::before {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #10b981 0%, #14b8a6 100%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
  }

  @keyframes spin {
    0% {
      transform: rotate(-45deg);
      border-radius: 0%;
    }
    50% {
      transform: rotate(-360deg);
      border-radius: 10%;
    }
    100% {
      transform: rotate(-45deg);
      border-radius: 0%;
    }
  }

  @media (max-width: 640px) {
    padding: 1.5rem;

    .loader {
      width: 4em;
      height: 4em;
    }
  }
`;

const LoadingText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    background: linear-gradient(90deg, #10b981 0%, #14b8a6 50%, #10b981 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  @media (max-width: 640px) {
    h2 {
      font-size: 1rem;
      letter-spacing: 0.15em;
    }
  }
`;

const StatusText = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  font-family: 'Monaco', 'Courier New', monospace;
  letter-spacing: 0.05em;

  .dots {
    display: inline-block;
    animation: blink 1.5s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`;

export default Loader;
