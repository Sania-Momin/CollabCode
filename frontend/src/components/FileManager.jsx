import { useState, useEffect } from "react";
import "./FileManager.css";

const FileManager = ({ isOpen, onClose, onFileSelect, currentFile, socket, roomId, code }) => {
  const [fileStructure, setFileStructure] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState("file");
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [itemToRename, setItemToRename] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  // Language detection maps
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'json': 'json',
    'xml': 'xml',
    
  };

  const languageInitialContent = {
    'js': '// JavaScript file\nconsole.log("Hello World");',
    'jsx': '// React component\nimport React from "react";\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;',
    'ts': '// TypeScript file\nconsole.log("Hello World");',
    'tsx': '// React TypeScript component\nimport React from "react";\n\nconst App: React.FC = () => {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n};\n\nexport default App;',
    'py': '# Python file\nprint("Hello World")',
    'java': '// Java file\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
    'cpp': '// C++ file\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}',
    'c': '// C file\n#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}',
    
    'php': '<?php\n// PHP file\necho "Hello World";\n?>',
    'rb': '# Ruby file\nputs "Hello World"',
    'go': '// Go file\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}',
    'rs': '// Rust file\nfn main() {\n    println!("Hello World");\n}'
  };

  // Real-time file structure synchronization
  useEffect(() => {
    if (!socket) return;

    const handlers = {
      fileStructureUpdate: (structure) => {
        console.log("📁 File structure updated:", structure);
        setFileStructure(structure);
      },
      fileCreated: (item) => {
        console.log("✅ File created:", item);
        setFileStructure((prev) => {
          if (prev.some(existing => existing.id === item.id)) return prev;
          return [...prev, item];
        });
      },
      fileDeleted: (id) => {
        console.log("🗑️ File deleted:", id);
        setFileStructure((prev) => prev.filter((item) => item.id !== id));
        setExpandedFolders(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      },
      fileRenamed: ({ id, name }) => {
        console.log("✏️ File renamed:", id, name);
        setFileStructure((prev) =>
          prev.map((item) => (item.id === id ? { ...item, name } : item))
        );
      },
      fileContentUpdated: ({ id, content }) => {
        console.log("💾 File content updated:", id);
        setFileStructure((prev) =>
          prev.map((item) => (item.id === id ? { ...item, content } : item))
        );
      },
      // NEW: Handle file selection from other users
      fileSelected: (file) => {
        console.log("📂 File selected by another user:", file);
        if (file && file.type === "file") {
          // Auto-open the file that another user selected
          onFileSelect(file);
          // Auto-expand the parent folder for better UX
          if (file.parentId) {
            setExpandedFolders(prev => new Set(prev).add(file.parentId));
          }
        }
      },
      // NEW: Handle folder expansion from other users
      folderExpanded: (folderId) => {
        console.log("📂 Folder expanded by another user:", folderId);
        setExpandedFolders(prev => new Set(prev).add(folderId));
      },
      folderCollapsed: (folderId) => {
        console.log("📂 Folder collapsed by another user:", folderId);
        setExpandedFolders(prev => {
          const newSet = new Set(prev);
          newSet.delete(folderId);
          return newSet;
        });
      }
    };

    // Register all event handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Request initial file structure
    socket.emit("getFileStructure", { roomId });

    return () => {
      Object.keys(handlers).forEach(event => {
        socket.off(event);
      });
    };
  }, [socket, roomId, onFileSelect]);

 // Auto-save functionality - UPDATED to broadcast changes
useEffect(() => {
  if (!currentFile || !socket) return;

  const autoSaveTimer = setTimeout(() => {
    if (code !== undefined && code !== currentFile.content) {
      socket.emit("updateFileContent", {
        roomId,
        fileId: currentFile.id,
        content: code,
      });
      
      // ALSO update local file structure immediately
      setFileStructure(prev =>
        prev.map(item =>
          item.id === currentFile.id ? { ...item, content: code } : item
        )
      );
      
      console.log("🔄 Auto-saved and broadcasted file:", currentFile.name);
    }
  }, 2000);

  return () => clearTimeout(autoSaveTimer);
}, [code, currentFile, socket, roomId]);

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      const wasExpanded = newSet.has(folderId);
      
      if (wasExpanded) {
        newSet.delete(folderId);
        // Emit folder collapse to other users
        socket.emit("folderCollapsed", { roomId, folderId });
      } else {
        newSet.add(folderId);
        // Emit folder expansion to other users
        socket.emit("folderExpanded", { roomId, folderId });
      }
      return newSet;
    });
  };

  const handleFileClick = (file) => {
    if (file.type === "file") {
      // Select file locally
      onFileSelect(file);
      
      // NEW: Broadcast file selection to all other users in the room
      socket.emit("fileSelected", { roomId, file });
      
      console.log("📤 File selection broadcasted:", file.name);
      
      // Auto-close file manager on mobile
      if (window.innerWidth < 768) {
        onClose();
      }
    } else {
      toggleFolder(file.id);
    }
  };

  const createItem = () => {
  if (!newItemName.trim()) return;

  // Auto-detect language for initial content based on file extension
  const fileExtension = newItemName.split('.').pop()?.toLowerCase();
  const initialContent = languageInitialContent[fileExtension] || "// Start coding here";

  const newItem = {
    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: newItemName,
    type: newItemType,
    parentId: selectedParentId,
    content: newItemType === "file" ? initialContent : null,
    createdAt: new Date().toISOString(),
    createdBy: "user",
    lastModified: new Date().toISOString(),
  };

  setActiveAction(`Creating ${newItemType}...`);
  socket.emit("createItem", { roomId, item: newItem });
  
  // NEW: If it's a file, auto-detect language and broadcast to ALL users
  if (newItemType === "file") {
    const detectedLanguage = languageMap[fileExtension] || 'javascript';
    
    // Broadcast language change to ALL users (including yourself)
    socket.emit("languageChange", { roomId, language: detectedLanguage });
    console.log(`🔄 Broadcasting language change to ${detectedLanguage} for new file: ${newItem.name}`);
    
    // Small delay to ensure file is created on server first, then open it
    setTimeout(() => {
      onFileSelect(newItem);
      socket.emit("fileSelected", { roomId, file: newItem, language: detectedLanguage });
    }, 100);
  }
  
  setShowNewItemModal(false);
  setNewItemName("");
  setSelectedParentId(null);
  
  setTimeout(() => setActiveAction(null), 2000);
};
  const getAllChildren = (parentId) => {
    const children = fileStructure.filter(item => item.parentId === parentId);
    let allChildren = children.map(c => c.id);
    
    children.forEach(child => {
      if (child.type === "folder") {
        allChildren = [...allChildren, ...getAllChildren(child.id)];
      }
    });
    
    return allChildren;
  };

  const renameItem = () => {
    if (!newItemName.trim() || !itemToRename) return;

    setActiveAction("Renaming...");
    socket.emit("renameItem", {
      roomId,
      itemId: itemToRename.id,
      name: newItemName,
    });

    setShowRenameModal(false);
    setNewItemName("");
    setItemToRename(null);
    setTimeout(() => setActiveAction(null), 2000);
  };

  // ✅ Add this function inside FileManager component (after renameItem and before handleContextMenu)
