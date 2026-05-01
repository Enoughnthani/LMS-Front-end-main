import { useState, useCallback, useEffect } from 'react';
import { programResourceService } from '../service/programResourceService';

export const useProgramResources = (programId) => {
  const [contents, setContents] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const loadContents = useCallback(async (folderId = null) => {
    setLoading(true);
    try {
      const data = await programResourceService.getContents(programId, folderId);
      setContents(data);
    } catch (error) {
      console.error('Error loading contents:', error);
    } finally {
      setLoading(false);
    }
  }, [programId]);

  const loadRoot = useCallback(() => loadContents(), [loadContents]);

  useEffect(() => {
    if (programId) loadRoot();
  }, [programId, loadRoot]);

  const openFolder = async (folder) => {
    setCurrentFolder(folder);
    setCurrentPath(prev => [...prev, folder]);
    await loadContents(folder.id);
  };

  const goBack = async () => {
    if (currentPath.length === 0) return;
    const newPath = [...currentPath];
    newPath.pop();
    if (newPath.length === 0) {
      setCurrentFolder(null);
      setCurrentPath([]);
      await loadRoot();
    } else {
      const parent = newPath[newPath.length - 1];
      setCurrentFolder(parent);
      setCurrentPath(newPath);
      await loadContents(parent.id);
    }
  };

  const navigateToPath = async (index) => {
    if (index === -1) {
      setCurrentFolder(null);
      setCurrentPath([]);
      await loadRoot();
    } else {
      const folder = currentPath[index];
      setCurrentFolder(folder);
      setCurrentPath(currentPath.slice(0, index + 1));
      await loadContents(folder.id);
    }
  };

  const createFolder = async (name) => {
    await programResourceService.createFolder(name, programId, currentFolder?.id || null);
    await (currentFolder ? loadContents(currentFolder.id) : loadRoot());
  };

  const uploadFile = async (file) => {
    setUploadProgress(0);
    try {
      await programResourceService.uploadFile(file, programId, currentFolder?.id || null, setUploadProgress);
      await (currentFolder ? loadContents(currentFolder.id) : loadRoot());
    } finally {
      setUploadProgress(null);
    }
  };

  const renameItem = async (id, newName) => {
    await programResourceService.renameItem(id, newName);
    await (currentFolder ? loadContents(currentFolder.id) : loadRoot());
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    await programResourceService.deleteItem(id);
    await (currentFolder ? loadContents(currentFolder.id) : loadRoot());
  };

  const refresh = () => currentFolder ? loadContents(currentFolder.id) : loadRoot();

  return {
    contents,
    currentFolder,
    currentPath,
    loading,
    uploadProgress,
    openFolder,
    goBack,
    navigateToPath,
    createFolder,
    uploadFile,
    renameItem,
    deleteItem,
    refresh
  };
};