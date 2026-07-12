import React, { useState, useEffect, useRef } from "react";
import { 
  FolderOpen, Cloud, Upload, ExternalLink, RefreshCw, FolderPlus, 
  FileText, File, AlertTriangle, Check, Loader2, Lock, LogOut, 
  Info, Folder, Search, Trash2, CheckCircle2 
} from "lucide-react";
import { initAuth, googleSignIn, logout, getAccessToken } from "../lib/firebase";
import { listDriveFiles, createDriveFolder, uploadDriveFile, deleteDriveFile, GoogleDriveFile } from "../lib/googleDriveApi";
import { User } from "firebase/auth";

interface CoutureDriveProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export default function CoutureDrive({ profile }: CoutureDriveProps) {
  // Auth states
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // File states
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "images" | "documents" | "folders">("all");
  
  // Custom Workspace states ("Moh Stylist Couture" folder)
  const [workspaceFolderId, setWorkspaceFolderId] = useState<string | null>(null);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "workspace">("workspace");

  // Interactive transaction states
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Initialize Authentication on Mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setNeedsAuth(false);
        detectAndLoadWorkspace(currentToken);
      },
      () => {
        setNeedsAuth(true);
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // 2. Detect Workspace Folder on connection
  const detectAndLoadWorkspace = async (accessToken: string) => {
    setIsFetching(true);
    setErrorMessage(null);
    try {
      // Look for folders named "Moh Stylist Couture"
      const query = "name = 'Moh Stylist Couture' and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
      const matchedFolders = await listDriveFiles(accessToken, query);
      
      if (matchedFolders && matchedFolders.length > 0) {
        setWorkspaceFolderId(matchedFolders[0].id);
        await loadFiles(accessToken, matchedFolders[0].id, "workspace");
      } else {
        setWorkspaceFolderId(null);
        await loadFiles(accessToken, null, "all");
      }
    } catch (err: any) {
      console.error("Error detecting workspace folder:", err);
      setErrorMessage("Failed to establish secure connection with Google Drive workspace.");
    } finally {
      setIsFetching(false);
    }
  };

  // 3. Load files either from root or from workspace folder
  const loadFiles = async (accessToken: string, folderId: string | null, mode: "all" | "workspace") => {
    setIsFetching(true);
    setErrorMessage(null);
    try {
      let query = "trashed = false";
      if (mode === "workspace" && folderId) {
        query = `'${folderId}' in parents and trashed = false`;
      }
      
      const allFiles = await listDriveFiles(accessToken, query);
      setFiles(allFiles);
    } catch (err: any) {
      console.error("Error loading files:", err);
      setErrorMessage("Unable to fetch directory listing. Please check your network or try logging in again.");
    } finally {
      setIsFetching(false);
    }
  };

  // Trigger manual reloading
  const handleReload = async () => {
    if (!token) return;
    if (viewMode === "workspace" && workspaceFolderId) {
      await loadFiles(token, workspaceFolderId, "workspace");
    } else {
      await loadFiles(token, null, "all");
    }
  };

  // 4. Connect with Google Action
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        await detectAndLoadWorkspace(result.accessToken);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMessage("Authorization canceled or failed. Please allow the popup to complete Google login.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 5. Disconnect / Log out
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setFiles([]);
      setWorkspaceFolderId(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // 6. Create Couture Workspace Folder
  const handleCreateWorkspace = async () => {
    if (!token) return;
    setIsCreatingWorkspace(true);
    setErrorMessage(null);
    try {
      const newFolder = await createDriveFolder(token, "Moh Stylist Couture");
      setWorkspaceFolderId(newFolder.id);
      setViewMode("workspace");
      setSuccessMessage("Successfully provisioned safe 'Moh Stylist Couture' directory!");
      setTimeout(() => setSuccessMessage(null), 3500);
      await loadFiles(token, newFolder.id, "workspace");
    } catch (err: any) {
      console.error("Failed to create workspace:", err);
      setErrorMessage("Could not create the 'Moh Stylist Couture' folder. Please try again.");
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  // 7. Sync Profile & Sizing Card to Google Drive
  const handleSyncProfile = async () => {
    if (!token) return;
    setSyncStatus("syncing");
    setErrorMessage(null);
    try {
      // Build aesthetic couture digital measurement card text
      const specString = `===================================================================
MOH STYLIST COUTURE - CLIENT BESPOKE DIGITAL CARD
===================================================================
Client Profile Name  : ${profile.name}
Email Address        : ${profile.email}
Mobile Number        : ${profile.phone}
Primary Studio Ingress: ${profile.address}

Synced Date          : ${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
Local Sync Time      : ${new Date().toLocaleTimeString()}

===================================================================
RUNWAY SIZE PROFILE & FITTING METRICS
===================================================================
- Frame Fitting Model : Bespoke Custom Tailoring
- Stylist Signature   : Moh Stylist Studio, Nairobi, Kenya
- Standard Shoe Size  : EU 41 / EU 42 Match
- Design Focus        : Premium Beaded Embroidery & swahili Accents
- Verified Status     : Active Digital Consultation Desk

===================================================================
STYLING HQ NOTATIONS & DISPATCH INSTRUCTIONS
===================================================================
This document serves as your live synced sizing and reference card
stored directly inside your personal Google Drive account. Moh Stylist
design desk can query this synced card to verify tailoring metrics
prior to initiating stitching on custom runway collection pieces.

Thank you for choosing Moh Stylist Couture!
===================================================================`;

      const blob = new Blob([specString], { type: "text/plain" });
      const parentId = workspaceFolderId || undefined;
      
      // Upload as Moh_Stylist_Sizing_Specs.txt
      await uploadDriveFile(token, blob, "Moh_Stylist_Sizing_Specs.txt", "text/plain", parentId);
      
      setSyncStatus("success");
      setSuccessMessage("Your couture sizing specs are successfully synced to your Google Drive!");
      setTimeout(() => setSyncStatus("idle"), 2500);
      setTimeout(() => setSuccessMessage(null), 4000);
      
      // Refresh list
      await handleReload();
    } catch (err: any) {
      console.error("Error syncing profile specs:", err);
      setSyncStatus("error");
      setErrorMessage("Failed to sync your sizing profile specs. Please check Drive storage limits.");
    }
  };

  // 8. Upload local document/file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0 || !token) return;
    
    const localFile = fileList[0];
    setUploadStatus("uploading");
    setErrorMessage(null);

    try {
      const parentId = workspaceFolderId || undefined;
      await uploadDriveFile(token, localFile, localFile.name, localFile.type, parentId);
      
      setUploadStatus("success");
      setSuccessMessage(`Uploaded "${localFile.name}" successfully!`);
      setTimeout(() => setUploadStatus("idle"), 2500);
      setTimeout(() => setSuccessMessage(null), 4000);
      
      // Clear input
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Refresh list
      await handleReload();
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setUploadStatus("error");
      setErrorMessage(`Upload failed: ${err.message || "Please check file formats or folder permission."}`);
    }
  };

  // 9. Delete file (MANDATORY explicit confirmation prompt!)
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!token) return;
    
    // Explicit Confirmation Dialog - Mandatory for destructive operations!
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}" from your Google Drive? This action is permanent and cannot be undone.`
    );
    if (!confirmed) return;

    setIsFetching(true);
    setErrorMessage(null);
    try {
      await deleteDriveFile(token, fileId);
      setSuccessMessage(`Successfully deleted "${fileName}"`);
      setTimeout(() => setSuccessMessage(null), 3000);
      await handleReload();
    } catch (err: any) {
      console.error("Failed to delete file:", err);
      setErrorMessage(`Could not delete "${fileName}". Please ensure you have write permissions for this item.`);
    } finally {
      setIsFetching(false);
    }
  };

  // Filter files based on search box and category selectors
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === "all") return true;
    if (filterType === "images") return f.mimeType.startsWith("image/");
    if (filterType === "documents") return f.mimeType.includes("pdf") || f.mimeType.includes("text") || f.mimeType.includes("document") || f.mimeType.includes("spreadsheet") || f.mimeType.includes("presentation");
    if (filterType === "folders") return f.mimeType === "application/vnd.google-apps.folder";
    return true;
  });

  return (
    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h3 className="text-md font-semibold uppercase tracking-wider text-amber-500 font-display flex items-center gap-2">
            <Cloud className="h-5 w-5 text-amber-500" />
            <span>Couture Design Drive</span>
          </h3>
          <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
            Link your personal Google Drive to safely back up design specifications, runway reference images, and custom styling profiles.
          </p>
        </div>
        
        {user && (
          <div className="flex items-center gap-3 bg-zinc-900/50 p-2 pl-3 pr-1.5 rounded-full border border-zinc-850 self-start sm:self-center">
            <div className="text-left">
              <span className="block text-[10px] font-bold text-zinc-300 font-mono leading-none">{user.displayName || "Google User"}</span>
              <span className="text-[9px] text-zinc-500 font-mono">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="h-7 w-7 rounded-full bg-zinc-950 hover:bg-red-500/15 border border-zinc-800 hover:border-red-500/20 flex items-center justify-center text-zinc-400 hover:text-red-400 duration-200 cursor-pointer"
              title="Disconnect Google Drive"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* LOGIN STATE COVER */}
      {needsAuth ? (
        <div className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center shadow-lg relative">
            <FolderOpen className="h-8 w-8 text-amber-400" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 flex items-center justify-center text-[8px] text-black font-bold">G</span>
            </span>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-200 font-display uppercase tracking-wider">Unite your Couture files</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Authenticate via Google Secure Handshake. This enables real-time synchronization of custom fitting briefs, tailoring invoices, and mood boards.
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-white text-zinc-900 font-bold text-xs rounded-xl hover:bg-zinc-100 transition-all active:scale-95 duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                <span>Opening Google Secure Handshake...</span>
              </>
            ) : (
              <>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
          
          <div className="flex items-center gap-1.5 text-[9px] text-zinc-600 font-mono">
            <Lock className="h-3 w-3 text-emerald-500/50" />
            <span>Encrypted. Access tokens never stored persistently.</span>
          </div>
        </div>
      ) : (
        /* CONNECTED DASHBOARD */
        <div className="space-y-6">
          {/* Top Quick Control Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Sizing Profile Sync Card */}
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>Interactive Sizing Syncer</span>
                </div>
                <h4 className="text-xs font-semibold text-zinc-200 mt-1">Bespoke Fitting Specification Card</h4>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                  Export and update a live digital fit spec sheet containing your current measurements ({profile.name}) to your Google Drive folder instantly.
                </p>
              </div>
              <button
                onClick={handleSyncProfile}
                disabled={syncStatus === "syncing"}
                className="w-full sm:w-auto self-start mt-1 py-2 px-4 bg-amber-500 text-black hover:bg-amber-400 font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 duration-150 transition-all cursor-pointer disabled:opacity-50"
              >
                {syncStatus === "syncing" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Syncing metrics...</span>
                  </>
                ) : syncStatus === "success" ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Specs Synced!</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3" />
                    <span>Sync Fit Specs to Drive</span>
                  </>
                )}
              </button>
            </div>

            {/* Local file uploader card */}
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                  <Upload className="h-3.5 w-3.5 text-amber-500" />
                  <span>Design Upload Desk</span>
                </div>
                <h4 className="text-xs font-semibold text-zinc-200 mt-1">Upload Local Sizing, Sketches, or Photos</h4>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                  Upload images, PDFs, or layout documents from your device directly into your secure workspace drive folder.
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,application/pdf,text/plain"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadStatus === "uploading"}
                  className="w-full sm:w-auto py-2 px-4 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg border border-zinc-800 flex items-center justify-center gap-1.5 duration-150 transition-all cursor-pointer disabled:opacity-50"
                >
                  {uploadStatus === "uploading" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
                      <span>Uploading item...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-3 w-3 text-amber-400" />
                      <span>Select & Upload File</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* WORKSPACE DIRECTORY ALERTS & PROVISIONING */}
          {!workspaceFolderId ? (
            <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-amber-500 block">Workspace Folder Not Found</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Create a dedicated workspace folder named <strong className="text-zinc-200">"Moh Stylist Couture"</strong> to keep your design assets perfectly partitioned.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreateWorkspace}
                disabled={isCreatingWorkspace}
                className="py-2 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1.5 duration-150 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isCreatingWorkspace ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Creating folder...</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="h-3.5 w-3.5" />
                    <span>Create Couture Folder</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-emerald-500/5 p-3 px-4 rounded-xl border border-emerald-500/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[11px] text-zinc-400">
                  Connected to Synced Folder: <strong className="text-emerald-400 font-mono">Moh Stylist Couture</strong>
                </span>
              </div>
              <span className="text-[9px] text-zinc-500 font-mono uppercase">Synced Vault</span>
            </div>
          )}

          {/* ERRORS / SUCCESS BOXES */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs space-y-1">
              <span className="font-semibold block text-red-400">Drive Sync Notice</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span className="font-semibold text-emerald-300">{successMessage}</span>
            </div>
          )}

          {/* FILES BROWSER CARD */}
          <div className="bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden space-y-4 pt-4">
            {/* Toolbar */}
            <div className="px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
              {/* Directory Filter Toggle */}
              <div className="flex items-center gap-1.5 bg-zinc-900/40 p-1 rounded-lg border border-zinc-850">
                {workspaceFolderId && (
                  <button
                    onClick={() => {
                      setViewMode("workspace");
                      loadFiles(token!, workspaceFolderId, "workspace");
                    }}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      viewMode === "workspace" 
                        ? "bg-amber-400 text-black font-bold" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Workspace Folder Only
                  </button>
                )}
                <button
                  onClick={() => {
                    setViewMode("all");
                    loadFiles(token!, null, "all");
                  }}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    viewMode === "all" || !workspaceFolderId
                      ? "bg-amber-400 text-black font-bold" 
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  All Drive Files
                </button>
              </div>

              {/* Refresh & Search */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search folder files..."
                    className="bg-zinc-900 border border-zinc-850 rounded-lg py-1.5 pl-8 pr-3 text-[11px] text-white focus:outline-none focus:border-amber-500/40 placeholder-zinc-600 font-mono"
                  />
                </div>
                
                <button
                  onClick={handleReload}
                  disabled={isFetching}
                  className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 rounded-lg text-zinc-400 hover:text-white duration-150 cursor-pointer disabled:opacity-50"
                  title="Reload files"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-amber-400" : ""}`} />
                </button>
              </div>
            </div>

            {/* Type Filter Selectors */}
            <div className="px-4 flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
              <span className="text-zinc-500 font-semibold uppercase font-mono text-[9px] tracking-wider shrink-0 mr-1">Filter Mime:</span>
              {[
                { type: "all", label: "All Items" },
                { type: "images", label: "Images & Sketches" },
                { type: "documents", label: "Fitting Specs & PDFs" },
                { type: "folders", label: "Directories" }
              ].map(opt => (
                <button
                  key={opt.type}
                  onClick={() => setFilterType(opt.type as any)}
                  className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold transition-colors shrink-0 cursor-pointer ${
                    filterType === opt.type 
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold" 
                      : "bg-zinc-900/20 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Directory Listing Grid */}
            <div className="px-4 pb-4">
              {isFetching ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider animate-pulse">Communicating with Google Drive ledger...</span>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="py-12 text-center bg-zinc-900/10 rounded-xl border border-dashed border-zinc-900 flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                  <FolderOpen className="h-6 w-6 text-zinc-700" />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-zinc-400 block">No Synced Files Found</span>
                    <p className="text-[10px] text-zinc-600 leading-relaxed px-4">
                      {searchQuery 
                        ? "No items matched your current search parameters. Clear search or select another category."
                        : `Your couture workspace folder is empty. Sync your measurement specs above or upload lookbook files to get started!`
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {filteredFiles.map(file => {
                    const isFolder = file.mimeType === "application/vnd.google-apps.folder";
                    const isDoc = file.mimeType.includes("pdf") || file.mimeType.includes("text") || file.mimeType.includes("document");
                    const isImg = file.mimeType.startsWith("image/");

                    return (
                      <div 
                        key={file.id} 
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all duration-150 bg-zinc-900/15 ${
                          isFolder 
                            ? "border-amber-500/15 hover:border-amber-500/35 hover:bg-amber-500/5" 
                            : "border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* File Type Icon */}
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            isFolder 
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                              : isImg 
                              ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                              : isDoc
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          }`}>
                            {isFolder ? (
                              <Folder className="h-4 w-4" />
                            ) : isImg ? (
                              <Upload className="h-4 w-4" />
                            ) : isDoc ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <File className="h-4 w-4" />
                            )}
                          </div>

                          {/* File metadata details */}
                          <div className="min-w-0 text-left">
                            <span 
                              className="block text-xs font-semibold text-zinc-200 truncate pr-2 font-mono hover:text-amber-400 transition-colors"
                              title={file.name}
                            >
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono mt-0.5">
                              {file.size && (
                                <span>{(parseInt(file.size) / 1024).toFixed(1)} KB</span>
                              )}
                              {file.modifiedTime && (
                                <span>{new Date(file.modifiedTime).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* File Action Controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {file.webViewLink && (
                            <a 
                              href={file.webViewLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="h-7 w-7 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white duration-150 cursor-pointer"
                              title="Open file in Google Drive"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                          
                          <button
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            className="h-7 w-7 rounded-lg bg-zinc-900 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/25 flex items-center justify-center text-zinc-500 hover:text-red-400 duration-150 cursor-pointer"
                            title="Delete file permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
