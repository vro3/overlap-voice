import React, { useState, useEffect } from 'react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>(
    localStorage.getItem('selectedAudioDeviceId') || ''
  );
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const getAudioDevices = async () => {
      try {
        // Request permission first
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissionGranted(true);

        // Then enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setAudioDevices(audioInputs);
      } catch (error) {
        console.error('Failed to get audio devices:', error);
        setPermissionGranted(false);
      }
    };

    if (isOpen) {
      getAudioDevices();
    }
  }, [isOpen]);

  const handleAudioDeviceChange = (deviceId: string) => {
    setSelectedAudioDeviceId(deviceId);
    localStorage.setItem('selectedAudioDeviceId', deviceId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-sidebar border border-border-subtle rounded-2xl shadow-lg p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-bold text-primary">Microphone Settings</h2>
          <button onClick={onClose} className="p-2 text-muted hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!permissionGranted ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12.066 11.2a1 1 0 000 1.6c.784.57 1.99 1.465 3.348 1.465 2.646 0 5.586-1.496 5.586-4.391V9.325c0-2.895-2.94-4.391-5.586-4.391-1.357 0-2.564.895-3.348 1.465a1 1 0 000 1.6m0 5.6c.784.57 1.99 1.466 3.348 1.466 2.646 0 5.586-1.496 5.586-4.391V3.933c0-2.895-2.94-4.391-5.586-4.391-1.357 0-2.564.895-3.348 1.465" />
            </svg>
            <p className="text-primary font-medium mb-2">Microphone Permission Required</p>
            <p className="text-muted text-sm">Click the audio settings button again to grant microphone access</p>
          </div>
        ) : audioDevices.length > 0 ? (
          <div>
            <label className="block text-[13px] text-muted font-medium mb-3">Select Your Microphone</label>
            <select
              value={selectedAudioDeviceId}
              onChange={(e) => handleAudioDeviceChange(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-primary text-[14px] focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none"
            >
              <option value="">Default Device</option>
              {audioDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
            <p className="text-[12px] text-muted mt-3">Your selection will be remembered for future sessions</p>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted text-sm">No microphone devices found</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2.5 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default AudioSettingsModal;
