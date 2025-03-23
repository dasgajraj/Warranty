import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Image, 
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Scan QR, 2: Upload Receipt, 3: Enter Email
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleQRCodeScanned = ({ data }) => {
    setScanned(true);
    setQrData(data);
    // Move to next step automatically after scanning
    setTimeout(() => setStep(2), 1000);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to take receipt photos');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Gallery access is needed to select receipt photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const submitData = async () => {
    // Validate email
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }
    
    // Validate all required data is present
    if (!qrData) {
      Alert.alert("Missing QR Code", "Please scan a QR code first");
      setStep(1);
      return;
    }
    
    if (!receiptImage) {
      Alert.alert("Missing Receipt", "Please upload a receipt image");
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('email', email);
      formData.append('qr_data', qrData);
      
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(receiptImage);
      console.log("File info:", fileInfo);
      
      // Extract filename and type
      const filename = receiptImage.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      // Properly append the image file to FormData
      formData.append('receipt', {
        uri: receiptImage,
        name: filename,
        type: type
      });
      
      // Log all form data entries before sending
      console.log("Form data details:");
      console.log("Email:", email);
      console.log("QR Data:", qrData);
      console.log("Receipt URI:", receiptImage);
      console.log("Filename:", filename);
      console.log("MIME Type:", type);
      
      // Check if this is the correct endpoint
      const endpoint = 'http://192.168.43.234:5000/api/register-warranty/';


      console.log("Sending request to:", endpoint);
      
      // Make API request to the specified endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);
      
      if (response.ok) {
        Alert.alert(
          "Success!", 
          "Your warranty has been activated successfully.",
          [{ text: "OK", onPress: resetForm }]
        );
      } else {
        const errorData = await response.text();
        console.error("Server error response:", errorData);
        throw new Error('Server returned ' + response.status);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert(
        "Submission Failed", 
        "There was a problem activating your warranty. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setQrData("");
    setReceiptImage(null);
    setEmail("");
    setScanned(false);
    setStep(1);
  };

  const moveToNextStep = () => {
    if (step === 2 && !receiptImage) {
      Alert.alert("Missing Receipt", "Please upload a receipt image first");
      return;
    }
    setStep(step + 1);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const moveToPreviousStep = () => {
    setStep(step - 1);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <MaterialIcons name="camera" size={60} color="#3498db" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialIcons name="error" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>No access to camera</Text>
        <Text style={styles.errorSubtext}>Camera permission is required to scan QR codes</Text>
      </SafeAreaView>
    );
  }

  const renderStepProgress = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepRow}>
        <View style={[styles.stepCircle, step >= 1 && styles.activeStep]}>
          <Text style={styles.stepNumber}>1</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.stepCircle, step >= 2 && styles.activeStep]}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.stepCircle, step >= 3 && styles.activeStep]}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
      </View>
      <View style={styles.stepLabelContainer}>
        <Text style={styles.stepLabel}>Scan QR</Text>
        <Text style={styles.stepLabel}>Receipt</Text>
        <Text style={styles.stepLabel}>Submit</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Warranty Activation</Text>
          {renderStepProgress()}
        </View>
        
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.cameraContainer}>
              <CameraView
                onBarcodeScanned={scanned ? undefined : handleQRCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                style={styles.camera}
              />
              
              {/* Scanner Frame */}
              <View style={styles.scannerFrame}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </View>
              
              {/* Instructions */}
              <View style={styles.instructionContainer}>
                <MaterialIcons name="qr-code-scanner" size={24} color="#ffffff" />
                <Text style={styles.instructionText}>
                  Scan the QR Code to activate warranty
                </Text>
              </View>
            </View>
            
            {/* Scan Results */}
            {scanned && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>QR Code Detected</Text>
                <Text style={styles.resultText} numberOfLines={2} ellipsizeMode="tail">
                  {qrData}
                </Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={styles.secondaryButton} 
                    onPress={() => setScanned(false)}
                  >
                    <Text style={styles.secondaryButtonText}>Scan Again</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.primaryButton} 
                    onPress={() => moveToNextStep()}
                  >
                    <Text style={styles.buttonText}>Continue</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        
        {step === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>Upload Receipt</Text>
              <Text style={styles.cardSubtitle}>Please take a photo of your purchase receipt</Text>
              
              {receiptImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: receiptImage }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.removeButton} 
                    onPress={() => setReceiptImage(null)}
                  >
                    <MaterialIcons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <MaterialIcons name="receipt" size={60} color="#bdc3c7" />
                  <Text style={styles.placeholderText}>No receipt uploaded yet</Text>
                </View>
              )}
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                  <MaterialIcons name="camera-alt" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <MaterialIcons name="photo-library" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.navigationRow}>
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={moveToPreviousStep}
                >
                  <MaterialIcons name="arrow-back" size={20} color="#3498db" />
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.primaryButton, !receiptImage && styles.disabledButton]} 
                  onPress={moveToNextStep}
                  disabled={!receiptImage}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        
        {step === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>Submit Information</Text>
              <Text style={styles.cardSubtitle}>Enter your email to receive warranty confirmation</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Scanned QR Code</Text>
                <View style={styles.infoBox}>
                  <MaterialIcons name="qr-code" size={20} color="#3498db" />
                  <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">{qrData}</Text>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Receipt</Text>
                <View style={styles.thumbnailContainer}>
                  <Image source={{ uri: receiptImage }} style={styles.thumbnail} />
                  <Text style={styles.thumbnailText}>Receipt image attached</Text>
                </View>
              </View>
              
              <View style={styles.navigationRow}>
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={moveToPreviousStep}
                  disabled={isSubmitting}
                >
                  <MaterialIcons name="arrow-back" size={20} color="#3498db" />
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.primaryButton, 
                    (!email || isSubmitting) && styles.disabledButton
                  ]} 
                  onPress={submitData}
                  disabled={!email || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Activate Warranty</Text>
                      <MaterialIcons name="check" size={20} color="#fff" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#3498db",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  errorSubtext: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#7f8c8d",
  },
  header: {
    backgroundColor: "#3498db",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
  },
  stepContainer: {
    marginTop: 10,
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: "white",
  },
  stepNumber: {
    color: "#3498db",
    fontWeight: "bold",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 5,
  },
  stepLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  stepLabel: {
    color: "white",
    fontSize: 12,
    flex: 1,
    textAlign: "center",
  },
  stepContent: {
    padding: 20,
    flex: 1,
  },
  cameraContainer: {
    height: 350,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  scannerFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerTL: {
    position: "absolute",
    top: 80,
    left: 80,
    height: 30,
    width: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
  },
  cornerTR: {
    position: "absolute",
    top: 80,
    right: 80,
    height: 30,
    width: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
  },
  cornerBL: {
    position: "absolute",
    bottom: 80,
    left: 80,
    height: 30,
    width: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
  },
  cornerBR: {
    position: "absolute",
    bottom: 80,
    right: 80,
    height: 30,
    width: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
  },
  instructionContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  instructionText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3498db",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: "#3498db",
    fontWeight: "bold",
    marginLeft: 5,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 20,
  },
  placeholderContainer: {
    height: 200,
    backgroundColor: "#f5f6fa",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ecf0f1",
    borderStyle: "dashed",
  },
  placeholderText: {
    marginTop: 10,
    color: "#95a5a6",
    fontSize: 16,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 20,
  },
  imagePreview: {
    height: 200,
    width: "100%",
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(231, 76, 60, 0.8)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f5f6fa",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  infoBox: {
    backgroundColor: "#f5f6fa",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  infoText: {
    fontSize: 16,
    color: "#34495e",
    marginLeft: 10,
    flex: 1,
  },
  thumbnailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  thumbnailText: {
    marginLeft: 10,
    color: "#34495e",
    fontSize: 16,
  }
});