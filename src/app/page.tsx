"use client";

import type React from "react";

import { useState } from "react";
import {
  Folder,
  File,
  FileText,
  ImageIcon,
  Film,
  Music,
  Code,
  Upload,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

// Mock data structure
const mockData = {
  root: {
    type: "folder",
    name: "My Drive",
    children: ["documents", "images", "work"],
  },
  documents: {
    type: "folder",
    name: "Documents",
    parent: "root",
    children: ["project-proposal", "resume", "meeting-notes"],
  },
  "project-proposal": {
    type: "file",
    name: "Project Proposal.docx",
    parent: "documents",
    fileType: "document",
    size: "2.4 MB",
    url: "#project-proposal",
  },
  resume: {
    type: "file",
    name: "Resume.pdf",
    parent: "documents",
    fileType: "pdf",
    size: "1.2 MB",
    url: "#resume",
  },
  "meeting-notes": {
    type: "file",
    name: "Meeting Notes.txt",
    parent: "documents",
    fileType: "text",
    size: "45 KB",
    url: "#meeting-notes",
  },
  images: {
    type: "folder",
    name: "Images",
    parent: "root",
    children: ["vacation-photos", "profile-pic", "screenshot"],
  },
  "vacation-photos": {
    type: "folder",
    name: "Vacation Photos",
    parent: "images",
    children: ["beach", "mountains"],
  },
  beach: {
    type: "file",
    name: "Beach.jpg",
    parent: "vacation-photos",
    fileType: "image",
    size: "3.2 MB",
    url: "#beach",
  },
  mountains: {
    type: "file",
    name: "Mountains.jpg",
    parent: "vacation-photos",
    fileType: "image",
    size: "2.8 MB",
    url: "#mountains",
  },
  "profile-pic": {
    type: "file",
    name: "Profile Picture.png",
    parent: "images",
    fileType: "image",
    size: "1.5 MB",
    url: "#profile-pic",
  },
  screenshot: {
    type: "file",
    name: "Screenshot.png",
    parent: "images",
    fileType: "image",
    size: "0.8 MB",
    url: "#screenshot",
  },
  work: {
    type: "folder",
    name: "Work",
    parent: "root",
    children: ["presentations", "code-projects", "reports"],
  },
  presentations: {
    type: "folder",
    name: "Presentations",
    parent: "work",
    children: ["quarterly-review"],
  },
  "quarterly-review": {
    type: "file",
    name: "Quarterly Review.pptx",
    parent: "presentations",
    fileType: "presentation",
    size: "5.7 MB",
    url: "#quarterly-review",
  },
  "code-projects": {
    type: "folder",
    name: "Code Projects",
    parent: "work",
    children: ["website-code", "app-code"],
  },
  "website-code": {
    type: "file",
    name: "Website.zip",
    parent: "code-projects",
    fileType: "archive",
    size: "12.3 MB",
    url: "#website-code",
  },
  "app-code": {
    type: "file",
    name: "App.js",
    parent: "code-projects",
    fileType: "code",
    size: "156 KB",
    url: "#app-code",
  },
  reports: {
    type: "file",
    name: "Annual Report.pdf",
    parent: "work",
    fileType: "pdf",
    size: "8.2 MB",
    url: "#annual-report",
  },
};

// Helper function to get file icon based on file type
function getFileIcon(fileType: string) {
  switch (fileType) {
    case "document":
    case "pdf":
    case "text":
      return <FileText className="h-5 w-5" />;
    case "image":
      return <ImageIcon className="h-5 w-5" />;
    case "video":
      return <Film className="h-5 w-5" />;
    case "audio":
      return <Music className="h-5 w-5" />;
    case "code":
      return <Code className="h-5 w-5" />;
    default:
      return <File className="h-5 w-5" />;
  }
}

export default function GoogleDriveClone() {
  const [currentFolder, setCurrentFolder] = useState("root");
  const [path, setPath] = useState<string[]>(["root"]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Get current folder's children
  const getCurrentFolderContents = () => {
    const folder = mockData[currentFolder as keyof typeof mockData] as any;
    if (!folder || !folder.children) return [];

    return folder.children.map((childId: string) => {
      const child = mockData[childId as keyof typeof mockData] as any;
      return {
        id: childId,
        ...child,
      };
    });
  };

  // Navigate to a folder
  const navigateToFolder = (folderId: string) => {
    setCurrentFolder(folderId);

    // Update path
    const newPath = [...path];
    const folderIndex = newPath.indexOf(folderId);

    if (folderIndex !== -1) {
      // If folder is already in path, truncate path to that point
      setPath(newPath.slice(0, folderIndex + 1));
    } else {
      // Add folder to path
      setPath([...newPath, folderId]);
    }
  };

  // Navigate using breadcrumb
  const navigateUsingBreadcrumb = (index: number) => {
    const folderId = path[index];
    navigateToFolder(folderId);
  };

  // Get folder name for breadcrumb
  const getFolderName = (folderId: string) => {
    const folder = mockData[folderId as keyof typeof mockData] as any;
    return folder?.name || folderId;
  };

  // Handle file drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    // Mock file upload - in a real app, you would process the files here
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("Files dropped:", e.dataTransfer.files);
      // Show success message
      alert(`${e.dataTransfer.files.length} file(s) uploaded successfully!`);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0a1220] p-6 text-white"
      onDragEnter={handleDrag}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-medium">Google Drive Clone</h1>

          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-6 py-2 text-white transition-colors hover:bg-blue-600">
                <Upload className="h-5 w-5" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="border-[#1e293b] bg-[#111927] text-white">
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
              </DialogHeader>
              <div
                className={`mt-4 rounded-lg border-2 border-dashed p-10 text-center ${
                  dragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-600"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto mb-4 h-10 w-10 text-gray-400" />
                <p>Drag and drop files here, or click to select files</p>
                <Button className="mt-4 bg-[#2563eb]">Select Files</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center text-sm text-gray-400">
          {path.map((folderId, index) => (
            <div key={folderId} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
              <button
                onClick={() => navigateUsingBreadcrumb(index)}
                className={`hover:text-white ${index === path.length - 1 ? "text-white" : ""}`}
              >
                {getFolderName(folderId)}
              </button>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="overflow-hidden rounded-lg bg-[#111927]">
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b border-[#1e293b] px-6 py-4 text-gray-400">
            <div>Name</div>
            <div>Type</div>
            <div>Size</div>
          </div>

          {/* Table Content */}
          <div>
            {getCurrentFolderContents().map((item: any) => (
              <div
                key={item.id}
                className="grid cursor-pointer grid-cols-3 border-b border-[#1e293b] px-6 py-4 hover:bg-[#172033]"
              >
                {item.type === "folder" ? (
                  // Folder row
                  <div
                    className="flex items-center gap-2 text-white"
                    onClick={() => navigateToFolder(item.id)}
                  >
                    <Folder className="h-5 w-5 text-blue-400" />
                    {item.name}
                  </div>
                ) : (
                  // File row
                  <a
                    href={item.url}
                    className="flex items-center gap-2 text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getFileIcon(item.fileType)}
                    {item.name}
                  </a>
                )}
                <div>
                  {item.type === "folder"
                    ? "Folder"
                    : item.fileType.charAt(0).toUpperCase() +
                      item.fileType.slice(1)}
                </div>
                <div>{item.size || "--"}</div>
              </div>
            ))}

            {getCurrentFolderContents().length === 0 && (
              <div className="px-6 py-10 text-center text-gray-400">
                <Folder className="mx-auto mb-2 h-10 w-10 text-gray-500" />
                <p>This folder is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Drag overlay */}
        {dragActive && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-blue-500/10">
            <div className="rounded-lg border-2 border-blue-500 bg-[#111927] p-6 text-center">
              <Upload className="mx-auto mb-2 h-10 w-10 text-blue-500" />
              <p className="text-xl font-medium">Drop files to upload</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
