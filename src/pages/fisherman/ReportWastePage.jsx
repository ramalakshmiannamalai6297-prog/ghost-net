import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import LeafletMap from '../../components/common/LeafletMap';
import { classifyMarineImage } from '../../services/aiClassification';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Globe, 
  AlertCircle,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  Navigation,
  Wifi,
  WifiOff
} from 'lucide-react';

export const ReportWastePage = () => {
  const { createReport, showToast, isOnline } = useApp();
  const navigate = useNavigate();

  // Stepper State: 1 = Photo, 2 = Classification, 3 = Location & Details, 4 = Review
  const [currentStep, setCurrentStep] = useState(1);

  // Photo State
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  // AI Classification state
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [wasteType, setWasteType] = useState('Fishing Net');
  const [category, setCategory] = useState('Derelict Fishing Gear');
  const [confidence, setConfidence] = useState(87);

  // Location State
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null); // 'detected' | 'denied' | 'error' | null
  const [locationErrorMessage, setLocationErrorMessage] = useState('');

  // Date & Time (Initialized to current client time)
  const [reportedDate, setReportedDate] = useState(() => 
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [reportedTime, setReportedTime] = useState(() => 
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );

  // Description & Hazard Severity
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('High');

  // Speech Recognition State
  const [isRecording, setIsRecording] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('en-IN'); // 'en-IN' | 'hi-IN' | 'mr-IN' | 'ta-IN'
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef(null);

  // Validation Error State
  const [validationError, setValidationError] = useState('');

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Real Photo Upload & Validation
  const handlePhotoSelect = (e) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type against JPG, JPEG, PNG, WEBP
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setPhotoError('Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    // Max 15MB limit
    if (file.size > 15 * 1024 * 1024) {
      setPhotoError('Image size exceeds 15MB. Please choose a smaller photo.');
      return;
    }

    setPhotoFile(file);
    setPhotoName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoUrl(event.target.result);
      setPhotoError('');
    };
    reader.onerror = () => {
      setPhotoError('Failed to read the selected image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    setPhotoFile(null);
    setPhotoName('');
    setPhotoError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Step 1 -> Step 2: Proceed to Classification
  const handleProceedToClassification = async () => {
    if (!photoUrl) {
      setPhotoError('Please select or capture a photo before continuing.');
      return;
    }
    setPhotoError('');
    setCurrentStep(2);
    setIsAiProcessing(true);

    try {
      const result = await classifyMarineImage(photoFile || photoUrl);
      setWasteType(result.wasteType);
      setCategory(result.category);
      setConfidence(result.confidence);
      if (result.severity) setSeverity(result.severity);
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Real Geolocation API (Requirement 12)
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus(null);
    setLocationErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = parseFloat(position.coords.latitude.toFixed(5));
        const lng = parseFloat(position.coords.longitude.toFixed(5));
        setLatitude(lat);
        setLongitude(lng);
        const fallbackName = `Lat: ${lat}° N, Lng: ${lng}° E`;
        setLocationName(fallbackName);
        setLocationStatus('detected');
        showToast('Current GPS coordinates detected.', 'success');

        // Optional reverse geocode for locality
        if (navigator.onLine) {
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                const parts = data.display_name.split(',');
                const cleanName = parts.slice(0, 3).join(',').trim();
                setLocationName(cleanName || fallbackName);
              }
            })
            .catch(() => {
              // keep coordinates string
            });
        }
      },
      (error) => {
        setIsLocating(false);
        setLocationStatus('denied');
        if (error.code === error.PERMISSION_DENIED) {
          setLocationErrorMessage('Location access was denied. Please enable location permission in your browser settings or enter the location manually.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationErrorMessage('Location information is currently unavailable. Please click on the map to set coordinates manually.');
        } else {
          setLocationErrorMessage('Location request timed out. Please try again or select your location on the map.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  // Real Speech Recognition (Requirements 10 & 11)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setSpeechError('Speech recognition is not supported in this browser. Please type your description manually or use Chrome.');
      return;
    }

    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsRecording(false);
      return;
    }

    // Start recording
    setSpeechError('');
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = speechLanguage;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const results = event.results;
        const latestTranscript = results[results.length - 1][0].transcript;
        if (latestTranscript) {
          setDescription((prev) => {
            const cleanPrev = prev.trim();
            return cleanPrev ? `${cleanPrev} ${latestTranscript}` : latestTranscript;
          });
          showToast('Speech recorded and converted to text', 'success');
        }
      };

      recognition.onerror = (event) => {
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access was denied. Please allow microphone permission in your browser settings.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech was detected. Please speak clearly into the microphone.');
        } else {
          setSpeechError(`Voice input error (${event.error}). Please type your description manually.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsRecording(false);
      setSpeechError('Could not start microphone service. Please ensure microphone permissions are granted.');
    }
  };

  // Step 3 -> Step 4: Proceed to Review
  const handleProceedToReview = () => {
    setValidationError('');
    if (latitude === null || longitude === null) {
      setValidationError('Please obtain or specify incident coordinates on the map.');
      return;
    }
    if (!description.trim()) {
      setValidationError('Please provide a description of the marine waste found.');
      return;
    }
    // Update date/time to exact client timestamp
    const now = new Date();
    setReportedDate(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    setReportedTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    setCurrentStep(4);
  };

  // Final Report Submission (Requirement 16)
  const handleSubmitReport = () => {
    setValidationError('');

    // Strict Validation
    if (!photoUrl) {
      setValidationError('A photo of the marine debris is required.');
      setCurrentStep(1);
      return;
    }
    if (!wasteType) {
      setValidationError('Waste classification type is required.');
      setCurrentStep(2);
      return;
    }
    if (latitude === null || longitude === null) {
      setValidationError('Incident location coordinates are required.');
      setCurrentStep(3);
      return;
    }
    if (!description.trim()) {
      setValidationError('Please describe what you found before submitting.');
      setCurrentStep(3);
      return;
    }

    const newReport = createReport({
      wasteType,
      category,
      confidence,
      latitude,
      longitude,
      locationName: locationName || `Coordinates (${latitude}, ${longitude})`,
      description: description.trim(),
      severity,
      priority: severity === 'High' ? 'High' : 'Medium',
      beforeImage: photoUrl
    });

    navigate('/fisherman/report-success', {
      state: { report: newReport }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Connectivity & Stepper Header */}
      <div className="bg-white rounded border border-slate-200 p-4 sm:p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Report Marine Waste</h1>
              {/* Online / Offline status indicator */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit photo and GPS coordinates to alert coastal cleanup authorities
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Step {currentStep} of 4
          </span>
        </div>

        {/* 4 Steps Indicator */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6">
          {[
            { num: 1, label: 'Upload Photo' },
            { num: 2, label: 'Classification' },
            { num: 3, label: 'Location & Details' },
            { num: 4, label: 'Review & Submit' },
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div key={s.num} className="flex flex-col items-center sm:items-start">
                <div className={`w-full h-1.5 rounded mb-2 ${
                  isCompleted ? 'bg-sky-600' : isCurrent ? 'bg-sky-500' : 'bg-slate-200'
                }`} />
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCompleted ? 'bg-sky-600 text-white' : isCurrent ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : s.num}
                  </span>
                  <span className={isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500 hidden sm:inline'}>
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Validation Error Banner */}
      {validationError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-start gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: REAL PHOTO UPLOAD (Requirement 8) */}
      {currentStep === 1 && (
        <div className="bg-white rounded border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upload Marine Waste Photo</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an image from your device or mobile camera
            </p>
          </div>

          {photoError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{photoError}</span>
            </div>
          )}

          {/* Upload Area / Real Preview */}
          <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-lg p-6 sm:p-8 text-center bg-slate-50/50 transition">
            {photoUrl ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="relative rounded overflow-hidden border border-slate-200 aspect-video shadow-xs bg-black">
                  <img
                    src={photoUrl}
                    alt="Uploaded marine waste"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded font-mono truncate max-w-[280px]">
                    {photoName || 'marine_waste_photo.jpg'}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800 bg-white border border-slate-300 px-3.5 py-1.5 rounded shadow-2xs transition"
                  >
                    Change Photo
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-white border border-rose-200 hover:bg-rose-50 px-3.5 py-1.5 rounded shadow-2xs transition"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-6">
                <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center mx-auto border border-sky-200">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    Select a photo of the marine debris
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Accepts JPG, JPEG, PNG, and WEBP formats
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold px-5 py-2.5 rounded transition shadow-xs inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Photo from Device</span>
                  </button>
                </div>
              </div>
            )}

            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleProceedToClassification}
              className="bg-sky-700 hover:bg-sky-800 text-white font-semibold px-6 py-2.5 rounded text-xs transition flex items-center gap-2 shadow-xs"
            >
              <span>Continue to Classification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: WASTE CLASSIFICATION (Requirement 9) */}
      {currentStep === 2 && (
        <div className="bg-white rounded border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Waste Classification</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated computer vision analysis for marine waste identification
            </p>
          </div>

          {isAiProcessing ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-10 h-10 border-3 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="font-semibold text-slate-800 text-sm">
                Analyzing image…
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Processing marine waste geometry, netting patterns, and buoyancy profile.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Image Preview with Detection Badge */}
                <div className="relative rounded overflow-hidden border border-slate-200 aspect-video shadow-xs bg-black">
                  <img
                    src={photoUrl}
                    alt="Classified marine waste"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                    {wasteType} &bull; {confidence}%
                  </div>
                </div>

                {/* AI Result Card */}
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Waste Type</span>
                      <span className="text-sm font-bold text-slate-900">{wasteType}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Confidence:</span>
                        <span className="font-bold text-sky-700">{confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">Category</span>
                      <span className="font-semibold text-slate-800">{category}</span>
                    </div>
                  </div>

                  {/* Manual Category Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Confirm or Adjust Waste Category:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Fishing Net', 'Plastic Waste', 'Other Marine Waste'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setWasteType(type);
                            if (type === 'Fishing Net') setCategory('Derelict Fishing Gear');
                            else if (type === 'Plastic Waste') setCategory('Rigid HDPE Debris & Packaging');
                            else setCategory('Miscellaneous Coastal Litter');
                          }}
                          className={`p-2.5 rounded border text-left text-xs transition ${
                            wasteType === type
                              ? 'border-sky-700 bg-sky-50 ring-1 ring-sky-700 font-bold text-sky-950'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded text-xs border border-slate-300 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // Default initial coordinates to coastal area if not set
                    if (latitude === null) {
                      setLatitude(18.9802);
                      setLongitude(72.8214);
                      setLocationName('Mumbai Coastal Area');
                    }
                    setCurrentStep(3);
                  }}
                  className="bg-sky-700 hover:bg-sky-800 text-white font-semibold px-5 py-2.5 rounded text-xs transition flex items-center gap-2 shadow-xs"
                >
                  <span>Continue to Location & Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: LOCATION & DETAILS (Requirements 10, 11, 12, 13, 15) */}
      {currentStep === 3 && (
        <div className="bg-white rounded border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Location and Report Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm GPS coordinates and describe the marine debris found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Geolocation & Map */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  <span>Incident Coordinates</span>
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="text-xs font-semibold text-sky-800 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded transition flex items-center gap-1.5"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Getting your location…' : 'Use Current Location'}</span>
                </button>
              </div>

              {/* Status alerts for location */}
              {locationStatus === 'detected' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Actual GPS location detected successfully.</span>
                </div>
              )}

              {locationStatus === 'denied' && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{locationErrorMessage}</span>
                </div>
              )}

              {/* Leaflet Map with location marker */}
              <LeafletMap
                center={[latitude || 18.9802, longitude || 72.8214]}
                zoom={12}
                height="220px"
                interactiveLocationSelect={true}
                selectedLocation={latitude ? { lat: latitude, lng: longitude } : null}
                onLocationSelect={(pos) => {
                  setLatitude(pos.lat);
                  setLongitude(pos.lng);
                  setLocationName(`Coordinates: ${pos.lat}° N, ${pos.lng}° E`);
                  setLocationStatus(null);
                }}
              />
              <div className="text-[11px] text-slate-400 italic">
                Tip: Click or drag marker on map to fine-tune location coordinates.
              </div>

              {/* Coordinates & Location Sector */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Latitude:</span>
                  <div className="font-mono font-bold text-slate-800">{latitude ?? 'Not set'}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Longitude:</span>
                  <div className="font-mono font-bold text-slate-800">{longitude ?? 'Not set'}</div>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Location Name / Sector:</span>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Near Sassoon Dock Channel"
                    className="w-full font-medium text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 mt-0.5 focus:outline-none focus:ring-1 focus:ring-sky-600 text-xs"
                  />
                </div>
              </div>

              {/* Timestamp */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-[10px] text-slate-400">Date</div>
                    <div className="font-semibold text-slate-800">{reportedDate}</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-[10px] text-slate-400">Time</div>
                    <div className="font-semibold text-slate-800">{reportedTime}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Functional Microphone & Description (Requirements 10 & 11) */}
            <div className="space-y-4">
              {/* Language Selector for Voice */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-sky-700" />
                    <span>Voice Input Language</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Speech recognition
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'en-IN', label: 'English' },
                    { code: 'hi-IN', label: 'हिंदी (Hindi)' },
                    { code: 'mr-IN', label: 'मराठी (Marathi)' },
                    { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSpeechLanguage(lang.code)}
                      className={`text-xs px-2.5 py-1 rounded border transition ${
                        speechLanguage === lang.code
                          ? 'bg-sky-700 text-white border-sky-700 font-semibold'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Functional Microphone Button & Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Describe what you found
                  </label>
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition border ${
                      isRecording
                        ? 'bg-rose-100 text-rose-800 border-rose-400 animate-pulse'
                        : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block"></span>
                        <MicOff className="w-3.5 h-3.5 text-rose-600" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-sky-700" />
                        <span>Describe by Voice</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Speech recognition errors if any */}
                {speechError && (
                  <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{speechError}</span>
                  </div>
                )}
                {!speechSupported && (
                  <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                    Speech recognition is not supported in this browser. Please type your description manually or use Chrome.
                  </div>
                )}

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Large fishing net found near the coast floating 200m offshore..."
                  className="w-full text-xs p-3 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-600 bg-white text-slate-800 leading-relaxed"
                />
              </div>

              {/* Hazard Severity Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Severity / Hazard Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { level: 'Low', desc: 'Floating minor debris', color: 'border-slate-300' },
                    { level: 'Medium', desc: 'Obstruction to small craft', color: 'border-amber-300' },
                    { level: 'High', desc: 'Propeller hazard / reef risk', color: 'border-rose-400' },
                  ].map((s) => (
                    <button
                      key={s.level}
                      type="button"
                      onClick={() => setSeverity(s.level)}
                      className={`p-2.5 rounded border text-left text-xs transition ${
                        severity === s.level
                          ? 'border-sky-700 bg-sky-50 ring-1 ring-sky-700 font-semibold'
                          : `${s.color} hover:bg-slate-50 bg-white`
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{s.level}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="bg-white hover:bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded text-xs border border-slate-300 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToReview}
              className="bg-sky-700 hover:bg-sky-800 text-white font-semibold px-5 py-2.5 rounded text-xs transition flex items-center gap-2 shadow-xs"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SUBMIT (Requirements 14 & 16) */}
      {currentStep === 4 && (
        <div className="bg-white rounded border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Review Your Report</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Please verify all details before submitting to coastal authorities
            </p>
          </div>

          {/* Offline notice if currently offline */}
          {!isOnline && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
              <WifiOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Offline Notice:</strong> You are currently offline. Your report will be securely saved locally on this device and synchronized automatically when connection returns.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 rounded border border-slate-200 p-5">
            {/* Photo Thumbnail */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Photo Evidence</span>
              <div className="rounded overflow-hidden border border-slate-200 aspect-video bg-black shadow-xs">
                <img
                  src={photoUrl}
                  alt="Review evidence"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-[11px] text-slate-500 font-mono truncate">
                {photoName || 'marine_waste_photo.jpg'}
              </div>
            </div>

            {/* Specifications */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">Waste Type:</span>
                  <div className="font-bold text-slate-900 text-sm">{wasteType}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Confidence:</span>
                  <div className="font-bold text-sky-700 text-sm">{confidence}%</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Location:</span>
                  <div className="font-semibold text-slate-800">{locationName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Lat: {latitude}, Lng: {longitude}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Date & Time:</span>
                  <div className="font-semibold text-slate-800">{reportedDate} &bull; {reportedTime}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Hazard Severity:</span>
                  <div className={`inline-block font-semibold px-2 py-0.5 rounded text-xs mt-0.5 ${
                    severity === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {severity}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-medium">Description:</span>
                <p className="mt-1 text-slate-800 bg-white p-3 rounded border border-slate-200 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="bg-white hover:bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded text-xs border border-slate-300 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitReport}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded text-xs transition shadow-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportWastePage;