const deleteItem = (item) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${item.type === "folder" ? "folder" : "file"} "${item.name}"?` +
    (item.type === "folder" ? "\nThis will also delete all contents inside the folder." : "")
  );
  
  if (!confirmDelete) return;

  setActiveAction(`Deleting ${item.type}...`);

  // Get all children if it's a folder
  const childrenIds = getAllChildren(item.id);

  // Emit delete event for item and its children
  [item.id, ...childrenIds].forEach(itemId => {
    socket.emit("deleteItem", { roomId, itemId });
  });

  // Close context menu
  setContextMenu(null);

  // Reset action indicator after 2 seconds
  setTimeout(() => setActiveAction(null), 2000);
};


  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const openNewItemModal = (type, parentId = null) => {
    setNewItemType(type);
    setSelectedParentId(parentId);
    setShowNewItemModal(true);
    setContextMenu(null);
  };

  const saveCurrentFile = () => {
  if (currentFile && code !== undefined) {
    setActiveAction("Saving...");
    socket.emit("updateFileContent", {
      roomId,
      fileId: currentFile.id,
      content: code,
    });
    
    // Update local state immediately
    setFileStructure(prev =>
      prev.map(item =>
        item.id === currentFile.id ? { ...item, content: code } : item
      )
    );
    
    setTimeout(() => setActiveAction(null), 1500);
  }
};

  const getFileIcon = (fileName, isFolder = false, isExpanded = false) => {
    if (isFolder) {
      return isExpanded ? "📂" : "📁";
    }

    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const iconMap = {
      js: "📜", jsx: "⚛️", ts: "🔷", tsx: "⚛️",
      py: "🐍", java: "☕", cpp: "⚙️", c: "⚙️",
      html: "🌐", css: "🎨", json: "📋",
      md: "📝", txt: "📄", xml: "📄",
      php: "🐘", rb: "💎", go: "🔷", rs: "🦀"
    };
    
    return iconMap[ext] || "📄";
  };

  const getFileTreeItems = (parentId = null, level = 0) => {
    return fileStructure
      .filter(item => item.parentId === parentId)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map(item => {
        const isFolder = item.type === "folder";
        const isExpanded = expandedFolders.has(item.id);
        const isActive = currentFile?.id === item.id;

        return (
          <div key={item.id} className="file-tree-node">
            <div
              className={`file-tree-item ${isActive ? "active" : ""} ${isFolder ? "folder" : "file"}`}
              style={{ paddingLeft: `${level * 20 + 12}px` }}
              onClick={() => handleFileClick(item)}
              onDoubleClick={() => isFolder && toggleFolder(item.id)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              title={item.name}
            >
              <span className="item-icon">
                {getFileIcon(item.name, isFolder, isExpanded)}
              </span>
              <span className="item-name">{item.name}</span>
              {isFolder && (
                <span className="folder-arrow">
                  {isExpanded ? "▼" : "▶"}
                </span>
              )}
              {item === currentFile && (
                <span className="active-indicator" title="Currently open">●</span>
              )}
            </div>
            {isFolder && isExpanded && (
              <div className="folder-children">
                {getFileTreeItems(item.id, level + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && currentFile) {
      e.preventDefault();
      saveCurrentFile();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentFile]);

  if (!isOpen) return null;

  return (
    <>
      <div className="file-manager-overlay" onClick={onClose}>
        <div className="file-manager-container" onClick={(e) => e.stopPropagation()}>
          <div className="file-manager-header">
            <div className="header-title">
              <h2>📁 Collaborative File Manager</h2>
              {activeAction && <span className="action-indicator">{activeAction}</span>}
            </div>
            <button className="close-btn" onClick={onClose} title="Close (ESC)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="file-manager-toolbar">
            <div className="toolbar-group">
              <button 
                className="toolbar-btn" 
                onClick={() => openNewItemModal("file")}
                title="Create New File"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                New File
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => openNewItemModal("folder")}
                title="Create New Folder"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
                New Folder
              </button>
            </div>
            
            <div className="toolbar-group">
              {currentFile && (
                <button 
                  className="toolbar-btn save-btn" 
                  onClick={saveCurrentFile}
                  title="Save Current File (Ctrl+S)"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save {currentFile.name}
                </button>
              )}
            </div>
          </div>

          <div className="file-tree-container">
            {fileStructure.filter(item => !item.parentId).length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <p>No files or folders yet</p>
                <span>Create your first file or folder to get started</span>
                <button 
                  className="create-first-btn"
                  onClick={() => openNewItemModal("file")}
                >
                  Create Your First File
                </button>
              </div>
            ) : (
              <div className="file-tree">
                {getFileTreeItems()}
              </div>
            )}
          </div>

          <div className="file-manager-footer">
            <div className="footer-info">
              {currentFile && (
                <span className="current-file-info">
                  Active: {currentFile.name}
                </span>
              )}
              <span className="file-count">
                {fileStructure.filter(f => f.type === 'file').length} files, 
                {fileStructure.filter(f => f.type === 'folder').length} folders
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div 
            className="context-menu-overlay" 
            onClick={() => setContextMenu(null)} 
          />
          <div
            className="context-menu"
            style={{ 
              left: Math.min(contextMenu.x, window.innerWidth - 200),
              top: Math.min(contextMenu.y, window.innerHeight - 200)
            }}
          >
            {contextMenu.item.type === "folder" && (
              <>
                <button onClick={() => openNewItemModal("file", contextMenu.item.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  </svg>
                  New File in Folder
                </button>
                <button onClick={() => openNewItemModal("folder", contextMenu.item.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  New Subfolder
                </button>
                <div className="context-menu-divider" />
              </>
            )}
            <button
              onClick={() => {
                setItemToRename(contextMenu.item);
                setNewItemName(contextMenu.item.name);
                setShowRenameModal(true);
                setContextMenu(null);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Rename
            </button>
            <button 
              className="delete-btn" 
              onClick={() => deleteItem(contextMenu.item)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          </div>
        </>
      )}

      {/* New Item Modal */}
      {showNewItemModal && (
        <div className="modal-overlay" onClick={() => setShowNewItemModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New {newItemType === "file" ? "File" : "Folder"}</h3>
            <input
              type="text"
              placeholder={`Enter ${newItemType} name ${newItemType === "file" ? "(e.g., app.js)" : ""}`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createItem()}
              autoFocus
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setShowNewItemModal(false)}
              >
                Cancel
              </button>
              <button 
                className="create-btn" 
                onClick={createItem}
                disabled={!newItemName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="modal-overlay" onClick={() => setShowRenameModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Rename {itemToRename?.type}</h3>
            <input
              type="text"
              placeholder="Enter new name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && renameItem()}
              autoFocus
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setShowRenameModal(false)}
              >
                Cancel
              </button>
              <button 
                className="create-btn" 
                onClick={renameItem}
                disabled={!newItemName.trim()}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileManager;